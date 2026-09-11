import { EMAIL_OBFUSCATED_RE } from '../extract';
import type { PageEvidence, RuleResult, SiteEvidence } from '../types';
import { matchContext } from '../util';
import { fail, pass, skip } from './helpers';

// Registered company forms that trigger B5 (per brief: GmbH, UG, AG, e.K., KG).
// "mbH" covers spelled-out forms like "Gesellschaft mbH" / "Steuerberatungsgesellschaft mbH".
const B5_FORM_RE = /\b(GmbH|gGmbH|mbH|AG|KGaA|KG|e\.\s?K\.)\b|\bUG\b/;
// Broader set used by the B2 name heuristic.
const COMPANY_FORM_RE =
  /\b(GmbH & Co\. KG|GmbH|gGmbH|mbH|AG|KGaA|KG|OHG|GbR|e\.\s?K\.|e\.\s?V\.|UG \(haftungsbeschränkt\))\b|\bUG\b/;

const VERTRETUNG_RE =
  /vertreten durch|vertretungsberechtigt|geschäftsführer|geschäftsführung|vorstand|inhaber/i;
const REGISTER_RE = /\b(HRB|HRA)\s*[:.]?\s*\d+|handelsregister|registergericht/i;

const STREET_RE =
  /[A-Za-zÄÖÜäöüß0-9.\- ]{2,60}?(straße|strasse|str\.|weg|platz|allee|gasse|ring|damm|ufer|chaussee|markt)\s*\.?,?\s*\d{1,4}\s?[a-zA-Z]?\b/i;
const PLZ_CITY_RE = /\b\d{5}\s+[A-ZÄÖÜ][A-Za-zäöüß().\- ]{2,40}/;
const POBOX_RE = /postfach/i;

// \b keeps "USt" from matching inside words like "Mustermann".
const UST_MENTION_RE = /\bUSt\b|Umsatzsteuer|Mehrwertsteuer|\bMwSt\b/i;
const VATID_RE = /\bDE\s?\d{9}\b/;
const KLEINUNTERNEHMER_RE = /§\s*19\s*UStG|Kleinunternehmer/i;

// Two consecutive capitalized words that are plausibly a person name.
const PERSON_NAME_RE = /([A-ZÄÖÜ][a-zäöüß]+)[ ]([A-ZÄÖÜ][a-zäöüß]+)/g;
const NAME_STOPWORDS = new Set([
  'impressum',
  'angaben',
  'kontakt',
  'telefon',
  'telefax',
  'anschrift',
  'postanschrift',
  'datenschutz',
  'haftung',
  'hinweis',
  'verantwortlich',
  'verantwortliche',
  'umsatzsteuer',
  'pflichtangaben',
  'anbieter',
  'betreiber',
  'vertreten',
  'amtsgericht',
  'registergericht',
  'handelsregister',
  'deutschland',
  'inhalte',
  'streitschlichtung',
  'berufsbezeichnung',
]);

function hasPersonName(text: string): boolean {
  PERSON_NAME_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = PERSON_NAME_RE.exec(text)) !== null) {
    const first = m[1]!.toLowerCase();
    const second = m[2]!.toLowerCase();
    if (!NAME_STOPWORDS.has(first) && !NAME_STOPWORDS.has(second)) return true;
  }
  return false;
}

function hasEmailIndication(page: PageEvidence): boolean {
  return page.emails.length > 0 || EMAIL_OBFUSCATED_RE.test(page.text);
}

