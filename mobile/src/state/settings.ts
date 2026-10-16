import { File, Paths } from 'expo-file-system';
import { getLocales } from 'expo-localization';
import { Platform } from 'react-native';

import { resolveLang, type Lang } from '../i18n/lang';
import { STRINGS, type Strings } from '../i18n/strings';
import { LEGAL, type LegalTexts } from '../legal/texts';
import { createStore, useStore } from './store';

export interface Settings {
  language: Lang | 'auto';
  gpu: boolean;
  /** Consent given on first launch: terms version, ISO timestamp, ticked declaration ids, app version. */
  acceptedTerms: { version: number; at: string; checks: string[]; appVersion: string } | null;
}

const DEFAULTS: Settings = {
  language: 'auto',
  acceptedTerms: null,
  // Metal is reliable on every supported iPhone; Android GPU (OpenCL) support varies.
  gpu: Platform.OS === 'ios',
};

const file = new File(Paths.document, 'settings.json');

function load(): Settings {
  try {
    if (file.exists) return { ...DEFAULTS, ...(JSON.parse(file.textSync()) as Partial<Settings>) };
  } catch {
    // Corrupt settings are not worth crashing for; fall back to defaults.
  }
  return DEFAULTS;
}

export const settingsStore = createStore<Settings>(load());

export function updateSettings(patch: Partial<Settings>) {
  settingsStore.set(patch);
  try {
    file.write(JSON.stringify(settingsStore.get()));
  } catch {
    // Non-fatal: the setting still applies for this session.
  }
}

export function useSettings(): Settings {
  return useStore(settingsStore);
}

export function useLang(): Lang {
  const { language } = useSettings();
  return resolveLang(language, getLocales()[0]?.languageCode);
}

export function useT(): Strings {
  return STRINGS[useLang()];
}

export function useLegal(): LegalTexts {
  return LEGAL[useLang()];
}
