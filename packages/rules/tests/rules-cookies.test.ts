import { describe, expect, it } from 'vitest';
import { runCookies } from '../src/rules/cookies';
import { byId, HOME_OK, site } from './helpers';

const GA_SNIPPET = `<script src="https://www.googletagmanager.com/gtag/js?id=G-1234"></script>`;

const HOME_TRACKED_NO_CONSENT = `<html lang="de"><head>${GA_SNIPPET}</head>
<body><h1>x</h1><footer><a href="/impressum">Impressum</a></footer></body></html>`;

const COOKIEBOT_DIV = `<div id="CybotCookiebotDialog"><p>Wir verwenden Cookies.</p>
<button>Alle akzeptieren</button></div>`;

const HOME_TRACKED_WITH_CMP = `<html lang="de"><head>${GA_SNIPPET}</head>
<body>${COOKIEBOT_DIV}<h1>x</h1></body></html>`;

const HOME_PRECHECKED = `<html lang="de"><head>${GA_SNIPPET}</head><body>
<div id="cookie-consent">
  <p>Cookie-Einstellungen</p>
  <input type="checkbox" id="c-ess" checked><label for="c-ess">Technisch notwendig</label>
  <input type="checkbox" id="c-mkt" checked><label for="c-mkt">Marketing-Cookies</label>
  <button>Auswahl akzeptieren</button>
</div><h1>x</h1></body></html>`;

describe('D1 — tracking scripts detected (informational)', () => {
  it('passes on a tracker-free page', () => {
    expect(byId(runCookies(site(HOME_OK)), 'D1').status).toBe('pass');
  });

  it('reports detected trackers as info finding', () => {
    const r = byId(runCookies(site(HOME_TRACKED_NO_CONSENT)), 'D1');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('info');
    expect(r.evidence[0]?.detail).toBe('Google Analytics');
  });

  it('does not treat Google Fonts alone as a tracking script', () => {
    const html = `<html lang="de"><head>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter"></head>
      <body><h1>x</h1></body></html>`;
    expect(byId(runCookies(site(html)), 'D1').status).toBe('pass');
  });
});

describe('D2 — consent UI (best-effort)', () => {
  it('is skipped when there are no trackers', () => {
    expect(byId(runCookies(site(HOME_OK)), 'D2').status).toBe('skip');
  });

  it('passes when a known CMP is present alongside trackers', () => {
    const r = byId(runCookies(site(HOME_TRACKED_WITH_CMP)), 'D2');
    expect(r.status).toBe('pass');
    expect(r.evidence[0]?.detail).toContain('cookiebot');
  });

  it('is subsumed by D3 when trackers run without any consent UI', () => {
    expect(byId(runCookies(site(HOME_TRACKED_NO_CONSENT)), 'D2').status).toBe('skip');
  });
});

describe('D3 — marketing/analytics without consent', () => {
  it('fails as blocker when trackers load without any consent UI', () => {
    const r = byId(runCookies(site(HOME_TRACKED_NO_CONSENT)), 'D3');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('blocker');
  });

  it('passes (best-effort) when a consent UI exists and no runtime evidence contradicts it', () => {
    expect(byId(runCookies(site(HOME_TRACKED_WITH_CMP)), 'D3').status).toBe('pass');
  });

  it('fails on runtime evidence of cookies set before consent, even with a CMP', () => {
    const s = site(HOME_TRACKED_WITH_CMP, {
      runtimeCookies: {
        consentUiVisible: true,
        cookiesSetBeforeConsent: [{ name: '_ga', domain: '.example.de' }],
      },
    });
    const r = byId(runCookies(s), 'D3');
    expect(r.status).toBe('fail');
    expect(r.evidence[0]?.detail).toContain('_ga');
  });

  it('is skipped when no trackers exist', () => {
    expect(byId(runCookies(site(HOME_OK)), 'D3').status).toBe('skip');
  });
});

describe('D4 — pre-checked non-essential boxes', () => {
  it('is skipped without a consent banner in the HTML', () => {
    expect(byId(runCookies(site(HOME_TRACKED_NO_CONSENT)), 'D4').status).toBe('skip');
  });

  it('fails when a non-essential category is pre-checked', () => {
    const r = byId(runCookies(site(HOME_PRECHECKED)), 'D4');
    expect(r.status).toBe('fail');
    expect(r.evidence[0]?.detail).toContain('Marketing-Cookies');
  });

  it('passes when only essential boxes are pre-checked', () => {
    const html = HOME_PRECHECKED.replace(
      '<input type="checkbox" id="c-mkt" checked>',
      '<input type="checkbox" id="c-mkt">',
    );
    expect(byId(runCookies(site(html)), 'D4').status).toBe('pass');
  });
});
