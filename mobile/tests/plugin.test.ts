import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { addAssetPack } = require('../plugins/withOfflineModel.js') as { addAssetPack: (g: string) => string };

describe('withOfflineModel', () => {
  const gradle = 'apply plugin: "com.android.application"\n\nandroid {\n    ndkVersion rootProject.ext.ndkVersion\n}\n';

  it('registers the install-time asset pack once', () => {
    const once = addAssetPack(gradle);
    expect(once).toContain('assetPacks = [":kompass_model"]');
    expect(once).toContain('noCompress += ["gguf"]');
    expect(addAssetPack(once)).toBe(once);
  });
});
