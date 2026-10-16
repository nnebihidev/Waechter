import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

// The product promise is "never talks to the internet". These checks make the
// promise hard to break by accident.

const root = join(__dirname, '..');

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'node_modules' || name === 'build' ? [] : files(p);
    return /\.(ts|tsx|kt|swift)$/.test(name) ? [p] : [];
  });
}

const NETWORK_APIS = [
  /\bfetch\s*\(/,
  /XMLHttpRequest/,
  /new WebSocket/,
  /EventSource/,
  /downloadFileAsync|createDownloadTask|createUploadTask|\.upload\(/,
  /https?:\/\//,
  /java\.net\.(URL|HttpURLConnection|Socket)/,
  /okhttp/i,
  /URLSession/,
];

describe('offline guarantee', () => {
  const sources = [...files(join(root, 'src')), ...files(join(root, 'modules'))];

  it('scans a non-trivial number of files', () => {
    expect(sources.length).toBeGreaterThan(15);
  });

  it.each(NETWORK_APIS.map((re) => [re.source, re] as const))('no app code uses %s', (_name, re) => {
    const offenders = sources.filter((f) => re.test(readFileSync(f, 'utf8'))).map((f) => relative(root, f));
    expect(offenders).toEqual([]);
  });

  it('ships no analytics, crash-reporting, ads, push or OTA-update dependencies', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { dependencies: Record<string, string> };
    const banned = /analytics|sentry|bugsnag|firebase|amplitude|mixpanel|segment|admob|ads|expo-updates|expo-notifications|onesignal|appsflyer|purchases|iap|netinfo/i;
    expect(Object.keys(pkg.dependencies).filter((d) => banned.test(d))).toEqual([]);
  });

  it('release builds strip network permissions on Android', async () => {
    const prev = process.env.APP_VARIANT;
    process.env.APP_VARIANT = 'release';
    try {
      vi.resetModules();
      const mod = await import('../app.config');
      const config = mod.default({ config: {} } as never);
      expect(config.android?.blockedPermissions).toEqual(expect.arrayContaining(['android.permission.INTERNET']));
      expect(config.android?.permissions ?? []).not.toContain('android.permission.INTERNET');
      expect(config.ios?.infoPlist?.NSAppTransportSecurity).toEqual({ NSAllowsArbitraryLoads: false });
    } finally {
      process.env.APP_VARIANT = prev;
    }
  });
});
