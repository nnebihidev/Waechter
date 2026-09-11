import { classifyLegalLink } from '../classify';
import type { RuleResult, SiteEvidence } from '../types';
import { makeExcerpt } from '../util';
import { fail, pass } from './helpers';

/** A1–A3 · Erreichbarkeit */
export function runErreichbarkeit(site: SiteEvidence): RuleResult[] {
  const results: RuleResult[] = [];
  const home = site.homepage;

  // A1 — homepage answers 2xx
  if (home.httpStatus >= 200 && home.httpStatus < 300) {
    results.push(pass('A1', [{ pageUrl: home.url, httpStatus: home.httpStatus }]));
  } else {
    results.push(
      fail('A1', [
        {
          pageUrl: home.url,
          httpStatus: home.httpStatus,
          detail: `HTTP ${home.httpStatus}`,
        },
      ]),
    );
  }

  // A2 — TLS: fail on plain HTTP or an invalid certificate; unknown TLS state
  // (offline fixture evaluation) passes with a note.
  if (!site.finalIsHttps) {
    results.push(
      fail('A2', [{ pageUrl: site.finalUrl, detail: 'Auslieferung über HTTP ohne TLS' }]),
    );
  } else if (site.tlsValid === false) {
    results.push(fail('A2', [{ pageUrl: site.finalUrl, detail: 'TLS-Zertifikat ungültig' }]));
  } else {
    results.push(
      pass('A2', [
        {
          pageUrl: site.finalUrl,
          detail: site.tlsValid === null ? 'HTTPS; Zertifikat nicht geprüft (Offline-Auswertung)' : 'HTTPS mit gültigem Zertifikat',
        },
      ]),
    );
  }

  // A3 — Impressum AND Datenschutz linked from the homepage
  const kindsLinked = new Set(
    home.links
      .map((l) => classifyLegalLink(l.href, l.text))
      .filter((k): k is NonNullable<typeof k> => k !== null),
  );
  const missing: string[] = [];
  if (!kindsLinked.has('impressum')) missing.push('Impressum');
  if (!kindsLinked.has('datenschutz')) missing.push('Datenschutzerklärung');

  if (missing.length === 0) {
    const found = home.links.filter((l) => {
      const k = classifyLegalLink(l.href, l.text);
      return k === 'impressum' || k === 'datenschutz';
    });
    results.push(
      pass(
        'A3',
        found.slice(0, 4).map((l) => ({
          pageUrl: home.url,
          detail: `Link „${l.text || l.href}“ im Bereich ${l.area}`,
          excerpt: makeExcerpt(l.href, 200),
        })),
      ),
    );
  } else {
    results.push(
      fail('A3', [
        {
          pageUrl: home.url,
          detail: `Nicht verlinkt: ${missing.join(', ')}`,
        },
      ]),
    );
  }

  return results;
}
