import * as Device from 'expo-device';
import { Directory, File, Paths } from 'expo-file-system';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { initLlama, type LlamaContext } from 'llama.rn';
import { Platform } from 'react-native';

import { BundledModel } from '../../modules/bundled-model';
import manifest from '../../model/manifest.json';
import { settingsStore } from '../state/settings';
import { createStore } from '../state/store';
import { isGgufHeader } from './gguf';
import { STOP_WORDS, type ChatMessage } from './prompts';

export type ModelSource = 'bundled' | 'imported';

export type AiStatus =
  | 'idle'
  | 'unpacking' // Android: copying the model out of the install-time asset pack
  | 'loading'
  | 'ready'
  | 'missing'
  | 'error';

export interface AiState {
  status: AiStatus;
  /** 0..1 for unpacking/loading. */
  progress: number;
  source: ModelSource | null;
  error: string | null;
  busy: boolean;
  lowMemory: boolean;
}

export const aiStore = createStore<AiState>({
  status: 'idle',
  progress: 0,
  source: null,
  error: null,
  busy: false,
  lowMemory: (Device.totalMemory ?? Number.POSITIVE_INFINITY) < 3.5e9,
});

export const CONTEXT_TOKENS = manifest.contextLength;
/** Leave room for the answer when budgeting the prompt. */
export const PROMPT_BUDGET_TOKENS = CONTEXT_TOKENS - 1024;

const modelsDir = new Directory(Paths.document, 'models');
const importedFile = new File(modelsDir, 'imported.gguf');
const unpackedFile = new File(modelsDir, manifest.fileName);
const ASSET_PATH = `models/${manifest.fileName}`;

let context: LlamaContext | null = null;
let starting: Promise<void> | null = null;

function ensureDir() {
  if (!modelsDir.exists) modelsDir.create({ intermediates: true, idempotent: true });
}

/** Finds a usable model file, unpacking the Android asset pack if needed. */
async function locateModel(): Promise<{ uri: string; source: ModelSource } | null> {
  if (importedFile.exists) return { uri: importedFile.uri, source: 'imported' };

  if (Platform.OS === 'ios') {
    const bundled = new File(Paths.bundle, manifest.fileName);
    return bundled.exists ? { uri: bundled.uri, source: 'bundled' } : null;
  }

  if (unpackedFile.exists && unpackedFile.size === manifest.sizeBytes) {
    return { uri: unpackedFile.uri, source: 'bundled' };
  }
  if (BundledModel?.hasAsset(ASSET_PATH)) {
    ensureDir();
    aiStore.set({ status: 'unpacking', progress: 0 });
    const sub = BundledModel.addListener('onCopyProgress', ({ bytes }) =>
      aiStore.set({ progress: Math.min(1, bytes / manifest.sizeBytes) }),
    );
    try {
      await BundledModel.copyAsset(ASSET_PATH, unpackedFile.uri);
    } finally {
      sub.remove();
    }
    return { uri: unpackedFile.uri, source: 'bundled' };
  }
  return null;
}

async function start(): Promise<void> {
  try {
    const found = await locateModel();
    if (!found) {
      aiStore.set({ status: 'missing', source: null, progress: 0 });
      return;
    }
    aiStore.set({ status: 'loading', progress: 0, source: found.source, error: null });
    context = await initLlama(
      {
        model: found.uri,
        n_ctx: CONTEXT_TOKENS,
        n_batch: 512,
        n_gpu_layers: settingsStore.get().gpu ? 99 : 0,
        use_mlock: false,
        use_mmap: true,
      },
      (p) => aiStore.set({ progress: p / 100 }),
    );
    aiStore.set({ status: 'ready', progress: 1 });
  } catch (e) {
    context = null;
    aiStore.set({ status: 'error', error: e instanceof Error ? e.message : String(e) });
  }
}

/** Idempotent: loads the model once; concurrent callers share the same promise. */
export function ensureModel(): Promise<void> {
  if (context) return Promise.resolve();
  if (!starting) starting = start().finally(() => (starting = null));
  return starting;
}

export async function reloadModel(): Promise<void> {
  if (starting) await starting;
  if (context) {
    await context.release();
    context = null;
  }
  aiStore.set({ status: 'idle', progress: 0 });
  await ensureModel();
}

export interface GenerateOptions {
  maxTokens?: number;
  temperature?: number;
}

/**
 * Streams a chat completion. `onText` receives the full text so far.
 * Resolves with the final text (also when stopped early).
 */
export async function generate(
  messages: ChatMessage[],
  onText: (text: string) => void,
  { maxTokens = 768, temperature = 0.6 }: GenerateOptions = {},
): Promise<string> {
  await ensureModel();
  const ctx = context;
  if (!ctx) throw new Error(aiStore.get().error ?? 'AI model not available');
  if (aiStore.get().busy) throw new Error('busy');
  aiStore.set({ busy: true });
  await activateKeepAwakeAsync('ai');
  let text = '';
  try {
    const result = await ctx.completion(
      {
        messages,
        jinja: true,
        n_predict: maxTokens,
        temperature,
        top_p: 0.9,
        top_k: 40,
        penalty_repeat: 1.1,
        stop: STOP_WORDS,
      },
      (data) => {
        text = data.accumulated_text ?? text + data.token;
        onText(text);
      },
    );
    return (result.content || result.text || text).trim();
  } finally {
    deactivateKeepAwake('ai');
    aiStore.set({ busy: false });
  }
}

export async function stopGeneration(): Promise<void> {
  await context?.stopCompletion();
}

export type ImportResult = 'ok' | 'canceled' | 'invalid';

/** Copies a user-selected .gguf file into private storage and loads it. */
export async function importModel(onCopying: () => void): Promise<ImportResult> {
  const picked = await File.pickFileAsync({ multipleFiles: false });
  if (picked.canceled) return 'canceled';
  onCopying();
  ensureDir();
  // Copy to a temporary name first: picked files may be content:// URIs that do not
  // support random access, and the current model must survive a bad import.
  const incoming = new File(modelsDir, 'incoming.gguf');
  if (incoming.exists) incoming.delete();
  await picked.result.copy(incoming);
  const handle = incoming.open();
  let header: Uint8Array;
  try {
    header = handle.readBytes(4);
  } finally {
    handle.close();
  }
  if (!isGgufHeader(header)) {
    incoming.delete();
    return 'invalid';
  }
  if (context && aiStore.get().source === 'imported') {
    await context.release();
    context = null;
  }
  if (importedFile.exists) importedFile.delete();
  await incoming.move(importedFile);
  await reloadModel();
  return 'ok';
}

export async function removeImportedModel(): Promise<void> {
  if (context && aiStore.get().source === 'imported') {
    await context.release();
    context = null;
  }
  if (importedFile.exists) importedFile.delete();
  aiStore.set({ status: 'idle', source: null });
  await ensureModel();
}

export function modelStorageBytes(): number {
  if (!modelsDir.exists) return 0;
  return modelsDir.list().reduce((sum, entry) => sum + (entry instanceof File ? (entry.size ?? 0) : 0), 0);
}

export { manifest as MODEL_MANIFEST };
