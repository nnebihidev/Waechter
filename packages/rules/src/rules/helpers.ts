import { CATALOG } from '../catalog';
import type { Evidence, RuleId, RuleResult, Severity } from '../types';

export function pass(id: RuleId, evidence: Evidence[] = []): RuleResult {
  return { id, status: 'pass', severity: CATALOG[id].severity, evidence };
}

export function fail(id: RuleId, evidence: Evidence[], severityOverride?: Severity): RuleResult {
  return {
    id,
    status: 'fail',
    severity: severityOverride ?? CATALOG[id].severity,
    evidence,
  };
}

export function skip(id: RuleId, skip_reason_de: string): RuleResult {
  return { id, status: 'skip', severity: CATALOG[id].severity, evidence: [], skip_reason_de };
}
