#!/usr/bin/env node
// Collects licence info for everything shipped in the binary into src/legal/licenses.json.
// Run after changing dependencies; the in-app "Licences" screen renders this file.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(root, 'model/manifest.json'), 'utf8'));

const entries = [];
for (const name of Object.keys(pkg.dependencies)) {
  const p = join(root, 'node_modules', name, 'package.json');
  if (!existsSync(p)) continue;
  const meta = JSON.parse(readFileSync(p, 'utf8'));
  const license = typeof meta.license === 'string' ? meta.license : meta.license?.type ?? 'unknown';
  entries.push({ name, version: meta.version, license, url: meta.homepage ?? meta.repository?.url ?? '' });
}

// Shipped but not npm packages.
entries.push(
  { name: manifest.displayName, version: manifest.id, license: manifest.license, url: 'https://huggingface.co/Qwen' },
  { name: 'llama.cpp (via llama.rn)', version: 'bundled', license: 'MIT', url: 'https://github.com/ggml-org/llama.cpp' },
  { name: 'Barlow Condensed (font)', version: '', license: 'OFL-1.1', url: 'https://github.com/jpt/barlow' },
  { name: 'Manrope (font)', version: '', license: 'OFL-1.1', url: 'https://github.com/sharanda/manrope' },
);

entries.sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(join(root, 'src/legal/licenses.json'), JSON.stringify(entries, null, 2) + '\n');
console.log(`${entries.length} entries written`);
