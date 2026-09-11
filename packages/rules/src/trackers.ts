import type { PageEvidence, TrackerFamily, TrackerHit } from './types';

interface TrackerPattern {
  family: TrackerFamily;
  /** Matched against script srcs, iframe srcs and stylesheet hrefs. */
  url?: RegExp;
  /** Matched against inline script snippets. */
  inline?: RegExp;
}

const PATTERNS: TrackerPattern[] = [
  {
    family: 'google-tag-manager',
    url: /googletagmanager\.com\/gtm\.js/i,
    inline: /googletagmanager\.com\/gtm\.js|dataLayer\.push\(\{['"]gtm/i,
  },
  {
    family: 'google-analytics',
    url: /google-analytics\.com|googletagmanager\.com\/gtag\/js/i,
    inline: /\bgtag\s*\(|GoogleAnalyticsObject|\b_gaq\b/i,
  },
  {
    family: 'meta-pixel',
    url: /connect\.facebook\.net/i,
    inline: /\bfbq\s*\(/i,
  },
  {
    family: 'tiktok-pixel',
    url: /analytics\.tiktok\.com/i,
    inline: /\bttq\.(load|track|page)\b/i,
  },
  {
    family: 'hotjar',
    url: /static\.hotjar\.com/i,
    inline: /\bhj\s*\(|hotjar/i,
  },
  {
    // Self-hosted Matomo cannot be distinguished reliably from static HTML,
    // so only an external matomo.cloud host counts (per brief: "unless self-host certainty").
    family: 'matomo-external',
    url: /\.matomo\.cloud\//i,
  },
  {
    family: 'google-fonts',
    url: /fonts\.googleapis\.com|fonts\.gstatic\.com/i,
  },
  {
    family: 'youtube-embed',
    url: /youtube\.com\/embed|youtube-nocookie\.com\/embed/i,
  },
  {
    family: 'google-maps',
    url: /google\.com\/maps\/embed|maps\.googleapis\.com/i,
  },
];

/**
 * Families that count as tracking/marketing for the D rules (consent-relevant
 * script execution). Fonts/embeds are handled by C5 (Datenschutzerklärung
 * completeness), not by the cookie rules.
 */
export const TRACKING_FAMILIES: TrackerFamily[] = [
  'google-analytics',
  'google-tag-manager',
  'meta-pixel',
  'tiktok-pixel',
  'hotjar',
  'matomo-external',
];

export const FAMILY_LABEL_DE: Record<TrackerFamily, string> = {
  'google-analytics': 'Google Analytics',
  'google-tag-manager': 'Google Tag Manager',
  'meta-pixel': 'Meta/Facebook Pixel',
  'tiktok-pixel': 'TikTok Pixel',
  hotjar: 'Hotjar',
  'matomo-external': 'Matomo (extern gehostet)',
  'google-fonts': 'Google Fonts (extern eingebunden)',
  'youtube-embed': 'YouTube-Einbettung',
  'google-maps': 'Google Maps',
};

/** Regexes to check whether a Datenschutzerklärung mentions a detected family (C5). */
export const FAMILY_MENTION_RE: Record<TrackerFamily, RegExp> = {
  'google-analytics': /google\s*analytics/i,
  'google-tag-manager': /tag\s*manager/i,
  'meta-pixel': /(meta|facebook)[\s-]*pixel|facebook/i,
  'tiktok-pixel': /tiktok/i,
  hotjar: /hotjar/i,
  'matomo-external': /matomo|piwik/i,
  'google-fonts': /google\s*fonts/i,
  'youtube-embed': /youtube/i,
  'google-maps': /google\s*maps/i,
};

export function detectTrackers(page: {
  scriptSrcs: string[];
  inlineScriptSnippets: string[];
  iframeSrcs: string[];
  stylesheetHrefs: string[];
}): TrackerHit[] {
  const hits = new Map<TrackerFamily, TrackerHit>();
  const urls = [...page.scriptSrcs, ...page.iframeSrcs, ...page.stylesheetHrefs];

  for (const p of PATTERNS) {
    if (hits.has(p.family)) continue;
    if (p.url) {
      const src = urls.find((u) => p.url!.test(u));
      if (src) {
        hits.set(p.family, { family: p.family, source: src });
        continue;
      }
    }
    if (p.inline) {
      const snippet = page.inlineScriptSnippets.find((s) => p.inline!.test(s));
      if (snippet) {
        hits.set(p.family, { family: p.family, source: `inline: ${snippet.slice(0, 120)}` });
      }
    }
  }
  return [...hits.values()];
}

export function trackingHits(page: PageEvidence): TrackerHit[] {
  return page.trackers.filter((h) => TRACKING_FAMILIES.includes(h.family));
}
