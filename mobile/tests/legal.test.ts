import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { UI_LANGS } from '../src/i18n/lang';
import { STRINGS, SUGGESTIONS } from '../src/i18n/strings';
import { GUIDES } from '../src/knowledge/guides';
import licenses from '../src/legal/licenses.json';
import { LEGAL, TERMS_VERSION } from '../src/legal/texts';

// Wording that would turn general information into a promise or a medical claim.
const FORBIDDEN =
  /(100\s?%|garantier|guarantee|rechtssicher|abmahnfest|always safe|immer sicher|safe to eat|unbedenklich essbar|diagnos|heilt|cures?\b|zertifiziert|certified|medizinprodukt(?! und)|medical device(?! and)|ersetzt (den|einen) (arzt|notruf)|replaces? (a|the) (doctor|emergency))/i;

function allText(obj: unknown): string[] {
  if (typeof obj === 'string') return [obj];
  if (Array.isArray(obj)) return obj.flatMap(allText);
  if (obj && typeof obj === 'object') return Object.values(obj).flatMap(allText);
  return [];
}

describe('legal texts', () => {
  it('exist in every UI language with the same structure', () => {
    for (const lang of UI_LANGS) {
      const l = LEGAL[lang];
      expect(l.welcomePoints).toHaveLength(4);
      expect(l.terms.length).toBe(LEGAL.en.terms.length);
      expect(l.privacy.length).toBe(LEGAL.en.privacy.length);
      expect(l.terms.map((s) => s.paragraphs.length)).toEqual(LEGAL.en.terms.map((s) => s.paragraphs.length));
    }
    expect(TERMS_VERSION).toBeGreaterThanOrEqual(1);
  });

  it('say the essentials: 112, AI can be wrong, not medical advice, AI transparency', () => {
    for (const lang of UI_LANGS) {
      const text = allText(LEGAL[lang]).join(' ');
      expect(text).toMatch(/112/);
      expect(text).toMatch(/KI|AI/);
      expect(text).toMatch(/Art\. 50/);
      expect(text).toMatch(/Produkthaftung|product liability/i);
    }
  });

  it('never promise safety, certification or diagnosis — anywhere in user-facing text', () => {
    const sources: Array<[string, unknown]> = [
      ['legal', LEGAL],
      ['strings', STRINGS],
      ['suggestions', SUGGESTIONS],
      ['guides', GUIDES.map((g) => g.content)],
    ];
    for (const [name, src] of sources) {
      for (const text of allText(src)) {
        // "kein Medizinprodukt" / "not a medical device" is the allowed negation.
        const stripped = text.replace(/kein Medizinprodukt|not a medical device|keine Diagnosen|makes no diagnoses|not certified|nicht beglaubigt/gi, '');
        expect(stripped, `${name}: ${text.slice(0, 80)}`).not.toMatch(FORBIDDEN);
      }
    }
  });

  it('every runtime dependency and the model have a licence entry', () => {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as { dependencies: Record<string, string> };
    const names = new Set(licenses.map((e) => e.name));
    for (const dep of Object.keys(pkg.dependencies)) expect(names.has(dep), dep).toBe(true);
    expect(licenses.some((e) => e.license === 'Apache-2.0' && /Qwen/.test(e.name))).toBe(true);
    for (const e of licenses) expect(e.license, e.name).not.toBe('unknown');
  });
});
