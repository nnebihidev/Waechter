import { FAMILY_LABEL_DE, trackingHits } from '../trackers';
import type { RuleResult, SiteEvidence } from '../types';
import { fail, pass, skip } from './helpers';

/** D1–D4 · Cookies / TDDDG (static pass + optional runtime evidence) */
export function runCookies(site: SiteEvidence): RuleResult[] {
  const results: RuleResult[] = [];
  const home = site.homepage;
  const hits = trackingHits(home);
  const consent = home.consent;
  const runtime = site.runtimeCookies ?? null;
  const consentUiPresent = consent !== null || runtime?.consentUiVisible === true;

  // D1 — informational: which tracking/marketing scripts were detected
  if (hits.length > 0) {
    results.push(
      fail(
        'D1',
        hits.map((h) => ({
          pageUrl: home.url,
          detail: FAMILY_LABEL_DE[h.family],
          excerpt: h.source.slice(0, 200),
        })),
      ),
    );
  } else {
    results.push(pass('D1', [{ pageUrl: home.url, detail: 'Keine bekannten Tracking-Skripte erkannt' }]));
  }

  // D3 — marketing/analytics active without a recognizable consent pattern.
  // Runtime cookie evidence (Playwright pass) wins; otherwise static best-effort:
  // tracking scripts hard-embedded in the HTML with no consent UI at all.
  let d3Failed = false;
  if (runtime && runtime.cookiesSetBeforeConsent.length > 0) {
    d3Failed = true;
    results.push(
      fail(
        'D3',
        runtime.cookiesSetBeforeConsent.slice(0, 10).map((c) => ({
          pageUrl: home.url,
          detail: `Cookie „${c.name}“ (${c.domain}) vor Einwilligung gesetzt`,
        })),
      ),
    );
  } else if (hits.length > 0 && !consentUiPresent) {
    d3Failed = true;
    results.push(
      fail(
        'D3',
        hits.map((h) => ({
          pageUrl: home.url,
          detail: `${FAMILY_LABEL_DE[h.family]} lädt ohne erkennbare Einwilligungsabfrage`,
          excerpt: h.source.slice(0, 200),
        })),
      ),
    );
  } else if (hits.length === 0) {
    results.push(skip('D3', 'Keine Tracking-Skripte erkannt.'));
  } else {
    results.push(
      pass('D3', [
        {
          pageUrl: home.url,
          detail:
            'Consent-Mechanismus vorhanden; keine Hinweise auf vorab gesetzte Marketing-Cookies (bestmögliche Prüfung, keine Konformitätsgarantie)',
        },
      ]),
    );
  }

  // D2 — consent UI detected together with tracking scripts (best-effort).
  if (hits.length === 0) {
    results.push(skip('D2', 'Keine Tracking-Skripte erkannt — Consent-Prüfung nicht anwendbar.'));
  } else if (d3Failed && !consentUiPresent) {
    results.push(skip('D2', 'Bereits von D3 erfasst (Skripte ohne Einwilligung aktiv).'));
  } else if (consentUiPresent) {
    results.push(
      pass('D2', [
        {
          pageUrl: home.url,
          selector: consent?.selector,
          detail: consent
            ? `Consent-UI erkannt (${consent.vendor})`
            : 'Consent-UI im Browser-Lauf sichtbar',
          excerpt: consent?.excerpt,
        },
      ]),
    );
  } else {
    results.push(fail('D2', [{ pageUrl: home.url, detail: 'Kein Consent-Banner erkennbar' }]));
  }

  // D4 — pre-checked non-essential boxes in the consent markup
  if (!consent) {
    results.push(skip('D4', 'Kein Consent-Banner im HTML erkannt.'));
  } else if (consent.precheckedNonEssential.length > 0) {
    results.push(
      fail(
        'D4',
        consent.precheckedNonEssential.map((p) => ({
          pageUrl: home.url,
          selector: consent.selector,
          detail: `Vorangekreuzt: „${p.label}“`,
          excerpt: p.excerpt,
        })),
      ),
    );
  } else {
    results.push(pass('D4', [{ pageUrl: home.url, selector: consent.selector }]));
  }

  // Keep stable rule order D1..D4 in the output.
  const order = { D1: 1, D2: 2, D3: 3, D4: 4 } as Record<string, number>;
  results.sort((a, b) => (order[a.id] ?? 9) - (order[b.id] ?? 9));
  return results;
}
