import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export type LegalSlug = 'impressum' | 'datenschutz' | 'agb' | 'widerruf' | 'avv' | 'bot';

/**
 * Legal pages are rendered from the markdown sources in /legal — the single
 * place the founder edits (see LEGAL.md for the placeholder inventory).
 * cwd is apps/web during `next build` and /app inside the Docker runner,
 * hence the two candidates.
 */
export function readLegalMarkdown(slug: LegalSlug): string {
  const candidates = [
    path.join(process.cwd(), '..', '..', 'legal', `${slug}.md`),
    path.join(process.cwd(), 'legal', `${slug}.md`),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return readFileSync(p, 'utf8');
  }
  throw new Error(`legal markdown not found for slug "${slug}" (tried: ${candidates.join(', ')})`);
}
