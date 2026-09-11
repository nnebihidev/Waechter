import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import { LogoMark } from '@/components/icons';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jbMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbmono', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Pflichtwächter — Deine Website, abmahnfester im Blick.',
    template: '%s · Pflichtwächter',
  },
  description:
    'Pflichtwächter prüft deutsche Websites automatisch auf Impressum, Datenschutzerklärung, Cookie-Einwilligung, Preisangaben und Widerruf — und überwacht sie fortlaufend. Technisches Prüfwerkzeug, kein Rechtsrat.',
};

const FOOTER_COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Produkt',
    links: [
      { href: '/#leistungen', label: 'Was wir prüfen' },
      { href: '/#preise', label: 'Preise' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      { href: '/impressum', label: 'Impressum' },
      { href: '/datenschutz', label: 'Datenschutz' },
      { href: '/agb', label: 'AGB' },
    ],
  },
  {
    title: 'Verträge',
    links: [
      { href: '/widerruf', label: 'Widerruf' },
      { href: '/avv', label: 'AVV (Art. 28 DSGVO)' },
    ],
  },
  {
    title: 'Technik',
    links: [{ href: '/bot', label: 'Unser Crawler' }],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${jbMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
            <Link href="/" className="flex items-center gap-2.5 text-pine">
              <LogoMark className="h-6 w-6" />
              <span className="text-lg font-semibold tracking-tight text-ink">
                Pflichtwächter
              </span>
            </Link>
            <nav aria-label="Hauptnavigation" className="flex gap-4 text-sm text-ink sm:gap-6">
              <Link href="/#leistungen" className="hover:text-pine">
                Was wir prüfen
              </Link>
              <Link href="/#preise" className="hover:text-pine">
                Preise
              </Link>
              <Link href="/#faq" className="hover:text-pine">
                FAQ
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t-2 border-strong bg-paper">
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              <div className="col-span-2 sm:col-span-1">
                <p className="flex items-center gap-2 text-pine">
                  <LogoMark className="h-5 w-5" />
                  <span className="font-semibold tracking-tight text-ink">Pflichtwächter</span>
                </p>
                <p className="mt-3 font-mono text-xs tracking-wider text-muted uppercase">
                  Server in der EU
                  <br />
                  Daten nach 30 Tagen gelöscht
                  <br />
                  Kein Rechtsrat
                </p>
              </div>
              {FOOTER_COLUMNS.map((col) => (
                <nav key={col.title} aria-label={col.title}>
                  <p className="font-mono text-xs tracking-wider text-muted uppercase">
                    {col.title}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-sm text-muted hover:text-ink">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
            <div className="mt-12 border-t border-line pt-6">
              <p className="text-sm text-muted">
                Pflichtwächter ist ein technisches Prüf- und Monitoring-Werkzeug. Es ersetzt keine
                anwaltliche Beratung. Keine Garantie für Abmahnfreiheit.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
