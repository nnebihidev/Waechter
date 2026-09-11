import { ALL_RULE_IDS, CATALOG, RULE_GROUPS_DE } from '@pflichtwaechter/rules';
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
      <section className="border-b border-line bg-card">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Deine Website, abmahnfester im Blick.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Pflichtwächter prüft Ihre Website automatisch auf die Muster, die in Deutschland am
            häufigsten zu Abmahnungen führen — Impressum, Datenschutzerklärung,
            Cookie-Einwilligung, Preisangaben, Widerruf — und meldet sich, sobald etwas kaputtgeht.
          </p>
          <div className="mt-8">
            <ScanForm />
          </div>
          <p className="mt-6 text-sm text-muted">
            Server in der EU · Daten nach 30 Tagen gelöscht · Kein Rechtsrat
          </p>
        </div>
      </section>

      {/* Rule catalog */}
      <section id="leistungen" className="mx-auto max-w-5xl scroll-mt-8 px-4 py-16">
        <h2 className="text-2xl font-bold text-ink">Was geprüft wird</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Jeder Prüfpunkt ist eine feste, nachvollziehbare Regel mit Beleg — keine vagen
          KI-Vermutungen. Das prüft Pflichtwächter bei jedem Lauf:
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {RULE_GROUPS_DE.filter((g) => g.prefix !== 'G').map((group) => (
            <div key={group.prefix} className="rounded-lg border border-line bg-card p-5">
              <h3 className="font-semibold text-pine">{group.name}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink">
                {rulesForGroup(group.prefix).map((rule) => (
                  <li key={rule.id} className="flex gap-2">
                    <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"></span>
                    {rule.title_de}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-lg border border-pine/30 bg-pine-light p-5">
            <h3 className="font-semibold text-pine">Änderungs-Überwachung (Wächter-Pläne)</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink">
              {rulesForGroup('G').map((rule) => (
                <li key={rule.id} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"></span>
                  {rule.title_de}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">
              Ein Theme-Update wirft den Impressum-Link aus dem Footer? Sie erfahren es per
              E-Mail, bevor es jemand anders bemerkt.
            </p>
          </div>
        </div>
      </section>

      {/* Sample report */}
      <section id="beispielbericht" className="border-y border-line bg-paper">
        <div className="mx-auto max-w-5xl scroll-mt-8 px-4 py-16">
          <h2 className="text-2xl font-bold text-ink">So sieht Ihr Bericht aus</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Verständliches Deutsch, konkreter Beleg, konkreter nächster Schritt — pro Fund.
          </p>
          <div className="mt-8">
            <SampleReport />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preise" className="mx-auto max-w-5xl scroll-mt-8 px-4 py-16">
        <h2 className="text-2xl font-bold text-ink">Preise</h2>
        <p className="mt-2 text-muted">{vatPriceHint()}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-lg border p-5 ${
                plan.highlight ? 'border-pine bg-pine-light' : 'border-line bg-card'
              }`}
            >
              <h3 className="font-semibold text-ink">{plan.name}</h3>
              <p className="mt-2 text-2xl font-bold text-ink">{plan.price}</p>
              <p className="text-sm text-muted">{plan.cadence}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-ink">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"></span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-md border border-pine px-4 py-2 text-center text-sm font-semibold text-pine">
                {plan.cta} — ab Launch
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Jahreszahlung: 10 Monate zahlen, 12 Monate nutzen (folgt nach dem Start).
        </p>
      </section>

      {/* Agency */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-2xl font-bold text-ink">Für Agenturen: 10 Mandate, ein Dashboard</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Sie betreuen WordPress-Sites, Shops und Kanzlei-Websites Ihrer Kunden? Pflichtwächter
            prüft alle Domains wöchentlich, meldet Verschlechterungen sofort und liefert
            mandantenfähige PDF-Berichte, die Sie unter eigenem Namen weitergeben können. Kein
            händisches Durchklicken am Monatsende mehr.
          </p>
          <ul className="mt-6 grid max-w-2xl gap-3 text-sm text-ink sm:grid-cols-2">
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"></span>
              10 Domains im Agentur-Plan, erweiterbar
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"></span>
              Kundenfertige Berichte ohne Ihre Einkaufspreise
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"></span>
              AVV inklusive (Art. 28 DSGVO)
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"></span>
              CSV-Export für Ihr Reporting
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-8 px-4 py-16">
        <h2 className="text-2xl font-bold text-ink">Häufige Fragen</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group rounded-lg border border-line bg-card px-5 py-4">
              <summary className="cursor-pointer font-medium text-ink marker:text-pine">
                {q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
