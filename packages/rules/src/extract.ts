import * as cheerio from 'cheerio';
import type { Cheerio, CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';
import type {
  ConsentEvidence,
  ConsentPrechecked,
  LinkArea,
  PageEvidence,
  PageHeading,
  PageImage,
  PageLink,
} from './types';
import { detectTrackers } from './trackers';
import { makeExcerpt, normalizeText } from './util';

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
/** Obfuscated variants like "post (at) example.de" still satisfy B4. */
export const EMAIL_OBFUSCATED_RE =
  /[A-Za-z0-9._%+-]+\s?(\(at\)|\[at\])\s?[A-Za-z0-9.-]+\s?(\(dot\)|\[dot\]|\.)\s?[A-Za-z]{2,}/i;
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|ico)$/i;
const PHONE_LABEL_RE = /(telefon|tel\.?|fon|phone|rufnummer)\s*[:.]?\s*(\+?[\d][\d\s/()-]{5,}\d)/i;

interface KnownCmp {
  vendor: string;
  selector: string;
}

const KNOWN_CMPS: KnownCmp[] = [
  { vendor: 'usercentrics', selector: '#usercentrics-root, #usercentrics-cmp' },
  { vendor: 'cookiebot', selector: '#CybotCookiebotDialog, [id^="CybotCookiebot"]' },
  { vendor: 'klaro', selector: '#klaro, .klaro' },
  { vendor: 'onetrust', selector: '#onetrust-banner-sdk, #onetrust-consent-sdk' },
  { vendor: 'borlabs', selector: '#BorlabsCookieBox, #BorlabsCookie' },
  { vendor: 'complianz', selector: '#cmplz-cookiebanner-container, .cmplz-cookiebanner' },
  { vendor: 'ccm19', selector: '#ccm-widget, .ccm-modal' },
  { vendor: 'cookiefirst', selector: '#cookiefirst-root' },
];

const CMP_SCRIPT_HOSTS: { vendor: string; re: RegExp }[] = [
  { vendor: 'cookiebot', re: /consent\.cookiebot\.com/i },
  { vendor: 'usercentrics', re: /app\.usercentrics\.eu|usercentrics\.eu/i },
  { vendor: 'onetrust', re: /cdn\.cookielaw\.org/i },
  { vendor: 'cookiefirst', re: /consent\.cookiefirst\.com/i },
  { vendor: 'consentmanager', re: /consentmanager\.net/i },
];

const GENERIC_CONSENT_CONTAINER_RE = /cookie|consent|cmp/i;
const CONSENT_ACTION_TEXT_RE = /akzeptieren|zustimmen|einwilligen|auswahl bestätigen|accept all|alle annehmen/i;
const ESSENTIAL_LABEL_RE = /notwendig|erforderlich|essenziell|essentiell|essential|technisch|funktional erforderlich/i;

function linkArea($: CheerioAPI, el: Cheerio<AnyNode>): LinkArea {
  if (el.closest('footer, [role="contentinfo"]').length > 0) return 'footer';
  if (el.closest('header, [role="banner"]').length > 0) return 'header';
  if (el.closest('nav, [role="navigation"]').length > 0) return 'nav';
  return 'body';
}

function extractPrechecked($: CheerioAPI, container: Cheerio<AnyNode>): ConsentPrechecked[] {
  const out: ConsentPrechecked[] = [];
  container.find('input[type="checkbox"][checked]').each((_, input) => {
    const el = $(input);
    let labelText = '';
    const id = el.attr('id');
    if (id) {
      labelText = normalizeText($(`label[for="${id}"]`).text());
    }
    if (!labelText) {
      labelText = normalizeText(el.closest('label').text());
    }
    if (!labelText) {
      labelText = normalizeText(el.parent().text());
    }
    if (ESSENTIAL_LABEL_RE.test(labelText)) return;
    out.push({
      label: labelText || '(ohne Beschriftung)',
      excerpt: makeExcerpt($.html(el) ?? '', 240),
    });
  });
  return out;
}

