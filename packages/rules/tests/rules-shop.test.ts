import { describe, expect, it } from 'vitest';
import { detectShopSignals, runShop } from '../src/rules/shop';
import { byId, HOME_OK, page, site } from './helpers';

const SHOP_HOME = `<html lang="de"><body><h1>Kaffee-Shop</h1>
<p class="price">19,90 €</p>
<button>In den Warenkorb</button>
<footer><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a></footer>
</body></html>`;

const WIDERRUF_PAGE = `<html><body><h1>Widerrufsbelehrung</h1>
<p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
</body></html>`;

describe('shop detection', () => {
  it('does not flag a plain company site as a shop', () => {
    expect(detectShopSignals(page(HOME_OK)).isShop).toBe(false);
  });

  it('detects cart wording', () => {
    expect(detectShopSignals(page(SHOP_HOME)).isShop).toBe(true);
  });

  it('detects a shop platform marker without cart wording', () => {
    const html = `<html><body><h1>x</h1>
      <link rel="stylesheet" href="/wp-content/plugins/woocommerce/assets/css/woocommerce.css">
      <script src="/wp-content/plugins/woocommerce/assets/js/frontend.js"></script></body></html>`;
    expect(detectShopSignals(page(html)).isShop).toBe(true);
  });
});

describe('E rules skip for non-shops', () => {
  it('skips E1–E3 without shop signals', () => {
    const results = runShop(site(HOME_OK));
    for (const id of ['E1', 'E2', 'E3'] as const) {
      expect(byId(results, id).status).toBe('skip');
    }
  });
});

describe('E1 — Widerruf', () => {
  it('fails as blocker when a shop has no Widerruf page or section', () => {
    const r = byId(runShop(site(SHOP_HOME)), 'E1');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('blocker');
  });

  it('passes when a Widerruf page exists', () => {
    const s = site(SHOP_HOME, { legal: { widerruf: { html: WIDERRUF_PAGE } } });
    expect(byId(runShop(s), 'E1').status).toBe('pass');
  });

  it('passes when the AGB contain a Widerrufsbelehrung section', () => {
    const agb = `<html><body><h1>AGB</h1><h2>Widerrufsrecht</h2>
      <p>Verbrauchern steht ein Widerrufsrecht zu.</p></body></html>`;
    const s = site(SHOP_HOME, { legal: { agb: { html: agb } } });
    expect(byId(runShop(s), 'E1').status).toBe('pass');
  });
});

describe('E2 — price tax hint', () => {
  it('fails when prices lack any tax hint', () => {
    const r = byId(runShop(site(SHOP_HOME)), 'E2');
    expect(r.status).toBe('fail');
    expect(r.evidence[0]?.excerpt).toContain('19,90');
  });

  it('passes with "inkl. MwSt." wording', () => {
    const html = SHOP_HOME.replace('19,90 €', '19,90 € inkl. MwSt., zzgl. Versand');
    expect(byId(runShop(site(html)), 'E2').status).toBe('pass');
  });

  it('is skipped when a shop shows no prices on the homepage', () => {
    const html = `<html><body><h1>Shop</h1><button>In den Warenkorb</button></body></html>`;
    expect(byId(runShop(site(html)), 'E2').status).toBe('skip');
  });
});

describe('E3 — AGB linked', () => {
  it('fails without an AGB link', () => {
    expect(byId(runShop(site(SHOP_HOME)), 'E3').status).toBe('fail');
  });

  it('passes with an AGB link on the homepage', () => {
    const html = SHOP_HOME.replace('</footer>', '<a href="/agb">AGB</a></footer>');
    expect(byId(runShop(site(html)), 'E3').status).toBe('pass');
  });
});
