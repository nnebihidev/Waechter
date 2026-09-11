import { describe, expect, it } from 'vitest';
import { runDatenschutz } from '../src/rules/datenschutz';
import { byId, DATENSCHUTZ_OK, HOME_OK, site, type SiteOpts } from './helpers';

function run(opts: SiteOpts = {}, homepage = HOME_OK) {
  return runDatenschutz(site(homepage, opts));
}

const withDs = (html: string, status = 200): SiteOpts => ({
  legal: { datenschutz: { html, status } },
});

const HOME_WITH_FONTS = `<html lang="de"><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">
</head><body><h1>x</h1>
<footer><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a></footer>
</body></html>`;

describe('C1 — Datenschutzerklärung exists', () => {
  it('fails as blocker when missing and skips C2–C6', () => {
    const results = run();
    expect(byId(results, 'C1').status).toBe('fail');
    expect(byId(results, 'C1').severity).toBe('blocker');
    for (const id of ['C2', 'C3', 'C4', 'C5', 'C6'] as const) {
      expect(byId(results, id).status).toBe('skip');
    }
  });

  it('fails when the page answers 404', () => {
    expect(byId(run(withDs(DATENSCHUTZ_OK, 404)), 'C1').status).toBe('fail');
  });

  it('passes with a reachable page', () => {
    expect(byId(run(withDs(DATENSCHUTZ_OK)), 'C1').status).toBe('pass');
  });
});

describe('C2 — controller named', () => {
  it('passes when "Verantwortlicher" is present', () => {
    expect(byId(run(withDs(DATENSCHUTZ_OK)), 'C2').status).toBe('pass');
  });

  it('fails without a controller section', () => {
    const html = `<html><body><p>Wir nehmen Datenschutz ernst. Rechtsgrundlage ist Art. 6 DSGVO.
      Sie haben ein Recht auf Auskunft. Daten werden nach 30 Tagen gelöscht (Speicherdauer).</p></body></html>`;
    expect(byId(run(withDs(html)), 'C2').status).toBe('fail');
  });
});

describe('C3 — data subject rights', () => {
  it('fails when no rights are mentioned', () => {
    const html = `<html><body><p>Verantwortlicher: Muster GmbH. Rechtsgrundlage: Art. 6 DSGVO.
      Speicherdauer: 30 Tage.</p></body></html>`;
    expect(byId(run(withDs(html)), 'C3').status).toBe('fail');
  });

  it('passes when at least one right is mentioned', () => {
    expect(byId(run(withDs(DATENSCHUTZ_OK)), 'C3').status).toBe('pass');
  });
});

describe('C4 — legal basis', () => {
  it('fails without any legal basis reference', () => {
    const html = `<html><body><p>Verantwortlicher: Muster GmbH. Sie haben ein Recht auf Auskunft.
      Daten werden nach 30 Tagen gelöscht.</p></body></html>`;
    expect(byId(run(withDs(html)), 'C4').status).toBe('fail');
  });

  it('passes with an Art. 6 reference', () => {
    expect(byId(run(withDs(DATENSCHUTZ_OK)), 'C4').status).toBe('pass');
  });
});

describe('C5 — detected services must be mentioned', () => {
  it('is skipped when no third-party services were detected', () => {
    expect(byId(run(withDs(DATENSCHUTZ_OK)), 'C5').status).toBe('skip');
  });

  it('fails when Google Fonts is embedded but not mentioned', () => {
    const r = byId(run(withDs(DATENSCHUTZ_OK), HOME_WITH_FONTS), 'C5');
    expect(r.status).toBe('fail');
    expect(r.evidence[0]?.detail).toContain('Google Fonts');
  });

  it('passes when the detected service is mentioned', () => {
    const ds = DATENSCHUTZ_OK.replace(
      '</main>',
      '<p>Wir binden Schriftarten über Google Fonts ein; dabei wird Ihre IP-Adresse an Google übertragen.</p></main>',
    );
    expect(byId(run(withDs(ds), HOME_WITH_FONTS), 'C5').status).toBe('pass');
  });
});

describe('C6 — storage duration', () => {
  it('fails without retention wording', () => {
    const html = `<html><body><p>Verantwortlicher: Muster GmbH. Rechtsgrundlage: Art. 6 DSGVO.
      Sie haben ein Recht auf Auskunft.</p></body></html>`;
    expect(byId(run(withDs(html)), 'C6').status).toBe('fail');
  });

  it('passes with "Speicherdauer" wording', () => {
    expect(byId(run(withDs(DATENSCHUTZ_OK)), 'C6').status).toBe('pass');
  });
});
