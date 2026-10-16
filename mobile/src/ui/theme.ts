import { useColorScheme, type TextStyle } from 'react-native';

// "Expedition": instrument-panel look. Near-black surfaces, warm off-white text and
// one signal colour (orange) that is both brand and emergency. The light variant
// ("Tag") keeps the same structure on warm grey for use in direct sunlight.

type Scheme = 'light' | 'dark';

const dark = {
  scheme: 'dark' as Scheme,
  bg: '#0A0C0E',
  surface: '#121518',
  surface2: '#181C20',
  line: '#242A30',
  lineSoft: '#1A1F24',
  text: '#F3F1EA',
  muted: '#8B939B',
  dim: '#5A626A',
  signal: '#FF6B1A',
  signalSoft: 'rgba(255,107,26,0.14)',
  onSignal: '#0A0C0E',
  topo: '#1C2126',
  dialInner: '#1A1F24',
  dialOuter: '#0A0C0E',
  needleTail: '#2A3137',
  tickMajor: '#C9CDD1',
  tickMid: '#6E767E',
  tickMinor: '#3A4149',
  selection: 'rgba(255,107,26,0.35)',
};

const light: typeof dark = {
  scheme: 'light' as Scheme,
  bg: '#F1EFE9',
  surface: '#FFFFFF',
  surface2: '#F7F5F0',
  line: '#D9D5CC',
  lineSoft: '#E6E2D9',
  text: '#121416',
  muted: '#5D636A',
  dim: '#8E949B',
  signal: '#E85A0A',
  signalSoft: 'rgba(232,90,10,0.12)',
  onSignal: '#FFFFFF',
  topo: '#E2DED5',
  dialInner: '#FFFFFF',
  dialOuter: '#ECE9E2',
  needleTail: '#B9BEC4',
  tickMajor: '#2B3035',
  tickMid: '#80878E',
  tickMinor: '#C4C8CC',
  selection: 'rgba(232,90,10,0.3)',
};

export type Theme = typeof dark;

export function useTheme(): Theme {
  return useColorScheme() === 'light' ? light : dark;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;
export const radius = { sm: 4, md: 6, pill: 999 } as const;

/** Display: Barlow Condensed. Body: Manrope. Both bundled (OFL). */
export const font = {
  display: { fontFamily: 'BarlowCondensed_700Bold' },
  displayMedium: { fontFamily: 'BarlowCondensed_600SemiBold' },
  label: { fontFamily: 'BarlowCondensed_600SemiBold' },
  body: { fontFamily: 'Manrope_500Medium' },
  bodyStrong: { fontFamily: 'Manrope_700Bold' },
} as const;

export const type: Record<
  'hero' | 'display' | 'title' | 'number' | 'numberSmall' | 'headline' | 'body' | 'callout' | 'footnote' | 'label' | 'labelSmall' | 'tab',
  TextStyle
> = {
  hero: { ...font.display, fontSize: 72, lineHeight: 66, textTransform: 'uppercase', letterSpacing: -0.5 },
  display: { ...font.display, fontSize: 52, lineHeight: 48, textTransform: 'uppercase', letterSpacing: -0.5 },
  title: { ...font.display, fontSize: 26, lineHeight: 28, textTransform: 'uppercase', letterSpacing: 0.2 },
  number: { ...font.display, fontSize: 104, lineHeight: 96, letterSpacing: -2, fontVariant: ['tabular-nums'] },
  numberSmall: { ...font.displayMedium, fontSize: 30, lineHeight: 32, letterSpacing: -0.3, fontVariant: ['tabular-nums'] },
  headline: { ...font.bodyStrong, fontSize: 16, lineHeight: 22 },
  body: { ...font.body, fontSize: 15, lineHeight: 23 },
  callout: { ...font.body, fontSize: 14, lineHeight: 21 },
  footnote: { ...font.body, fontSize: 12.5, lineHeight: 18 },
  label: { ...font.label, fontSize: 12, lineHeight: 14, letterSpacing: 2, textTransform: 'uppercase' },
  labelSmall: { ...font.label, fontSize: 10.5, lineHeight: 12, letterSpacing: 1.8, textTransform: 'uppercase' },
  tab: { ...font.label, fontSize: 10, lineHeight: 12, letterSpacing: 1.4, textTransform: 'uppercase' },
};

export const TAB_BAR_HEIGHT = 64;
