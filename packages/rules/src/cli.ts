/**
 * Offline rule-engine evaluation on HTML fixtures.
 *
 *   pnpm rules:eval path/to/homepage.html        # single file = homepage-only site
 *   pnpm rules:eval path/to/fixture-dir          # homepage.html + impressum.html + …
 *   pnpm rules:eval path/to/fixture-dir --json   # machine-readable output
 *
 * Directory convention: homepage.html (required), impressum.html,
 * datenschutz.html, agb.html, widerruf.html, cookies.html (each optional).
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { CATALOG, RULE_GROUPS_DE } from './catalog';
import { evaluateSite } from './engine';
import { extractPageEvidence } from './extract';
import type { LegalPageKind, RuleResult, SiteEvidence, SiteReport } from './types';

const LEGAL_FILES: Record<LegalPageKind, string> = {
  impressum: 'impressum.html',
  datenschutz: 'datenschutz.html',
  agb: 'agb.html',
  widerruf: 'widerruf.html',
  cookies: 'cookies.html',
};

function buildSiteFromPath(inputPath: string): SiteEvidence {
  const baseUrl = 'https://fixture.example';
  const stats = statSync(inputPath);

  if (stats.isFile()) {
    const html = readFileSync(inputPath, 'utf8');
    return {
      inputUrl: baseUrl,
      finalUrl: `${baseUrl}/`,
      finalIsHttps: true,
      tlsValid: null,
      homepage: extractPageEvidence(html, `${baseUrl}/`),
      legalPages: {},
    };
  }

  const homepagePath = path.join(inputPath, 'homepage.html');
  if (!existsSync(homepagePath)) {
    console.error(`Fehler: ${homepagePath} nicht gefunden (Verzeichnis-Modus erwartet homepage.html).`);
    process.exit(2);
  }
  const homepage = extractPageEvidence(readFileSync(homepagePath, 'utf8'), `${baseUrl}/`);

  const legalPages: SiteEvidence['legalPages'] = {};
  for (const [kind, file] of Object.entries(LEGAL_FILES) as [LegalPageKind, string][]) {
    const p = path.join(inputPath, file);
    if (existsSync(p)) {
      legalPages[kind] = extractPageEvidence(readFileSync(p, 'utf8'), `${baseUrl}/${kind}`);
    }
  }

  return {
    inputUrl: baseUrl,
    finalUrl: `${baseUrl}/`,
    finalIsHttps: true,
    tlsValid: null,
    homepage,
    legalPages,
  };
}

const SEVERITY_LABEL: Record<string, string> = {
  blocker: 'BLOCKER',
  warn: 'WARNUNG',
  info: 'HINWEIS',
};

function printReport(report: SiteReport, sourceLabel: string): void {
  const light = { gruen: 'GRÜN', gelb: 'GELB', rot: 'ROT' }[report.trafficLight];
  console.log('Pflichtwächter · Regel-Auswertung (offline)');
  console.log(`Quelle: ${sourceLabel}`);
  console.log(`Score: ${report.score}/100 · Ampel: ${light}`);
  console.log('');

  const bySeverity = { blocker: 0, warn: 1, info: 2 } as Record<string, number>;
  const failed = [...report.findings].sort(
    (a, b) => (bySeverity[a.severity] ?? 9) - (bySeverity[b.severity] ?? 9),
  );

  if (failed.length === 0) {
    console.log('Keine Auffälligkeiten in den geprüften Regeln.');
  }
  for (const f of failed) {
    console.log(`[${SEVERITY_LABEL[f.severity]}] ${f.id} · ${f.title_de} (${f.legal_basis_label})`);
    for (const ev of f.evidence.slice(0, 4)) {
      const parts = [ev.detail, ev.excerpt ? `„${ev.excerpt}“` : null].filter(Boolean);
      if (parts.length > 0) console.log(`    → ${parts.join(' — ')}`);
    }
    console.log(`    Was Sie tun können: ${f.fix_hint_de}`);
    console.log('');
  }

  const passed = report.results.filter((r: RuleResult) => r.status === 'pass').map((r) => r.id);
  const skipped = report.results.filter((r: RuleResult) => r.status === 'skip');
  console.log(`Bestanden: ${passed.join(', ') || '—'}`);
  if (skipped.length > 0) {
    console.log('Übersprungen:');
    for (const s of skipped) {
      console.log(`  ${s.id} — ${s.skip_reason_de ?? ''} (${CATALOG[s.id].title_de})`);
    }
  }
  console.log('');
  const groups = RULE_GROUPS_DE.map((g) => g.name).join(' · ');
  console.log(`Geprüfte Bereiche: ${groups}`);
  console.log(
    'Hinweis: Pflichtwächter ist ein technisches Prüfwerkzeug. Es ersetzt keine anwaltliche Beratung. Keine Garantie für Abmahnfreiheit.',
  );
}

function main(): void {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const json = args.includes('--json');
  const target = args.find((a) => !a.startsWith('--'));

  if (!target) {
    console.error('Aufruf: pnpm rules:eval <datei.html | fixture-verzeichnis> [--json]');
    process.exit(2);
  }

  // pnpm runs package scripts with the package as cwd; resolve user paths
  // against the directory the command was typed in.
  const base = process.env.INIT_CWD ?? process.cwd();
  const resolved = path.isAbsolute(target) ? target : path.resolve(base, target);
  if (!existsSync(resolved)) {
    console.error(`Fehler: Pfad nicht gefunden: ${resolved}`);
    process.exit(2);
  }

  const site = buildSiteFromPath(resolved);
  const report = evaluateSite(site);

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report, resolved);
  }
}

main();