function detectConsent($: CheerioAPI, scriptSrcs: string[]): ConsentEvidence | null {
  for (const cmp of KNOWN_CMPS) {
    const el = $(cmp.selector).first();
    if (el.length > 0) {
      return {
        vendor: cmp.vendor,
        selector: cmp.selector.split(',')[0]!.trim(),
        excerpt: makeExcerpt(el.text() || $.html(el) || '', 240),
        precheckedNonEssential: extractPrechecked($, el),
      };
    }
  }

  for (const { vendor, re } of CMP_SCRIPT_HOSTS) {
    const src = scriptSrcs.find((s) => re.test(s));
    if (src) {
      return {
        vendor,
        selector: `script[src*="${vendor}"]`,
        excerpt: makeExcerpt(src, 240),
        precheckedNonEssential: [],
      };
    }
  }

  // Generic: a container whose id/class smells like consent AND that contains
  // an accept-style action text. Best-effort by design.
  let generic: ConsentEvidence | null = null;
  $('[id],[class]').each((_, node) => {
    if (generic) return;
    const el = $(node);
    const idClass = `${el.attr('id') ?? ''} ${el.attr('class') ?? ''}`;
    if (!GENERIC_CONSENT_CONTAINER_RE.test(idClass)) return;
    const text = normalizeText(el.text());
    if (text.length === 0 || !CONSENT_ACTION_TEXT_RE.test(text)) return;
    generic = {
      vendor: 'generic',
      selector: el.attr('id') ? `#${el.attr('id')}` : `.${(el.attr('class') ?? '').split(/\s+/)[0]}`,
      excerpt: makeExcerpt(text, 240),
      precheckedNonEssential: extractPrechecked($, el),
    };
  });
  return generic;
}

/**
 * Static extraction pass: HTML string → PageEvidence.
 * The crawler (Phase 2) and the fixture CLI both call this.
 */
export function extractPageEvidence(html: string, url: string, httpStatus = 200): PageEvidence {
  const $ = cheerio.load(html);

  const scriptSrcs: string[] = [];
  const inlineScriptSnippets: string[] = [];
  $('script').each((_, node) => {
    const el = $(node);
    const src = el.attr('src');
    if (src) {
      scriptSrcs.push(src);
    } else {
      const body = el.text();
      if (body.trim().length > 0) inlineScriptSnippets.push(body.slice(0, 300));
    }
  });

  const iframeSrcs: string[] = [];
  $('iframe[src]').each((_, node) => {
    iframeSrcs.push($(node).attr('src') ?? '');
  });

  const stylesheetHrefs: string[] = [];
  $('link[rel="stylesheet"][href], link[rel="preconnect"][href], link[rel="preload"][href]').each(
    (_, node) => {
      stylesheetHrefs.push($(node).attr('href') ?? '');
    },
  );

  const links: PageLink[] = [];
  $('a[href]').each((_, node) => {
    const el = $(node);
    links.push({
      href: el.attr('href') ?? '',
      text: normalizeText(el.text()),
      area: linkArea($, el),
    });
  });

  const images: PageImage[] = [];
  $('img').each((_, node) => {
    const el = $(node);
    const alt = el.attr('alt');
    images.push({ src: el.attr('src') ?? '', alt: alt === undefined ? null : alt });
  });

  const headings: PageHeading[] = [];
  $('h1, h2, h3').each((_, node) => {
    const el = $(node);
    const level = Number(node.tagName?.slice(1) ?? '0');
    headings.push({ level, text: normalizeText(el.text()) });
  });

  // Visible text: drop non-content elements before reading body text.
  // Insert spaces at block boundaries so "Musterstraße 12<br>80331 München"
  // does not concatenate into one token in minified HTML.
  const $text = cheerio.load(html);
  $text('script, style, noscript, template').remove();
  $text('br, p, div, li, h1, h2, h3, h4, h5, h6, td, th, tr, section, article, header, footer').after(' ');
  const text = normalizeText($text('body').text());

  const emails = new Set<string>();
  for (const m of html.match(EMAIL_RE) ?? []) {
    if (IMAGE_EXT_RE.test(m)) continue; // logo@2x.png etc.
    emails.add(m.toLowerCase());
  }
  $('a[href^="mailto:"]').each((_, node) => {
    const href = $(node).attr('href') ?? '';
    const addr = href.replace(/^mailto:/i, '').split('?')[0];
    if (addr && EMAIL_RE.test(addr)) emails.add(addr.toLowerCase());
  });

  const phones = new Set<string>();
  $('a[href^="tel:"]').each((_, node) => {
    const href = $(node).attr('href') ?? '';
    const num = href.replace(/^tel:/i, '').trim();
    if (num) phones.add(num);
  });
  const phoneMatch = PHONE_LABEL_RE.exec(text);
  if (phoneMatch?.[2]) phones.add(normalizeText(phoneMatch[2]));

  const partial = { scriptSrcs, inlineScriptSnippets, iframeSrcs, stylesheetHrefs };

  return {
    url,
    httpStatus,
    title: normalizeText($('title').first().text()) || null,
    lang: $('html').attr('lang')?.trim() || null,
    text,
    links,
    images,
    scriptSrcs,
    inlineScriptSnippets,
    iframeSrcs,
    stylesheetHrefs,
    headings,
    emails: [...emails],
    phones: [...phones],
    trackers: detectTrackers(partial),
    consent: detectConsent($, scriptSrcs),
  };
}
