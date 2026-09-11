import { describe, expect, it } from 'vitest';
import { runAccessibility } from '../src/rules/accessibility';
import { byId, HOME_OK, site } from './helpers';

describe('F1 — html[lang]', () => {
  it('passes with lang="de"', () => {
    expect(byId(runAccessibility(site(HOME_OK)), 'F1').status).toBe('pass');
  });

  it('fails without a lang attribute', () => {
    const html = `<html><body><h1>x</h1></body></html>`;
    const r = byId(runAccessibility(site(html)), 'F1');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('warn');
  });
});

describe('F2 — images without alt', () => {
  it('fails with more than 3 images missing the alt attribute', () => {
    const html = `<html lang="de"><body><h1>x</h1>
      <img src="/1.jpg"><img src="/2.jpg"><img src="/3.jpg"><img src="/4.jpg">
    </body></html>`;
    const r = byId(runAccessibility(site(html)), 'F2');
    expect(r.status).toBe('fail');
    expect(r.evidence[0]?.detail).toContain('4');
  });

  it('passes with 3 or fewer missing and treats alt="" as provided (decorative)', () => {
    const html = `<html lang="de"><body><h1>x</h1>
      <img src="/1.jpg"><img src="/2.jpg"><img src="/3.jpg">
      <img src="/deko.jpg" alt=""><img src="/logo.jpg" alt="Logo">
    </body></html>`;
    expect(byId(runAccessibility(site(html)), 'F2').status).toBe('pass');
  });
});

describe('F3 — main heading', () => {
  it('passes with an H1', () => {
    expect(byId(runAccessibility(site(HOME_OK)), 'F3').status).toBe('pass');
  });

  it('fails as info without an H1', () => {
    const html = `<html lang="de"><body><h2>Nur eine H2</h2></body></html>`;
    const r = byId(runAccessibility(site(html)), 'F3');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('info');
  });
});
