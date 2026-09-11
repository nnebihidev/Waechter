import { marked } from 'marked';
import { readLegalMarkdown, type LegalSlug } from '@/lib/legal';

/**
 * Renders one of our own markdown files from /legal. The content is
 * repository-controlled (no user input), so raw HTML rendering is fine here.
 */
export function LegalArticle({ slug }: { slug: LegalSlug }) {
  const markdown = readLegalMarkdown(slug);
  const html = marked.parse(markdown, { async: false });
  return (
    <article
      className="prose prose-neutral mx-auto w-full max-w-3xl px-4 py-12 prose-headings:text-ink prose-a:text-pine"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
