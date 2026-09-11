import { describe, expect, it } from 'vitest';
import { extractPageEvidence } from '../src/extract';
import { page } from './helpers';

describe('extractPageEvidence', () => {
  it('classifies link areas (header/footer/nav/body)', () => {
    const p = page(`<html><body>
      <header><a href="/a">A</a></header>
      <nav><a href="/b">B</a></nav>
      <p><a href="/c">C</a></p>
      <footer><a href="/d">D</a></footer>
    </body></html>`);
    const areas = Object.fromEntries(p.links.map((l) => [l.href, l.area]));
    expect(areas['/a']).toBe('header');
    expect(areas['/b']).toBe('nav');
    expect(areas['/c']).toBe('body');
    expect(areas['/d']).toBe('footer');
  });

  it('extracts emails from text and mailto links, ignoring image names like logo@2x.png', () => {
    const p = page(`<html><body>
      <img src="logo@2x.png">
      <p>Schreiben Sie an info@muster.example</p>
      <a href="mailto:kontakt@muster.example?subject=Hallo">Mail</a>
    </body></html>`);
    expect(p.emails).toContain('info@muster.example');
    expect(p.emails).toContain('kontakt@muster.example');
    expect(p.emails.some((e) => e.includes('2x.png'))).toBe(false);
  });

  it('normalizes <br>-separated address lines into spaced text', () => {
    const p = page(`<html><body><p>Musterstraße 12<br>80331 München</p></body></html>`);
    expect(p.text).toContain('Musterstraße 12 80331 München');
  });

  it('keeps script/style content out of visible text', () => {
    const p = page(`<html><body><script>var geheim = 1;</script><style>.a{}</style><p>Sichtbar</p></body></html>`);
    expect(p.text).toContain('Sichtbar');
    expect(p.text).not.toContain('geheim');
  });

  it('records lang, title, headings and image alt state', () => {
    const p = page(`<html lang="de-DE"><head><title>Titel</title></head>
      <body><h1>Haupt</h1><img src="/a.jpg"><img src="/b.jpg" alt=""></body></html>`);
    expect(p.lang).toBe('de-DE');
    expect(p.title).toBe('Titel');
    expect(p.headings[0]).toEqual({ level: 1, text: 'Haupt' });
    expect(p.images[0]?.alt).toBeNull();
    expect(p.images[1]?.alt).toBe('');
  });

  it('detects known CMP containers with pre-checked non-essential boxes', () => {
    const p = page(`<html><body><div id="BorlabsCookieBox">
      <input type="checkbox" id="m" checked><label for="m">Statistik</label>
      <button>Alle akzeptieren</button></div></body></html>`);
    expect(p.consent?.vendor).toBe('borlabs');
    expect(p.consent?.precheckedNonEssential[0]?.label).toBe('Statistik');
  });

  it('caps evidence excerpts at 500 characters', () => {
    const long = 'Wort '.repeat(400);
    const p = extractPageEvidence(
      `<html><body><div id="cookie-hinweis"><p>${long} akzeptieren</p></div></body></html>`,
      'https://example.de/',
    );
    expect((p.consent?.excerpt ?? '').length).toBeLessThanOrEqual(500);
  });
});
