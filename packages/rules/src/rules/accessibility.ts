import type { RuleResult, SiteEvidence } from '../types';
import { fail, pass } from './helpers';

/** F1–F3 · Barrierefreiheit (BFSG-aware smoke checks, no full WCAG audit) */
export function runAccessibility(site: SiteEvidence): RuleResult[] {
  const results: RuleResult[] = [];
  const home = site.homepage;

  // F1 — html[lang]
  if (home.lang && home.lang.trim().length > 0) {
    results.push(pass('F1', [{ pageUrl: home.url, detail: `lang="${home.lang}"` }]));
  } else {
    results.push(fail('F1', [{ pageUrl: home.url, detail: 'html-Element ohne lang-Attribut' }]));
  }

  // F2 — more than 3 images without any alt attribute
  const missingAlt = home.images.filter((img) => img.alt === null);
  if (missingAlt.length > 3) {
    results.push(
      fail('F2', [
        {
          pageUrl: home.url,
          detail: `${missingAlt.length} Bilder ohne alt-Attribut`,
          excerpt: missingAlt
            .slice(0, 5)
            .map((i) => i.src)
            .join(' · ')
            .slice(0, 400),
        },
      ]),
    );
  } else {
    results.push(
      pass('F2', [
        { pageUrl: home.url, detail: `${missingAlt.length} von ${home.images.length} Bildern ohne alt-Attribut` },
      ]),
    );
  }

  // F3 — a main heading exists
  const h1 = home.headings.find((h) => h.level === 1);
  if (h1) {
    results.push(pass('F3', [{ pageUrl: home.url, excerpt: h1.text.slice(0, 200) }]));
  } else {
    results.push(fail('F3', [{ pageUrl: home.url, detail: 'Keine H1-Überschrift gefunden' }]));
  }

  return results;
}
