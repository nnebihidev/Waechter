import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractPageEvidence } from '../src/extract';
import type { LegalPageKind, PageEvidence, RuleId, RuleResult, SiteEvidence } from '../src/types';

export const BASE = 'https://example.de';

export function page(html: string, url = `${BASE}/`, status = 200): PageEvidence {
  return extractPageEvidence(html, url, status);
}

export interface SiteOpts {
  finalIsHttps?: boolean;
  tlsValid?: boolean | null;
  homepageStatus?: number;
  legal?: Partial<Record<LegalPageKind, { html: string; status?: number }>>;
  runtimeCookies?: SiteEvidence['runtimeCookies'];
}

export function site(homepageHtml: string, opts: SiteOpts = {}): SiteEvidence {
  const legalPages: SiteEvidence['legalPages'] = {};
  for (const [kind, def] of Object.entries(opts.legal ?? {})) {
    if (!def) continue;
    legalPages[kind as LegalPageKind] = extractPageEvidence(
      def.html,
      `${BASE}/${kind}`,
      def.status ?? 200,
    );
  }
  return {
    inputUrl: BASE,
    finalUrl: `${BASE}/`,
    finalIsHttps: opts.finalIsHttps ?? true,
    tlsValid: opts.tlsValid ?? null,
    homepage: extractPageEvidence(homepageHtml, `${BASE}/`, opts.homepageStatus ?? 200),
    legalPages,
    runtimeCookies: opts.runtimeCookies ?? null,
  };
}

export function byId(results: RuleResult[], id: RuleId): RuleResult {
  const r = results.find((x) => x.id === id);
  if (!r) throw new Error(`missing result for rule ${id}`);
  return r;
}

const FIXTURES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'fixtures');

const LEGAL_FILES: Record<LegalPageKind, string> = {
  impressum: 'impressum.html',
  datenschutz: 'datenschutz.html',
  agb: 'agb.html',
  widerruf: 'widerruf.html',
  cookies: 'cookies.html',
};

/** Load a fixture directory the same way the CLI does. */
export function fixtureSite(name: string): SiteEvidence {
  const dir = path.join(FIXTURES_DIR, name);
  const homepage = extractPageEvidence(
    readFileSync(path.join(dir, 'homepage.html'), 'utf8'),
    `${BASE}/`,
  );
  const legalPages: SiteEvidence['legalPages'] = {};
  for (const [kind, file] of Object.entries(LEGAL_FILES) as [LegalPageKind, string][]) {
    const p = path.join(dir, file);
    if (existsSync(p)) {
      legalPages[kind] = extractPageEvidence(readFileSync(p, 'utf8'), `${BASE}/${kind}`);
    }
  }
  return {
    inputUrl: BASE,
    finalUrl: `${BASE}/`,
    finalIsHttps: true,
    tlsValid: null,
    homepage,
    legalPages,
  };
}

/** Minimal compliant homepage: lang, h1, footer links to Impressum + Datenschutz. */
export const HOME_OK = `<!DOCTYPE html>
<html lang="de"><head><title>Test</title></head><body>
<h1>Testseite</h1>
<footer><a href="/impressum">Impressum</a> <a href="/datenschutz">Datenschutzerklärung</a></footer>
</body></html>`;

/** Fully populated Impressum for a GmbH. */
export const IMPRESSUM_OK = `<!DOCTYPE html>
<html lang="de"><body><main>
<h1>Impressum</h1>
<p>Muster GmbH<br> Musterstraße 12<br> 80331 München</p>
<p>Telefon: <a href="tel:+49891234567">089 1234567</a><br>
E-Mail: <a href="mailto:info@muster.example">info@muster.example</a></p>
<p>Vertreten durch den Geschäftsführer Max Mustermann.</p>
<p>Handelsregister: Amtsgericht München, HRB 98765</p>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE123456789</p>
</main></body></html>`;

/** Fully populated Datenschutzerklärung. */
export const DATENSCHUTZ_OK = `<!DOCTYPE html>
<html lang="de"><body><main>
<h1>Datenschutzerklärung</h1>
<p>Verantwortlicher ist die Muster GmbH, Musterstraße 12, 80331 München.</p>
<p>Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO.</p>
<p>Sie haben das Recht auf Auskunft, Berichtigung und Löschung sowie ein
Beschwerderecht bei einer Aufsichtsbehörde.</p>
<p>Server-Logs werden nach 14 Tagen gelöscht (Speicherdauer).</p>
</main></body></html>`;
