import { CATALOG, type RuleId, type Severity } from '@pflichtwaechter/rules';

const SEVERITY_LABEL: Record<Severity, string> = {
  blocker: 'Kritisch',
  warn: 'Warnung',
  info: 'Hinweis',
};

const SEVERITY_BADGE: Record<Severity, { badge: string; dot: string }> = {
  blocker: { badge: 'bg-rot-bg text-rot border-rot-line', dot: 'bg-rot' },
  warn: { badge: 'bg-gelb-bg text-gelb border-gelb-line', dot: 'bg-gelb' },
  info: { badge: 'bg-gruen-bg text-gruen border-gruen-line', dot: 'bg-gruen' },
};

/** Anonymized but realistic sample evidence, keyed by the real rule catalog. */
const SAMPLE: { id: RuleId; evidence_de: string }[] = [
  {
    id: 'D3',
    evidence_de:
      'Auf der Startseite lädt „googletagmanager.com/gtag/js“ direkt beim Aufruf — ein Einwilligungs-Banner war nicht erkennbar.',
  },
  {
    id: 'B3',
    evidence_de:
      'Impressum gefunden unter /impressum, aber kein Muster aus Straße, Postleitzahl und Ort — nur „Postfach 12 34“.',
  },
  {
    id: 'C5',
    evidence_de:
      'Google Fonts wird von fonts.googleapis.com geladen, in der Datenschutzerklärung aber nicht erwähnt.',
  },
];

function SeverityBadge({ severity }: { severity: Severity }) {
  const s = SEVERITY_BADGE[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-xs font-medium tracking-wider uppercase ${s.badge}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.dot}`}></span>
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

/**
 * Static sample report for the landing page. All copy comes from the real
 * rule catalog so the demo always matches what the engine actually says.
 */
export function SampleReport() {
  return (
    <div className="mx-auto max-w-[600px] overflow-hidden rounded-md border border-line bg-card shadow-floating">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <p className="font-mono text-xs tracking-wider text-muted uppercase">
            Beispielbericht · Demo-Daten
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">beispiel-firma.de</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm text-ink">
            Score <span className="text-2xl font-semibold">54</span>
            <span className="text-muted">/100</span>
          </p>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-sm border border-rot-line bg-rot-bg px-2 py-0.5 font-mono text-xs font-medium tracking-wider text-rot uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-rot"></span>
            Handlungsbedarf
          </span>
        </div>
      </div>

      <ul className="divide-y divide-line">
        {SAMPLE.map(({ id, evidence_de }) => {
          const rule = CATALOG[id];
          return (
            <li key={id} className="px-6 py-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <SeverityBadge severity={rule.severity} />
                <span className="rounded-sm bg-subtle px-1.5 py-0.5 font-mono text-xs text-muted">
                  {rule.legal_basis_label}
                </span>
              </div>
              <p className="font-semibold text-ink">{rule.title_de}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{evidence_de}</p>
              <p className="mt-3 flex gap-2 text-sm leading-relaxed text-ink">
                <span aria-hidden="true" className="font-mono text-muted select-none">
                  &gt;
                </span>
                <span>
                  <span className="font-medium">Was Sie tun können: </span>
                  {rule.fix_hint_de}
                </span>
              </p>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-line bg-paper px-6 py-4 text-sm text-muted">
        4 weitere Hinweise im vollständigen Bericht · Pflichtwächter ersetzt keine anwaltliche
        Beratung.
      </div>
    </div>
  );
}
