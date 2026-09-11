import { ALL_RULE_IDS, CATALOG, RULE_GROUPS_DE } from '@pflichtwaechter/rules';
import { GROUP_ICONS, HeroGrid } from '@/components/icons';
import { ScanForm } from '@/components/ScanForm';
import { SampleReport } from '@/components/SampleReport';
import { vatPriceHint } from '@/lib/vat';

const PLANS = [
  {
    name: 'Sofort-Check',
    price: '0 €',
    cadence: 'einmalig',
    features: ['Score und Ampel', 'Die drei wichtigsten Hinweise', 'Ergebnis per E-Mail'],
    cta: 'Kostenlos prüfen',
  },
  {
    name: 'Prüfbericht',
    price: '9 €',
    cadence: 'einmalig',
    features: [
      'Vollständiger PDF-Bericht',
      'Alle Prüfpunkte mit Belegen',
      'Konkrete Handlungshinweise',
      '14 Tage Widerrufsrecht',
    ],
    cta: 'Bericht kaufen',
  },
  {
    name: 'Wächter',
    price: '12 €',
    cadence: 'pro Monat und Domain',
    features: [
      'Wöchentliche Neuprüfung',
      'E-Mail, sobald sich etwas verschlechtert',
      'Verlauf und Vergleich zum letzten Scan',
      'Monatliche Zusammenfassung',
    ],
    cta: 'Überwachung starten',
    highlight: true,
  },
  {
    name: 'Agentur',
    price: '49 €',
    cadence: 'pro Monat, 10 Domains',
    features: [
      'Alle Wächter-Funktionen',
      'Mandantenfähige PDF-Berichte',
      'Gemeinsamer Posteingang',
      'CSV-Export',
    ],
    cta: 'Für Agenturen',
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Ersetzt Pflichtwächter eine Anwältin oder einen Anwalt?',
    a: 'Nein. Pflichtwächter ist ein technisches Prüf- und Monitoring-Werkzeug. Es erkennt Muster, die häufig mit Pflichtangaben zusammenhängen, und erklärt sie verständlich. Eine rechtliche Bewertung Ihres Einzelfalls kann nur eine anwaltliche Beratung leisten — bei kritischen Funden empfehlen wir genau das.',
  },
  {
    q: 'Kann ich den Kauf widerrufen?',
    a: 'Ja, als Verbraucher haben Sie 14 Tage Widerrufsrecht. Beim einmaligen PDF-Bericht erlischt das Widerrufsrecht, wenn Sie vor dem Kauf ausdrücklich zustimmen, dass wir sofort liefern — das fragen wir über eine eigene, nicht vorangekreuzte Checkbox ab. Details in der Widerrufsbelehrung.',
  },
  {
    q: 'Was passiert mit den Daten meiner Website?',
    a: 'Unser Crawler ruft nur öffentlich erreichbare Seiten ab, maximal 15 pro Prüflauf. Roher Seitenquelltext wird nach spätestens 30 Tagen gelöscht; im Bericht bleiben nur kurze Textauszüge als Beleg. Alle Server stehen in der EU.',
  },
  {
    q: 'Meine Website blockiert Bots — funktioniert die Prüfung trotzdem?',
    a: 'Unser Crawler respektiert Ihre robots.txt. Wenn er blockiert wird, zeigen wir Ihnen den genauen Eintrag, mit dem Sie „PflichtwaechterBot“ gezielt erlauben können — ohne andere Bots freizuschalten.',
  },
  {
    q: 'Ich bin Kleinunternehmer — gilt das alles auch für mich?',
    a: 'Ja. Impressumspflicht, Datenschutzerklärung und Cookie-Regeln gelten unabhängig von der Umsatzsteuer. Die Kleinunternehmerregelung (§ 19 UStG) betrifft nur, ob Sie Umsatzsteuer ausweisen — auch das prüfen wir im Impressum mit.',
  },
];

