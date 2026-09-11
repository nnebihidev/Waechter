import { describe, expect, it } from 'vitest';
import { runErreichbarkeit } from '../src/rules/erreichbarkeit';
import { byId, HOME_OK, site } from './helpers';

describe('A1 — homepage reachable', () => {
  it('passes on HTTP 200', () => {
    const r = byId(runErreichbarkeit(site(HOME_OK)), 'A1');
    expect(r.status).toBe('pass');
  });

  it('fails as blocker on HTTP 500', () => {
    const r = byId(runErreichbarkeit(site(HOME_OK, { homepageStatus: 500 })), 'A1');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('blocker');
    expect(r.evidence[0]?.httpStatus).toBe(500);
  });
});

describe('A2 — TLS', () => {
  it('fails as warn on plain HTTP', () => {
    const r = byId(runErreichbarkeit(site(HOME_OK, { finalIsHttps: false })), 'A2');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('warn');
  });

  it('fails on invalid certificate', () => {
    const r = byId(runErreichbarkeit(site(HOME_OK, { tlsValid: false })), 'A2');
    expect(r.status).toBe('fail');
  });

  it('passes on HTTPS with unknown cert state (offline eval)', () => {
    const r = byId(runErreichbarkeit(site(HOME_OK, { tlsValid: null })), 'A2');
    expect(r.status).toBe('pass');
  });
});

describe('A3 — legal pages linked from homepage', () => {
  it('passes when Impressum and Datenschutz are linked', () => {
    const r = byId(runErreichbarkeit(site(HOME_OK)), 'A3');
    expect(r.status).toBe('pass');
  });

  it('fails when the Datenschutz link is missing', () => {
    const html = `<html lang="de"><body><h1>x</h1>
      <footer><a href="/impressum">Impressum</a></footer></body></html>`;
    const r = byId(runErreichbarkeit(site(html)), 'A3');
    expect(r.status).toBe('fail');
    expect(r.evidence[0]?.detail).toContain('Datenschutzerklärung');
  });

  it('recognizes english hrefs (imprint / privacy)', () => {
    const html = `<html lang="de"><body><h1>x</h1>
      <footer><a href="/imprint">Legal notice</a><a href="/privacy">Privacy</a></footer></body></html>`;
    const r = byId(runErreichbarkeit(site(html)), 'A3');
    expect(r.status).toBe('pass');
  });
});
