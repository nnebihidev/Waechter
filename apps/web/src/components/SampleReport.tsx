import { CATALOG, type RuleId, type Severity } from '@pflichtwaechter/rules';

const SEVERITY_LABEL: Record<Severity, string> = {
  blocker: 'Kritisch',
  warn: 'Warnung',
  info: 'Hinweis',
};

const SEVERITY_CLASS: Record<Severity, string> = {
  blocker: 'bg-red-50 text-ampel-rot border-ampel-rot/30',
  warn: 'bg-amber-50 text-ampel-gelb border-ampel-gelb/30',
  info: 'bg-pine-light text-pine border-pine/30',
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

/**
 * Static sample report for the landing page. All copy comes from the real
 * rule catalog so the demo always matches what the engine actually says.
 */
export function SampleReport() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <p className="text-sm text-muted">Beispielbericht · anonymisierte Demo-Daten</p>
          <p className="text-lg font-semibold text-ink">beispiel-firma.de</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 rounded-full bg-ampel-rot"
          ></span>
          <p className="text-sm font-medium text-ink">
            Score <span className="text-2xl font-bold">54</span>
            <span className="text-muted">/100</span>
          </p>
        </div>
      </div>

      <ul className="divide-y divide-line">
        {SAMPLE.map(({ id, evidence_de }) => {
          const rule = CATALOG[id];
          return (
            <li key={id} className="px-6 py-5">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded border px-2 py-0.5 text-xs font-semibold ${SEVERITY_CLASS[rule.severity]}`}
                >
                  {SEVERITY_LABEL[rule.severity]}
                </span>
                <span className="text-xs text-muted">{rule.legal_basis_label}</span>
              </div>
              <p className="font-semibold text-ink">{rule.title_de}</p>
              <p className="mt-1 text-sm text-muted">{evidence_de}</p>
              <p className="mt-2 text-sm text-ink">
                <span className="font-medium">Was Sie tun können: </span>
                {rule.fix_hint_de}
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