/** B1–B7 · Impressum (§ 5 DDG) */
export function runImpressum(site: SiteEvidence): RuleResult[] {
  const results: RuleResult[] = [];
  const imp = site.legalPages.impressum;

  // B1 — Impressum page exists and answered 2xx
  if (!imp) {
    results.push(fail('B1', [{ pageUrl: site.homepage.url, detail: 'Keine Impressum-Seite gefunden' }]));
    const reason = 'Kein Impressum gefunden (siehe B1) — Inhaltsprüfung nicht möglich.';
    for (const id of ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'] as const) {
      results.push(skip(id, reason));
    }
    return results;
  }
  if (imp.httpStatus < 200 || imp.httpStatus >= 300) {
    results.push(
      fail('B1', [{ pageUrl: imp.url, httpStatus: imp.httpStatus, detail: `HTTP ${imp.httpStatus}` }]),
    );
    const reason = 'Impressum-Seite nicht erreichbar (siehe B1) — Inhaltsprüfung nicht möglich.';
    for (const id of ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'] as const) {
      results.push(skip(id, reason));
    }
    return results;
  }
  results.push(pass('B1', [{ pageUrl: imp.url, httpStatus: imp.httpStatus }]));

  const text = imp.text;

  // B2 — a person or company name is recognizable
  const companyCtx = matchContext(text, new RegExp(COMPANY_FORM_RE.source, COMPANY_FORM_RE.flags));
  if (companyCtx || VERTRETUNG_RE.test(text) || hasPersonName(text.slice(0, 1200))) {
    results.push(
      pass('B2', companyCtx ? [{ pageUrl: imp.url, excerpt: companyCtx }] : [{ pageUrl: imp.url }]),
    );
  } else {
    results.push(fail('B2', [{ pageUrl: imp.url, detail: 'Kein Namens-/Firmenmuster erkannt' }]));
  }

  // B3 — postal address pattern (street + PLZ + city); PO-box-only is a warn
  const streetCtx = matchContext(text, new RegExp(STREET_RE.source, STREET_RE.flags));
  const plzCityCtx = matchContext(text, new RegExp(PLZ_CITY_RE.source, PLZ_CITY_RE.flags));
  if (streetCtx && plzCityCtx) {
    results.push(pass('B3', [{ pageUrl: imp.url, excerpt: streetCtx }]));
  } else if (POBOX_RE.test(text) && plzCityCtx) {
    results.push(
      fail('B3', [
        {
          pageUrl: imp.url,
          detail: 'Nur Postfach-Angabe gefunden, keine Straße mit Hausnummer',
          excerpt: matchContext(text, /postfach/i) ?? undefined,
        },
      ]),
    );
  } else {
    results.push(
      fail('B3', [
        { pageUrl: imp.url, detail: 'Kein Muster aus Straße, Postleitzahl und Ort gefunden' },
      ]),
    );
  }

  // B4 — email address present (plain or common obfuscation)
  if (hasEmailIndication(imp)) {
    results.push(
      pass('B4', imp.emails[0] ? [{ pageUrl: imp.url, detail: imp.emails[0] }] : [{ pageUrl: imp.url }]),
    );
  } else {
    results.push(fail('B4', [{ pageUrl: imp.url, detail: 'Keine E-Mail-Adresse erkannt' }]));
  }

  // B5 — registered company form ⇒ Vertretung + register data expected
  if (B5_FORM_RE.test(text)) {
    const missing: string[] = [];
    if (!VERTRETUNG_RE.test(text)) missing.push('Vertretungsberechtigte (z. B. „Vertreten durch“)');
    if (!REGISTER_RE.test(text)) missing.push('Registergericht/Registernummer (z. B. „HRB …“)');
    if (missing.length === 0) {
      results.push(pass('B5', [{ pageUrl: imp.url }]));
    } else {
      results.push(
        fail('B5', [
          {
            pageUrl: imp.url,
            detail: `Fehlend: ${missing.join(' · ')}`,
            excerpt: matchContext(text, new RegExp(B5_FORM_RE.source)) ?? undefined,
          },
        ]),
      );
    }
  } else {
    results.push(skip('B5', 'Keine eingetragene Gesellschaftsform im Impressum erkannt.'));
  }

  // B6 — VAT mentioned ⇒ USt-IdNr. pattern or explicit Kleinunternehmer wording
  if (UST_MENTION_RE.test(text)) {
    if (VATID_RE.test(text)) {
      results.push(
        pass('B6', [{ pageUrl: imp.url, excerpt: matchContext(text, VATID_RE) ?? undefined }]),
      );
    } else if (KLEINUNTERNEHMER_RE.test(text)) {
      results.push(
        pass('B6', [
          { pageUrl: imp.url, excerpt: matchContext(text, KLEINUNTERNEHMER_RE) ?? undefined },
        ]),
      );
    } else {
      results.push(
        fail('B6', [
          {
            pageUrl: imp.url,
            detail: 'Umsatzsteuer erwähnt, aber weder USt-IdNr. noch § 19-UStG-Hinweis gefunden',
            excerpt: matchContext(text, UST_MENTION_RE) ?? undefined,
          },
        ]),
      );
    }
  } else {
    results.push(skip('B6', 'Keine Erwähnung von Umsatzsteuer im Impressum.'));
  }

  // B7 — contact possibility beyond a form (email or phone)
  if (hasEmailIndication(imp) || imp.phones.length > 0) {
    results.push(pass('B7', [{ pageUrl: imp.url }]));
  } else {
    results.push(
      fail('B7', [{ pageUrl: imp.url, detail: 'Weder E-Mail noch Telefonnummer erkannt' }]),
    );
  }

  return results;
}
