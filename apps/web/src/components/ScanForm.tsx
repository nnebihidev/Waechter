'use client';

import { useState } from 'react';

/**
 * Domain input for the free Sofort-Check. The crawler pipeline attaches in
 * Phase 2 (see docs/PLAN.md); until then the form validates the input and
 * points to the sample report so nobody hits a dead end.
 */
export function ScanForm() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function normalize(input: string): URL | null {
    const trimmed = input.trim();
    if (trimmed.length === 0) return null;
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const url = new URL(withScheme);
      if (!url.hostname.includes('.')) return null;
      return url;
    } catch {
      return null;
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = normalize(value);
    if (!url) {
      setIsError(true);
      setMessage('Bitte geben Sie eine gültige Domain ein, zum Beispiel „www.ihre-website.de“.');
      return;
    }
    setIsError(false);
    setMessage(
      `Der automatische Sofort-Check für ${url.hostname} startet hier in Kürze — die Prüf-Engine ist fertig, die Live-Anbindung folgt. Unten sehen Sie, wie Ihr Bericht aussehen wird.`,
    );
    document.getElementById('beispielbericht')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl" noValidate>
      <label htmlFor="domain" className="sr-only">
        Ihre Website
      </label>
      {/* Input and button share one continuous strong border, flush-joined. */}
      <div className="flex flex-col overflow-hidden rounded-md border border-strong bg-card shadow-card sm:flex-row">
        <input
          id="domain"
          name="domain"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="www.ihre-website.de"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full flex-1 border-b border-line bg-card px-4 py-3.5 text-base text-ink outline-none placeholder:text-muted sm:border-b-0"
        />
        <button
          type="submit"
          className="shrink-0 bg-pine px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-pine-dark"
        >
          Website prüfen
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-4 min-h-6 text-sm ${isError ? 'text-rot' : 'text-muted'}`}
      >
        {message}
      </p>
    </form>
  );
}
