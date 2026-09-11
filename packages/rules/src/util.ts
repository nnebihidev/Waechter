import { EVIDENCE_EXCERPT_MAX } from './types';

/** Collapse whitespace runs; trim. */
export function normalizeText(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/** Cap evidence excerpts (DSGVO storage limitation: ≤ 500 chars). */
export function makeExcerpt(s: string, max: number = EVIDENCE_EXCERPT_MAX): string {
  const t = normalizeText(s);
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

/** Case-insensitive containment on normalized text. */
export function containsAny(text: string, patterns: RegExp[]): RegExp | null {
  for (const p of patterns) {
    if (p.test(text)) return p;
  }
  return null;
}

/** Return the surrounding context of the first regex match, for evidence. */
export function matchContext(text: string, re: RegExp, radius = 80): string | null {
  const m = re.exec(text);
  if (!m) return null;
  const start = Math.max(0, m.index - radius);
  const end = Math.min(text.length, m.index + m[0].length + radius);
  return makeExcerpt(text.slice(start, end), 240);
}
