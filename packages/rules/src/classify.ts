import type { LegalPageKind } from './types';

/**
 * Classify a link (href + link text) as one of the legal page kinds.
 * Shared between the rule engine (A3) and the crawler's page discovery (Phase 2).
 */
const PATTERNS: { kind: LegalPageKind; re: RegExp }[] = [
  { kind: 'impressum', re: /impressum|imprint|legal[-_ ]?notice|anbieterkennzeichnung/i },
  { kind: 'datenschutz', re: /datenschutz|privacy|dsgvo/i },
  { kind: 'widerruf', re: /widerruf/i },
  { kind: 'agb', re: /\bagb\b|geschäftsbedingungen|geschaeftsbedingungen|terms/i },
  { kind: 'cookies', re: /cookie/i },
];

export function classifyLegalLink(href: string, text: string): LegalPageKind | null {
  const haystack = `${href} ${text}`;
  for (const { kind, re } of PATTERNS) {
    if (re.test(haystack)) return kind;
  }
  return null;
}

/** Common paths the crawler probes even when no link was discovered (Phase 2). */
export const COMMON_LEGAL_PATHS: Record<LegalPageKind, string[]> = {
  impressum: ['/impressum', '/impressum/', '/imprint', '/legal-notice', '/legal', '/rechtliches'],
  datenschutz: ['/datenschutz', '/datenschutz/', '/privacy', '/datenschutzerklaerung'],
  agb: ['/agb', '/agb/', '/terms'],
  widerruf: ['/widerruf', '/widerrufsbelehrung'],
  cookies: ['/cookies', '/cookie-richtlinie'],
};
