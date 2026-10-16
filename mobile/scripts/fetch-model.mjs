#!/usr/bin/env node
// Build-time only: downloads the model weights pinned in model/manifest.json into
// model/files/ and verifies the SHA-256. The app itself never downloads anything —
// the weights are packaged into the binary by plugins/withOfflineModel.js.
import { createHash } from 'node:crypto';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'model/manifest.json'), 'utf8'));
const target = join(root, 'model/files', manifest.fileName);

async function sha256(path) {
  const hash = createHash('sha256');
  await pipeline(createReadStream(path), hash);
  return hash.digest('hex');
}

async function verify(path) {
  if (statSync(path).size !== manifest.sizeBytes) return false;
  return (await sha256(path)) === manifest.sha256;
}

mkdirSync(dirname(target), { recursive: true });

if (existsSync(target)) {
  process.stdout.write(`Verifying existing ${manifest.fileName} … `);
  if (await verify(target)) {
    console.log('ok');
    process.exit(0);
  }
  console.log('mismatch, re-downloading');
  unlinkSync(target);
}

console.log(`Downloading ${manifest.displayName} (${(manifest.sizeBytes / 1e9).toFixed(2)} GB)`);
const res = await fetch(manifest.source, { redirect: 'follow' });
if (!res.ok || !res.body) {
  console.error(`Download failed: HTTP ${res.status}`);
  process.exit(1);
}

const partial = `${target}.part`;
let received = 0;
let lastLog = 0;
const body = Readable.fromWeb(res.body);
body.on('data', (chunk) => {
  received += chunk.length;
  const now = Date.now();
  if (now - lastLog > 2000) {
    lastLog = now;
    process.stdout.write(`\r  ${((received / manifest.sizeBytes) * 100).toFixed(1)} %`);
  }
});
await pipeline(body, createWriteStream(partial));
process.stdout.write('\n');

if (!(await verify(partial))) {
  unlinkSync(partial);
  console.error('Checksum mismatch — refusing to use this file.');
  process.exit(1);
}
renameSync(partial, target);
console.log(`Saved and verified: ${target}`);
