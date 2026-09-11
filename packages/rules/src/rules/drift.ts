import { createHash } from 'node:crypto';
import { classifyLegalLink } from '../classify';
import { FAMILY_LABEL_DE } from '../trackers';
import type {
  DriftSnapshot,
  LegalPageKind,
  RuleResult,
  SiteEvidence,
  TrackerFamily,
} from '../types';
import { fail, pass } from './helpers';

const KIND_LABEL_DE: Record<LegalPageKind, string> = {
  impressum: 'Impressum',
  datenschutz: 'Datenschutzerklärung',
  agb: 'AGB',
  widerruf: 'Widerrufsbelehrung',
  cookies: 'Cookie-Hinweise',
};

function sha256(s: string): string {
  return createHash('sha256').update(s, 'utf8').digest('hex');
}

/** Build the persistable drift snapshot for a completed scan. */
export function snapshotFromEvidence(site: SiteEvidence): DriftSnapshot {
  const legalPageTextHashes: DriftSnapshot['legalPageTextHashes'] = {};
  const legalPageUrls: DriftSnapshot['legalPageUrls'] = {};
  for (const [kind, page] of Object.entries(site.legalPages)) {
    if (!page) continue;
    legalPageTextHashes[kind as LegalPageKind] = sha256(page.text);
    legalPageUrls[kind as LegalPageKind] = page.url;
  }

  const linked = new Set<LegalPageKind>();
  for (const link of site.homepage.links) {
    const kind = classifyLegalLink(link.href, link.text);
    if (kind) linked.add(kind);
  }

  const families = new Set<TrackerFamily>(site.homepage.trackers.map((t) => t.family));

  return {
    legalPageTextHashes,
    legalPageUrls,
    legalLinksPresent: [...linked],
    trackerFamilies: [...families],
  };
}

/**
 * G1–G3 · Drift rules — pure diff between two scan snapshots.
 * The worker calls this for paid monitoring; first scans have no previous
 * snapshot and therefore no drift evaluation.
 */
export function evaluateDrift(prev: DriftSnapshot, curr: DriftSnapshot): RuleResult[] {
  const results: RuleResult[] = [];

  // G1 — legal page content changed
  const changed: { kind: LegalPageKind; url: string }[] = [];
  for (const [kind, prevHash] of Object.entries(prev.legalPageTextHashes)) {
    const k = kind as LegalPageKind;
    const currHash = curr.legalPageTextHashes[k];
    if (currHash !== undefined && currHash !== prevHash) {
      changed.push({ kind: k, url: curr.legalPageUrls[k] ?? '' });
    }
  }
  results.push(
    changed.length > 0
      ? fail(
          'G1',
          changed.map((c) => ({
            pageUrl: c.url,
            detail: `${KIND_LABEL_DE[c.kind]}: Inhalt geändert seit dem letzten Scan`,
          })),
        )
      : pass('G1'),
  );

  // G2 — a previously present Impressum/Datenschutz link disappeared
  const gone = (['impressum', 'datenschutz'] as const).filter(
    (k) => prev.legalLinksPresent.includes(k) && !curr.legalLinksPresent.includes(k),
  );
  results.push(
    gone.length > 0
      ? fail(
          'G2',
          gone.map((k) => ({
            pageUrl: prev.legalPageUrls[k] ?? '',
            detail: `Link auf ${KIND_LABEL_DE[k]} ist von der Startseite verschwunden`,
          })),
        )
      : pass('G2'),
  );

  // G3 — new tracker family appeared
  const newFamilies = curr.trackerFamilies.filter((f) => !prev.trackerFamilies.includes(f));
  results.push(
    newFamilies.length > 0
      ? fail(
          'G3',
          newFamilies.map((f) => ({
            pageUrl: '',
            detail: `Neu erkannt: ${FAMILY_LABEL_DE[f]}`,
          })),
        )
      : pass('G3'),
  );

  return results;
}
