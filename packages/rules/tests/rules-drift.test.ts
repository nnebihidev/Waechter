import { describe, expect, it } from 'vitest';
import { evaluateDrift, snapshotFromEvidence } from '../src/rules/drift';
import { byId, HOME_OK, IMPRESSUM_OK, site } from './helpers';

const GA = `<script src="https://www.googletagmanager.com/gtag/js?id=G-1"></script>`;

function snapshotOf(homepage: string, impressumHtml = IMPRESSUM_OK) {
  return snapshotFromEvidence(site(homepage, { legal: { impressum: { html: impressumHtml } } }));
}

describe('snapshotFromEvidence', () => {
  it('captures legal page hashes, homepage legal links and tracker families', () => {
    const snap = snapshotOf(HOME_OK);
    expect(snap.legalPageTextHashes.impressum).toMatch(/^[a-f0-9]{64}$/);
    expect(snap.legalLinksPresent).toContain('impressum');
    expect(snap.legalLinksPresent).toContain('datenschutz');
    expect(snap.trackerFamilies).toEqual([]);
  });
});

describe('G1 — legal page content changed', () => {
  it('passes when nothing changed', () => {
    const a = snapshotOf(HOME_OK);
    const b = snapshotOf(HOME_OK);
    expect(byId(evaluateDrift(a, b), 'G1').status).toBe('pass');
  });

  it('fails as info when the Impressum text changed', () => {
    const a = snapshotOf(HOME_OK);
    const b = snapshotOf(HOME_OK, IMPRESSUM_OK.replace('Max Mustermann', 'Erika Beispiel'));
    const r = byId(evaluateDrift(a, b), 'G1');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('info');
    expect(r.evidence[0]?.detail).toContain('Impressum');
  });
});

describe('G2 — legal link disappeared', () => {
  it('fails as blocker when the Datenschutz link vanished from the homepage', () => {
    const a = snapshotOf(HOME_OK);
    const homeWithoutDs = HOME_OK.replace('<a href="/datenschutz">Datenschutzerklärung</a>', '');
    const b = snapshotOf(homeWithoutDs);
    const r = byId(evaluateDrift(a, b), 'G2');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('blocker');
    expect(r.evidence[0]?.detail).toContain('Datenschutzerklärung');
  });

  it('does not fire for AGB links (only Impressum/Datenschutz)', () => {
    const homeWithAgb = HOME_OK.replace('</footer>', '<a href="/agb">AGB</a></footer>');
    const a = snapshotOf(homeWithAgb);
    const b = snapshotOf(HOME_OK);
    expect(byId(evaluateDrift(a, b), 'G2').status).toBe('pass');
  });
});

describe('G3 — new tracker appeared', () => {
  it('fails as warn when a tracker family is new', () => {
    const a = snapshotOf(HOME_OK);
    const b = snapshotOf(HOME_OK.replace('</footer>', `</footer>${GA}`));
    const r = byId(evaluateDrift(a, b), 'G3');
    expect(r.status).toBe('fail');
    expect(r.severity).toBe('warn');
    expect(r.evidence[0]?.detail).toContain('Google Analytics');
  });

  it('passes when the tracker set is unchanged', () => {
    const withGa = HOME_OK.replace('</footer>', `</footer>${GA}`);
    const a = snapshotOf(withGa);
    const b = snapshotOf(withGa);
    expect(byId(evaluateDrift(a, b), 'G3').status).toBe('pass');
  });
});
