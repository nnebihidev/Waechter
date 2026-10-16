// Tiny, tolerant Markdown subset for chat answers: headings, bullet and numbered
// lists, paragraphs, **bold** and *italic*. Unclosed markers are rendered literally,
// so partially streamed text never flickers. Code is out of scope by design (harness).

export type Inline = { text: string; bold?: boolean; italic?: boolean };

export type Block =
  | { type: 'heading'; inlines: Inline[] }
  | { type: 'paragraph'; inlines: Inline[] }
  | { type: 'bullet'; items: Inline[][] }
  | { type: 'numbered'; items: Inline[][]; start: number };

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /\*\*(.+?)\*\*|__(.+?)__|(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])|(?<!\w)_(?!\s)(.+?)(?<!\s)_(?!\w)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ text: text.slice(last, idx) });
    if (m[1] !== undefined || m[2] !== undefined) out.push({ text: (m[1] ?? m[2]) as string, bold: true });
    else out.push({ text: (m[3] ?? m[4]) as string, italic: true });
    last = idx + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out.length ? out : [{ text: '' }];
}

export function parseMarkdown(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.replace(/\r/g, '').split('\n');
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ type: 'paragraph', inlines: parseInline(para.join(' ')) });
    para = [];
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    const h = /^#{1,6}\s+(.*)$/.exec(line);
    const b = /^\s*(?:[-*•]|–)\s+(.*)$/.exec(line);
    const n = /^\s*(\d+)[.)]\s+(.*)$/.exec(line);
    if (!line.trim()) {
      flush();
      continue;
    }
    if (h && h[1] !== undefined) {
      flush();
      blocks.push({ type: 'heading', inlines: parseInline(h[1]) });
      continue;
    }
    if (b && b[1] !== undefined) {
      flush();
      const prev = blocks[blocks.length - 1];
      if (prev && prev.type === 'bullet') prev.items.push(parseInline(b[1]));
      else blocks.push({ type: 'bullet', items: [parseInline(b[1])] });
      continue;
    }
    if (n && n[1] !== undefined && n[2] !== undefined) {
      flush();
      const prev = blocks[blocks.length - 1];
      if (prev && prev.type === 'numbered') prev.items.push(parseInline(n[2]));
      else blocks.push({ type: 'numbered', items: [parseInline(n[2])], start: Number(n[1]) });
      continue;
    }
    para.push(line.trim());
  }
  flush();
  return blocks;
}
