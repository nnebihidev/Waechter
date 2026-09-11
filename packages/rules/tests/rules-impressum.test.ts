import { describe, expect, it } from 'vitest';
import { runImpressum } from '../src/rules/impressum';
import { byId, HOME_OK, IMPRESSUM_OK, site, type SiteOpts } from './helpers';

function run(opts: SiteOpts = {}) {
  return runImpressum(site(HOME_OK, opts));
}

const withImpressum = (html: string, status = 200): SiteOpts => ({
  legal: { impressum: { html, status } },
});

describe('B1 — Impressum exists', () => {
  it('fails as blocker when no Impressum page was found and skips B2–B7', () => {
    const results = run();
    expect(byId(results, 'B1').status).toBe('fail');
    expect(byId(results, 'B1').severity).toBe('blocker');
    for (const id of ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'] as const) {
      expect(byId(results, id).status).toBe('skip');
    }
  });

  it('fails when the Impressum page answers 404', () => {
    const results = run(withImpressum(IMPRESSUM_OK, 404));
    expect(byId(results, 'B1').status).toBe('fail');
  });

  it('passes with a reachable Impressum', () => {
    expect(byId(run(withImpressum(IMPRESSUM_OK)), 'B1').status).toBe('pass');
  });
});

describe('B2 — name present', () => {
  it('passes with a company form token', () => {
    expect(byId(run(withImpressum(IMPRESSUM_OK)), 'B2').status).toBe('pass');
  });

  it('passes with a plain person name', () => {
    const html = `<html><body><h1>Impressum</h1><p>Max Mustermann</p>
      <p>Musterstraße 12, 80331 München</p><p>info@muster.example</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B2').status).toBe('pass');
  });

  it('fails when no name pattern is recognizable', () => {
    const html = `<html><body><h1>Impressum</h1><p>Angaben gemäß § 5 DDG</p>
      <p>Musterstraße 12, 80331 München</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B2').status).toBe('fail');
  });
});

describe('B3 — postal address', () => {
  it('passes with street + PLZ + city', () => {
    expect(byId(run(withImpressum(IMPRESSUM_OK)), 'B3').status).toBe('pass');
  });

  it('warns on PO-box-only address', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH</p>
      <p>Postfach 10 11 12, 80331 München</p><p>info@muster.example</p></body></html>`;
    const r = byId(run(withImpressum(html)), 'B3');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('warn');
    expect(r.evidence[0]?.detail).toContain('Postfach');
  });

  it('fails when no address pattern exists at all', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH, erreichbar per E-Mail.</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B3').status).toBe('fail');
  });
});

describe('B4 — email address', () => {
  it('passes with a plain email', () => {
    expect(byId(run(withImpressum(IMPRESSUM_OK)), 'B4').status).toBe('pass');
  });

  it('passes with an obfuscated email like "post (at) muster (dot) de"', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH, Musterstraße 12, 80331 München</p>
      <p>post (at) muster (dot) de</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B4').status).toBe('pass');
  });

  it('fails without any email', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH, Musterstraße 12, 80331 München</p>
      <p>Bitte nutzen Sie unser Kontaktformular.</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B4').status).toBe('fail');
  });
});

describe('B5 — company registration data', () => {
  it('is skipped for unregistered sole proprietors', () => {
    const html = `<html><body><h1>Impressum</h1><p>Max Mustermann</p>
      <p>Musterstraße 12, 80331 München</p><p>info@muster.example</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B5').status).toBe('skip');
  });

  it('warns when a GmbH lacks register data', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH</p>
      <p>Musterstraße 12, 80331 München</p><p>info@muster.example</p>
      <p>Vertreten durch Max Mustermann.</p></body></html>`;
    const r = byId(run(withImpressum(html)), 'B5');
    expect(r.status).toBe('fail');
    expect(r.evidence[0]?.detail).toContain('Register');
  });

  it('warns when a GmbH lacks the representation clause', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH</p>
      <p>Musterstraße 12, 80331 München</p><p>info@muster.example</p>
      <p>Handelsregister: Amtsgericht München, HRB 98765</p></body></html>`;
    const r = byId(run(withImpressum(html)), 'B5');
    expect(r.status).toBe('fail');
    expect(r.evidence[0]?.detail).toContain('Vertretungsberechtigte');
  });

  it('passes with representation + register data', () => {
    expect(byId(run(withImpressum(IMPRESSUM_OK)), 'B5').status).toBe('pass');
  });
});

describe('B6 — USt-IdNr.', () => {
  it('is skipped when VAT is not mentioned', () => {
    const html = `<html><body><h1>Impressum</h1><p>Max Mustermann,
      Musterstraße 12, 80331 München, info@muster.example</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B6').status).toBe('skip');
  });

  it('fails when VAT is mentioned without an ID or § 19 UStG wording', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH, Musterstraße 12, 80331 München</p>
      <p>Umsatzsteuer wird gesondert ausgewiesen.</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B6').status).toBe('fail');
  });

  it('passes with a DE + 9 digits ID', () => {
    expect(byId(run(withImpressum(IMPRESSUM_OK)), 'B6').status).toBe('pass');
  });

  it('passes with explicit Kleinunternehmer wording', () => {
    const html = `<html><body><h1>Impressum</h1><p>Max Mustermann, Musterstraße 12, 80331 München</p>
      <p>Kein Ausweis der Umsatzsteuer, da Kleinunternehmer gemäß § 19 UStG.</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B6').status).toBe('pass');
  });
});

describe('B7 — contact beyond a form', () => {
  it('passes with phone only', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH, Musterstraße 12, 80331 München</p>
      <p><a href="tel:+49891234567">089 1234567</a></p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B7').status).toBe('pass');
  });

  it('fails when only a contact form is offered', () => {
    const html = `<html><body><h1>Impressum</h1><p>Muster GmbH, Musterstraße 12, 80331 München</p>
      <p>Kontakt ausschließlich über unser Kontaktformular.</p></body></html>`;
    expect(byId(run(withImpressum(html)), 'B7').status).toBe('fail');
  });
});
