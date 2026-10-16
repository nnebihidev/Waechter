import { describe, expect, it } from 'vitest';

import { GUIDES } from '../src/knowledge/guides';
import { UI_LANGS } from '../src/i18n/lang';

describe('guide catalogue', () => {
  it('has unique ids', () => {
    const ids = GUIDES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(GUIDES.map((g) => [g.id, g] as const))('%s is complete and parallel in every language', (_id, g) => {
    const en = g.content.en;
    for (const lang of UI_LANGS) {
      const c = g.content[lang];
      expect(c.title.length).toBeGreaterThan(3);
      expect(c.summary.length).toBeGreaterThan(10);
      expect(c.keywords.length).toBeGreaterThan(2);
      // Translations must not silently drop steps.
      expect(c.sections.map((s) => s.steps.length)).toEqual(en.sections.map((s) => s.steps.length));
      for (const s of c.sections) for (const step of s.steps) expect(step.trim().length).toBeGreaterThan(5);
    }
  });

  it('urgent guides tell the reader to call 112 in every language', () => {
    for (const g of GUIDES.filter((x) => x.urgent)) {
      for (const lang of UI_LANGS) {
        const text = g.content[lang].sections.flatMap((s) => s.steps).join(' ');
        expect(text, `${g.id}/${lang}`).toMatch(/112/);
      }
    }
  });

  it('never promises safety or certainty', () => {
    const forbidden = /(100\s?%|garantiert|guaranteed|always safe|immer sicher|safe to eat|unbedenklich essbar)/i;
    for (const g of GUIDES) {
      for (const lang of UI_LANGS) {
        const c = g.content[lang];
        const text = [c.title, c.summary, ...c.sections.flatMap((s) => [s.heading ?? '', ...s.steps])].join(' ');
        expect(text, `${g.id}/${lang}`).not.toMatch(forbidden);
      }
    }
  });
});
