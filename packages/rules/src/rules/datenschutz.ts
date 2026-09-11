import { FAMILY_LABEL_DE, FAMILY_MENTION_RE } from '../trackers';
import type { RuleResult, SiteEvidence } from '../types';
import { matchContext } from '../util';
import { fail, pass, skip } from './helpers';

const CONTROLLER_RE = /verantwortliche(r)?\b|verantwortliche stelle|controller/i;
const RIGHTS_RE = /betroffenenrecht|auskunft|löschung|widerruf|berichtigung|beschwerderecht/i;
const LEGAL_BASIS_RE = /rechtsgrundlage|art\.?\s*6\b|artikel\s*6\b/i;
const RETENTION_RE = /speicherdauer|speicherfrist|aufbewahrung|löschfrist|gelöscht|löschung/i;

/** C1–C6 · Datenschutzerklärung (DSGVO Art. 12–14) */
export function runDatenschutz(site: SiteEvidence): RuleResult[] {
  const results: RuleResult[] = [];
  const ds = site.legalPages.datenschutz;

  // C1 — Datenschutzerklärung exists and answered 2xx
  if (!ds || ds.httpStatus < 200 || ds.httpStatus >= 300) {
    results.push(
      fail('C1', [
        ds
          ? { pageUrl: ds.url, httpStatus: ds.httpStatus, detail: `HTTP ${ds.httpStatus}` }
          : { pageUrl: site.homepage.url, detail: 'Keine Datenschutzerklärung gefunden' },
      ]),
    );
    const reason = 'Keine erreichbare Datenschutzerklärung (siehe C1) — Inhaltsprüfung nicht möglich.';
    for (const id of ['C2', 'C3', 'C4', 'C5', 'C6'] as const) {
      results.push(skip(id, reason));
    }
    return results;
  }
  results.push(pass('C1', [{ pageUrl: ds.url, httpStatus: ds.httpStatus }]));

  const text = ds.text;

  // C2 — controller named
  results.push(
    CONTROLLER_RE.test(text)
      ? pass('C2', [{ pageUrl: ds.url, excerpt: matchContext(text, CONTROLLER_RE) ?? undefined }])
      : fail('C2', [{ pageUrl: ds.url, detail: 'Kein Abschnitt „Verantwortlicher“ erkannt' }]),
  );

  // C3 — data-subject rights mentioned
  results.push(
    RIGHTS_RE.test(text)
      ? pass('C3', [{ pageUrl: ds.url, excerpt: matchContext(text, RIGHTS_RE) ?? undefined }])
      : fail('C3', [{ pageUrl: ds.url, detail: 'Keine Betroffenenrechte erwähnt' }]),
  );

  // C4 — legal basis referenced
  results.push(
    LEGAL_BASIS_RE.test(text)
      ? pass('C4', [{ pageUrl: ds.url, excerpt: matchContext(text, LEGAL_BASIS_RE) ?? undefined }])
      : fail('C4', [{ pageUrl: ds.url, detail: 'Weder „Rechtsgrundlage“ noch Art. 6 erwähnt' }]),
  );

  // C5 — third-party services detected on homepage should be mentioned
  const detected = site.homepage.trackers;
  if (detected.length === 0) {
    results.push(skip('C5', 'Keine Drittanbieter-Dienste auf der Startseite erkannt.'));
  } else {
    const unmentioned = detected.filter((hit) => !FAMILY_MENTION_RE[hit.family].test(text));
    if (unmentioned.length === 0) {
      results.push(
        pass(
          'C5',
          detected.map((hit) => ({ pageUrl: ds.url, detail: `${FAMILY_LABEL_DE[hit.family]}: erwähnt` })),
        ),
      );
    } else {
      results.push(
        fail(
          'C5',
          unmentioned.map((hit) => ({
            pageUrl: site.homepage.url,
            detail: `${FAMILY_LABEL_DE[hit.family]} erkannt, aber in der Datenschutzerklärung nicht erwähnt`,
            excerpt: hit.source.slice(0, 200),
          })),
        ),
      );
    }
  }

  // C6 — storage duration / deletion criteria
  results.push(
    RETENTION_RE.test(text)
      ? pass('C6', [{ pageUrl: ds.url, excerpt: matchContext(text, RETENTION_RE) ?? undefined }])
      : fail('C6', [{ pageUrl: ds.url, detail: 'Keine Angaben zu Speicherdauer oder Löschung' }]),
  );

  return results;
}
