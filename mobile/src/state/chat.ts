import { createStore } from './store';

export interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Guide ids the answer was grounded on. */
  sources?: string[];
  emergency?: boolean;
  streaming?: boolean;
  failed?: boolean;
}

/** Kept in memory only — conversations are never written to disk. */
export const chatStore = createStore<{ entries: ChatEntry[]; draft: string }>({ entries: [], draft: '' });

let seq = 0;
export const nextId = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

export function updateEntry(id: string, patch: Partial<ChatEntry>) {
  chatStore.set((s) => ({ ...s, entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
}
