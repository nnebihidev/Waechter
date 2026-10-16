import { describe, expect, it } from 'vitest';

import { parseInline, parseMarkdown } from '../src/ui/markdown';

describe('parseInline', () => {
  it('handles bold and italic', () => {
    expect(parseInline('Call **112** now, *gently*.')).toEqual([
      { text: 'Call ' },
      { text: '112', bold: true },
      { text: ' now, ' },
      { text: 'gently', italic: true },
      { text: '.' },
    ]);
  });

  it('keeps unclosed markers literal (streaming safety)', () => {
    expect(parseInline('Push **hard and')).toEqual([{ text: 'Push **hard and' }]);
    expect(parseInline('5 * 6 = 30')).toEqual([{ text: '5 * 6 = 30' }]);
  });
});

describe('parseMarkdown', () => {
  it('splits headings, lists and paragraphs', () => {
    const blocks = parseMarkdown('## Steps\n1. Call 112.\n2. Kneel down.\n\nKeep calm.\n- water\n- shade');
    expect(blocks.map((b) => b.type)).toEqual(['heading', 'numbered', 'paragraph', 'bullet']);
    const n = blocks[1];
    expect(n?.type === 'numbered' && n.items.length).toBe(2);
    const b = blocks[3];
    expect(b?.type === 'bullet' && b.items[1]?.[0]?.text).toBe('shade');
  });

  it('joins wrapped lines into one paragraph and respects list start numbers', () => {
    const blocks = parseMarkdown('line one\nline two\n\n3. third\n4. fourth');
    expect(blocks[0]?.type === 'paragraph' && blocks[0].inlines[0]?.text).toBe('line one line two');
    expect(blocks[1]?.type === 'numbered' && blocks[1].start).toBe(3);
  });

  it('never throws on partial input', () => {
    for (const s of ['', '#', '- ', '1.', '**', '*a', '1. **bold']) expect(() => parseMarkdown(s)).not.toThrow();
  });
});
