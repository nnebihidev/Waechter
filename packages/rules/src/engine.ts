import { CATALOG } from './catalog';
import { runAccessibility } from './rules/accessibility';
import { runCookies } from './rules/cookies';
import { runDatenschutz } from './rules/datenschutz';
import { runErreichbarkeit } from './rules/erreichbarkeit';
import { runImpressum } from './rules/impressum';
import { runShop } from './rules/shop';
import type { Finding, RuleResult, SiteEvidence, SiteReport, TrafficLight } from './types';

const PENALTY = { blocker: 15, warn: 6, info: 1 } as const;

/** 100 − 15·blocker − 6·warn − 1·info, clamped to 0–100. */
export function scoreFromResults(results: RuleResult[]): number {
  let score = 100;
  for (const r of results) {
    if (r.status !== 'fail') continue;
    score -= PENALTY[r.severity];
  }
  return Math.max(0, Math.min(100, score));
}

export function trafficLightFromResults(results: RuleResult[]): TrafficLight {
  const failed = results.filter((r) => r.status === 'fail');
  if (failed.some((r) => r.severity === 'blocker')) return 'rot';
  if (failed.some((r) => r.severity === 'warn')) return 'gelb';
  return 'gruen';
}

/** Join failed results with their catalog copy — what reports render. */
export function findingsFromResults(results: RuleResult[]): Finding[] {
  return results
    .filter((r) => r.status === 'fail')
    .map((r) => ({
      ...CATALOG[r.id],
      severity: r.severity,
      evidence: r.evidence,
    }));
}

/**
 * Run the full static rule catalog (A–F) against collected site evidence.
 * Drift rules (G) live in ./rules/drift and run against snapshots instead.
 */
export function evaluateSite(site: SiteEvidence): SiteReport {
  const results: RuleResult[] = [
    ...runErreichbarkeit(site),
    ...runImpressum(site),
    ...runDatenschutz(site),
    ...runCookies(site),
    ...runShop(site),
    ...runAccessibility(site),
  ];

  return {
    results,
    findings: findingsFromResults(results),
    score: scoreFromResults(results),
    trafficLight: trafficLightFromResults(results),
  };
}
