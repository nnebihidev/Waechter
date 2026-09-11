import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Pflichtwächter — Deine Website, abmahnfester im Blick.',
    template: '%s · Pflichtwächter',
  },
  description:
    'Pflichtwächter prüft deutsche Websites automatisch auf Impressum, Datenschutzerklärung, Cookie-Einwilligung, Preisangaben und Widerruf — und überwacht sie fortlaufend. Technisches Prüfwerkzeug, kein Rechtsrat.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b border-line bg-paper">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight text-pine">
              Pflichtwächter
            </Link>
            <nav aria-label="Hauptnavigation" className="flex gap-5 text-sm text-ink">
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

        <footer className="mt-16 border-t border-line bg-card">
          <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted">
            <p className="mb-6 max-w-2xl">
              Pflichtwächter ist ein technisches Prüf- und Monitoring-Werkzeug. Es ersetzt keine
              anwaltliche Beratung. Keine Garantie für Abmahnfreiheit.
            </p>
            <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/impressum" className="hover:text-pine">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-pine">
                Datenschutz
              </Link>
              <Link href="/agb" className="hover:text-pine">
                AGB
              </Link>
              <Link href="/widerruf" className="hover:text-pine">
                Widerruf
              </Link>
              <Link href="/avv" className="hover:text-pine">
                AVV
              </Link>
              <Link href="/bot" className="hover:text-pine">
                Unser Crawler
              </Link>
            </nav>
            <p className="mt-6">
              Server in der EU · Roh-Daten nach 30 Tagen gelöscht · Nur technisch notwendige
              Cookies
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
