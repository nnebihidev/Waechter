/**
 * Core types of the Pflichtwächter rule engine.
 *
 * The engine is pure: it consumes `SiteEvidence` (produced by the crawler or by
 * the fixture CLI) and returns rule results. It never touches network or DB.
 */

export type Severity = 'blocker' | 'warn' | 'info';

export type RuleStatus = 'fail' | 'pass' | 'skip';

export type RuleId =
  // A — Erreichbarkeit
  | 'A1'
  | 'A2'
  | 'A3'
  // B — Impressum (§ 5 DDG)
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'B5'
  | 'B6'
  | 'B7'
  // C — Datenschutz (DSGVO Art. 12–14)
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'C6'
  // D — Cookies / TDDDG
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  // E — Shop / Verbrauchersignale
  | 'E1'
  | 'E2'
  | 'E3'
  // F — Barrierefreiheit (BFSG-Smoke)
  | 'F1'
  | 'F2'
  | 'F3'
  // G — Drift (nur bezahlte Überwachung)
  | 'G1'
  | 'G2'
  | 'G3';

export interface RuleMeta {
  id: RuleId;
  /** Default severity; individual results may downgrade (e.g. B3 PO-box case). */
  severity: Severity;
  title_de: string;
  why_de: string;
  fix_hint_de: string;
  /** Short label, e.g. "§ 5 DDG". Never a legal opinion. */
  legal_basis_label: string;
}

/** Max length for persisted evidence excerpts (DSGVO storage limitation). */
export const EVIDENCE_EXCERPT_MAX = 500;

export interface Evidence {
  pageUrl: string;
  selector?: string;
  /** ≤ EVIDENCE_EXCERPT_MAX chars, enforced by makeExcerpt(). */
  excerpt?: string;
  httpStatus?: number;
  /** Short machine-ish detail, e.g. the tracker family or missing token. */
  detail?: string;
}

export interface RuleResult {
  id: RuleId;
  status: RuleStatus;
  /** Effective severity of THIS result (may differ from catalog default). */
  severity: Severity;
  evidence: Evidence[];
  /** German one-liner why the rule was skipped (only for status 'skip'). */
  skip_reason_de?: string;
}

/** A failed rule joined with its catalog copy — what reports render. */
export interface Finding extends RuleMeta {
  evidence: Evidence[];
}

export type LegalPageKind = 'impressum' | 'datenschutz' | 'agb' | 'widerruf' | 'cookies';

export type LinkArea = 'header' | 'footer' | 'nav' | 'body';

export interface PageLink {
  href: string;
  text: string;
  area: LinkArea;
}

export interface PageImage {
  src: string;
  /** null = alt attribute missing entirely; '' = explicitly decorative. */
  alt: string | null;
}

export interface PageHeading {
  level: number;
  text: string;
}

export type TrackerFamily =
  | 'google-analytics'
  | 'google-tag-manager'
  | 'meta-pixel'
  | 'tiktok-pixel'
  | 'hotjar'
  | 'matomo-external'
  | 'google-fonts'
  | 'youtube-embed'
  | 'google-maps';

export interface TrackerHit {
  family: TrackerFamily;
  /** What matched, e.g. a script src or an inline snippet marker. */
  source: string;
}

export interface ConsentPrechecked {
  label: string;
  excerpt: string;
}

export interface ConsentEvidence {
  /** Known CMP vendor if recognizable, else 'generic'. */
  vendor: string;
  selector: string;
  excerpt: string;
  precheckedNonEssential: ConsentPrechecked[];
}

/** Evidence extracted from a single fetched page (static HTML pass). */
export interface PageEvidence {
  url: string;
  httpStatus: number;
  title: string | null;
  lang: string | null;
  /** Visible text, whitespace-normalized. */
  text: string;
  links: PageLink[];
  images: PageImage[];
  scriptSrcs: string[];
  /** First 300 chars of each inline script — enough for gtag/fbq markers. */
  inlineScriptSnippets: string[];
  iframeSrcs: string[];
  stylesheetHrefs: string[];
  headings: PageHeading[];
  emails: string[];
  phones: string[];
  trackers: TrackerHit[];
  consent: ConsentEvidence | null;
}

/** Runtime cookie evidence from the Playwright homepage pass (Phase 2+). */
export interface RuntimeCookieEvidence {
  consentUiVisible: boolean;
  cookiesSetBeforeConsent: { name: string; domain: string }[];
}

/** Everything the engine needs about one scanned site. */
export interface SiteEvidence {
  inputUrl: string;
  finalUrl: string;
  finalIsHttps: boolean;
  /** null = unknown (e.g. offline fixture evaluation). */
  tlsValid: boolean | null;
  homepage: PageEvidence;
  legalPages: Partial<Record<LegalPageKind, PageEvidence>>;
  runtimeCookies?: RuntimeCookieEvidence | null;
}

export type TrafficLight = 'gruen' | 'gelb' | 'rot';

export interface SiteReport {
  results: RuleResult[];
  findings: Finding[];
  score: number;
  trafficLight: TrafficLight;
}

/** Minimal snapshot the worker persists per scan to run drift rules (G1–G3). */
export interface DriftSnapshot {
  /** sha256 over normalized visible text per fetched legal page. */
  legalPageTextHashes: Partial<Record<LegalPageKind, string>>;
  /** URL per legal page kind, for evidence rendering. */
  legalPageUrls: Partial<Record<LegalPageKind, string>>;
  /** Legal page kinds that were linked from the homepage. */
  legalLinksPresent: LegalPageKind[];
  trackerFamilies: TrackerFamily[];
}