function rulesForGroup(prefix: string) {
  return ALL_RULE_IDS.filter((id) => id.startsWith(prefix)).map((id) => CATALOG[id]);
}

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-card">
        <HeroGrid className="absolute inset-0 h-full w-full text-pine" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl sm:leading-[1.1]">
            Deine Website, abmahnfester im&nbsp;Blick.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Pflichtwächter prüft Ihre Website automatisch auf die Muster, die in Deutschland am
            häufigsten zu Abmahnungen führen — Impressum, Datenschutzerklärung,
            Cookie-Einwilligung, Preisangaben, Widerruf — und meldet sich, sobald etwas
            kaputtgeht.
          </p>
          <div className="mt-10">
            <ScanForm />
          </div>
          <p className="mt-6 font-mono text-xs tracking-wider text-muted uppercase">
            Server in der EU · Daten nach 30 Tagen gelöscht · Kein Rechtsrat
          </p>
        </div>
      </section>

      {/* Rule catalog */}
      <section id="leistungen" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-[32px]">
          Was geprüft wird
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Jeder Prüfpunkt ist eine feste, nachvollziehbare Regel mit Beleg — keine vagen
          KI-Vermutungen. Das prüft Pflichtwächter bei jedem Lauf:
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RULE_GROUPS_DE.map((group) => {
            const Icon = GROUP_ICONS[group.prefix]!;
            const isDrift = group.prefix === 'G';
            return (
              <div
                key={group.prefix}
                className={`rounded-md border bg-card p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-strong ${
                  isDrift ? 'border-pine/40' : 'border-line'
                }`}
              >
                <Icon className="h-6 w-6 text-pine" />
                <h3 className="mt-4 text-lg font-medium text-ink">
                  {group.name}
                  {isDrift && (
                    <span className="mt-1 block font-mono text-xs tracking-wider text-pine uppercase">
                      Wächter-Pläne
                    </span>
                  )}
                </h3>
                <div className="mt-3 border-t border-line pt-3">
                  <ul className="space-y-2 text-sm leading-relaxed text-muted">
                    {rulesForGroup(group.prefix).map((rule) => (
                      <li key={rule.id} className="flex gap-2">
                        <span aria-hidden="true" className="font-mono text-line select-none">
                          —
                        </span>
                        {rule.title_de}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sample report */}
      <section id="beispielbericht" className="scroll-mt-16 border-y border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-[32px]">
              So sieht Ihr Bericht aus
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              Verständliches Deutsch, konkreter Beleg, konkreter nächster Schritt — pro Fund.
            </p>
          </div>
          <div className="mt-10">
            <SampleReport />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preise" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-[32px]">Preise</h2>
        <p className="mt-3 font-mono text-xs tracking-wider text-muted uppercase">
          {vatPriceHint()}
        </p>
        <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-md bg-card p-8 ${
                plan.highlight ? 'border-2 border-pine shadow-card' : 'border border-line'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-pine px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-white uppercase">
                  Beliebt
                </span>
              )}
              <h3 className="font-medium text-ink">{plan.name}</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{plan.price}</p>
              <p className="mt-1 text-sm text-muted">{plan.cadence}</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm leading-relaxed text-ink">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden="true" className="font-mono text-pine select-none">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <p
                className={`mt-8 rounded-md px-4 py-2.5 text-center text-sm font-semibold ${
                  plan.highlight
                    ? 'bg-pine text-white'
                    : 'border border-strong text-ink'
                }`}
              >
                {plan.cta} — ab Launch
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Jahreszahlung: 10 Monate zahlen, 12 Monate nutzen (folgt nach dem Start).
        </p>
      </section>

      {/* Agency — full structural break in brand green */}
      <section className="bg-pine text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs tracking-wider text-white/70 uppercase">
              Für Agenturen &amp; Freelancer
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[32px]">
              10 Mandate, ein Dashboard
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/85">
              Sie betreuen WordPress-Sites, Shops und Kanzlei-Websites Ihrer Kunden?
              Pflichtwächter prüft alle Domains wöchentlich, meldet Verschlechterungen sofort und
              liefert mandantenfähige PDF-Berichte, die Sie unter eigenem Namen weitergeben
              können. Kein händisches Durchklicken am Monatsende mehr.
            </p>
            <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
              {[
                '10 Domains im Agentur-Plan, erweiterbar',
                'Kundenfertige Berichte ohne Ihre Einkaufspreise',
                'AVV inklusive (Art. 28 DSGVO)',
                'CSV-Export für Ihr Reporting',
              ].map((f) => (
                <li key={f} className="flex gap-2 text-white/90">
                  <span aria-hidden="true" className="font-mono text-white/60 select-none">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {/* Abstract: a stack of monitored domains */}
          <div aria-hidden="true" className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="absolute -top-6 left-6 w-full rounded-md border border-white/20 bg-white/5 p-4">
              <p className="font-mono text-xs text-white/50">kanzlei-weber.example</p>
              <p className="mt-2 font-mono text-xs text-white/70">Score 92 · ▲ stabil</p>
            </div>
            <div className="absolute -top-3 left-3 w-full rounded-md border border-white/30 bg-white/10 p-4">
              <p className="font-mono text-xs text-white/60">stadtwerk-shop.example</p>
              <p className="mt-2 font-mono text-xs text-white/80">Score 76 · Hinweis offen</p>
            </div>
            <div className="relative w-full rounded-md border border-white/40 bg-pine-dark p-4 shadow-floating">
              <p className="font-mono text-xs text-white/70">bergkaffee.example</p>
              <p className="mt-2 font-mono text-sm text-white">
                Score 54 · <span className="text-[#f2b8b5]">2 kritische Funde</span>
              </p>
              <p className="mt-2 font-mono text-xs text-white/70">→ E-Mail an Agentur gesendet</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-16 px-4 py-16 sm:py-24">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-[32px]">
          Häufige Fragen
        </h2>
        <div className="mt-6">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group border-b border-line py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                {q}
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-xl text-pine transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
