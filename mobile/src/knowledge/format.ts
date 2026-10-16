export interface StepParts {
  /** Short lead sentence shown in bold, or null if the step is one long sentence. */
  title: string | null;
  body: string;
}

const MAX_TITLE = 80;

/**
 * Splits a guide step into a bold lead and detail text:
 * "Call 112. Send someone for an AED." → title "Call 112.", body "Send someone…".
 * "WHERE: your location" → title "WHERE", body "your location".
 */
export function splitStep(text: string): StepParts {
  const m = /^(.+?)([.!?:])\s+(\S[\s\S]*)$/.exec(text.trim());
  if (!m || !m[1] || !m[2] || !m[3]) return { title: null, body: text.trim() };
  // Do not split inside decimals/abbreviations like "e.g." or "5.5".
  if (/\b(e\.g|z\.\s?B|ca|bzw|etc|i\.e|u\.a|Nr|z)$/i.test(m[1])) return { title: null, body: text.trim() };
  const title = m[2] === ':' ? m[1] : `${m[1]}${m[2]}`;
  if (title.length > MAX_TITLE) return { title: null, body: text.trim() };
  return { title, body: m[3] };
}
