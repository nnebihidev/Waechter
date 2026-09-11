import { classifyLegalLink } from '../classify';
import type { PageEvidence, RuleResult, SiteEvidence } from '../types';
import { matchContext } from '../util';
import { fail, pass, skip } from './helpers';

const CART_TEXT_RE = /in den warenkorb|jetzt kaufen|zur kasse|warenkorb|add to cart|buy now/i;
const PLATFORM_RE = /woocommerce|shopify|shopware|magento|prestashop/i;
const PRICE_RE = /\d{1,6}(?:[.,]\d{2})\s?€|€\s?\d{1,6}(?:[.,]\d{2})?/;
const TAX_HINT_RE = /mwst|mehrwertsteuer|inkl\.|zzgl\.|umsatzsteuer|\bust\b/i;
const WIDERRUF_TEXT_RE = /widerrufsrecht|widerrufsbelehrung/i;

export interface ShopSignals {
  isShop: boolean;
  cartText: string | null;
  platform: string | null;
  priceFound: string | null;
}

export function detectShopSignals(home: PageEvidence): ShopSignals {
  const cartText = matchContext(home.text, CART_TEXT_RE);
  const urls = [...home.scriptSrcs, ...home.stylesheetHrefs, ...home.links.map((l) => l.href)];
  const platform =
    urls.find((u) => PLATFORM_RE.test(u)) ??
    home.inlineScriptSnippets.find((s) => PLATFORM_RE.test(s)) ??
    null;
  const priceFound = matchContext(home.text, PRICE_RE);
  return {
    isShop: cartText !== null || platform !== null,
    cartText,
    platform,
    priceFound,
  };
}

/** E1–E3 · Shop / Verbrauchersignale (only when a shop is detected) */
export function runShop(site: SiteEvidence): RuleResult[] {
  const results: RuleResult[] = [];
  const home = site.homepage;
  const signals = detectShopSignals(home);

  if (!signals.isShop) {
    const reason = 'Kein Shop erkannt (keine Warenkorb-/Kauf-Signale).';
    return (['E1', 'E2', 'E3'] as const).map((id) => skip(id, reason));
  }

  const shopEvidence = {
    pageUrl: home.url,
    detail: signals.platform
      ? `Shop-System erkannt: ${signals.platform.slice(0, 120)}`
      : 'Kauf-Signale im Seitentext erkannt',
    excerpt: signals.cartText ?? undefined,
  };

  // E1 — Widerruf page/section exists
  const widerrufPage = site.legalPages.widerruf;
  const widerrufLinked = home.links.some((l) => classifyLegalLink(l.href, l.text) === 'widerruf');
  const widerrufInOtherLegal = (['agb', 'datenschutz'] as const).some((k) => {
    const p = site.legalPages[k];
    return p ? WIDERRUF_TEXT_RE.test(p.text) : false;
  });
  if ((widerrufPage && widerrufPage.httpStatus >= 200 && widerrufPage.httpStatus < 300) || widerrufLinked || widerrufInOtherLegal) {
    results.push(
      pass('E1', [
        {
          pageUrl: widerrufPage?.url ?? home.url,
          detail: widerrufPage
            ? 'Widerrufs-Seite gefunden'
            : widerrufLinked
              ? 'Widerruf-Link auf der Startseite gefunden'
              : 'Widerrufsrecht in einer Rechtsseite erwähnt',
        },
      ]),
    );
  } else {
    results.push(fail('E1', [shopEvidence]));
  }

  // E2 — prices need a tax hint (page-level best effort)
  if (!signals.priceFound) {
    results.push(skip('E2', 'Keine Preise auf der Startseite erkannt.'));
  } else if (TAX_HINT_RE.test(home.text)) {
    results.push(
      pass('E2', [
        { pageUrl: home.url, excerpt: matchContext(home.text, TAX_HINT_RE) ?? undefined },
      ]),
    );
  } else {
    results.push(
      fail('E2', [
        {
          pageUrl: home.url,
          detail: 'Preis ohne Steuer-/Versandhinweis',
          excerpt: signals.priceFound,
        },
      ]),
    );
  }

  // E3 — AGB linked or present
  const agbPage = site.legalPages.agb;
  const agbLinked = home.links.some((l) => classifyLegalLink(l.href, l.text) === 'agb');
  if ((agbPage && agbPage.httpStatus >= 200 && agbPage.httpStatus < 300) || agbLinked) {
    results.push(pass('E3', [{ pageUrl: agbPage?.url ?? home.url }]));
  } else {
    results.push(fail('E3', [{ pageUrl: home.url, detail: 'Kein AGB-Link gefunden' }]));
  }

  return results;
}
