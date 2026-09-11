import { describe, expect, it } from 'vitest';
import { evaluateSite, scoreFromResults, trafficLightFromResults } from '../src/engine';
import type { RuleResult } from '../src/types';
import { fixtureSite } from './helpers';

function failedIds(report: ReturnType<typeof evaluateSite>) {
  return report.results
    .filter((r) => r.status === 'fail')
    .map((r) => r.id)
    .sort();
}

describe('scoring', () => {
  const fails = (sev: 'blocker' | 'warn' | 'info', n: number): RuleResult[] =>
    Array.from({ length: n }, () => ({ id: 'A1', status: 'fail', severity: sev, evidence: [] }));

  it('applies −15/−6/−1 per blocker/warn/info', () => {
    expect(scoreFromResults([...fails('blocker', 1), ...fails('warn', 2), ...fails('info', 3)])).toBe(
      100 - 15 - 12 - 3,
    );
  });

  it('ignores passed and skipped rules', () => {
    const results: RuleResult[] = [
      { id: 'A1', status: 'pass', severity: 'blocker', evidence: [] },
      { id: 'B1', status: 'skip', severity: 'blocker', evidence: [] },
    ];
    expect(scoreFromResults(results)).toBe(100);
  });

  it('clamps at 0', () => {
    expect(scoreFromResults(fails('blocker', 10))).toBe(0);
  });

  it('derives the traffic light from failed severities', () => {
    expect(trafficLightFromResults(fails('blocker', 1))).toBe('rot');
    expect(trafficLightFromResults(fails('warn', 1))).toBe('gelb');
    expect(trafficLightFromResults(fails('info', 1))).toBe('gruen');
    expect(trafficLightFromResults([])).toBe('gruen');
  });
});

describe('fixture: good-site', () => {
  const report = evaluateSite(fixtureSite('good-site'));

  it('has no findings and a perfect score', () => {
    expect(failedIds(report)).toEqual([]);
    expect(report.score).toBe(100);
    expect(report.trafficLight).toBe('gruen');
  });

  it('skips the shop rules', () => {
    const e1 = report.results.find((r) => r.id === 'E1');
    expect(e1?.status).toBe('skip');
  });
});

describe('fixture: shop-site', () => {
  const report = evaluateSite(fixtureSite('shop-site'));

  it('finds the expected problems', () => {
    expect(failedIds(report)).toEqual(['B5', 'C5', 'D1', 'D3', 'E1', 'E2', 'E3']);
  });

  it('scores 45 and shows red', () => {
    // 100 − 15 (D3) − 15 (E1) − 6·4 (B5, C5, E2, E3) − 1 (D1) = 45
    expect(report.score).toBe(45);
    expect(report.trafficLight).toBe('rot');
  });

  it('joins findings with German catalog copy', () => {
    const e1 = report.findings.find((f) => f.id === 'E1');
    expect(e1?.title_de).toContain('Widerrufsbelehrung');
    expect(e1?.fix_hint_de.length).toBeGreaterThan(20);
    expect(e1?.legal_basis_label).toContain('BGB');
  });
});

describe('fixture: broken-site (homepage only)', () => {
  const report = evaluateSite(fixtureSite('broken-site'));

  it('finds the expected problems', () => {
    expect(failedIds(report)).toEqual(['A3', 'B1', 'C1', 'D1', 'D4', 'F1', 'F2', 'F3']);
  });

  it('scores 44 and shows red', () => {
    // 100 − 15 (B1) − 15 (C1) − 6·4 (A3, D4, F1, F2) − 1·2 (D1, F3) = 44
    expect(report.score).toBe(44);
    expect(report.trafficLight).toBe('rot');
  });

  it('never outputs guarantee language in findings', () => {
    const all = JSON.stringify(report.findings);
    expect(all).not.toMatch(/abmahnfest|100\s?% rechtssicher/i);
  });
});
