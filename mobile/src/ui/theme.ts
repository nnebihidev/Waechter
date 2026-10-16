import { useColorScheme, type TextStyle } from 'react-native';

// Two moods: "Morgennebel" (light) and "Nachtwald" (dark). Glass only reads when it
// floats over colour, so every screen gets a soft aurora backdrop (see glass.tsx).

export interface Blob {
  color: string;
  opacity: number;
  size: number;
  /** Position as a fraction of the screen (0..1). */
  x: number;
  y: number;
}

type Scheme = 'light' | 'dark';

const light = {
  scheme: 'light' as Scheme,
  gradient: ['#EEF3EC', '#E4EDE6', '#F4EFE4'],
  blobs: [
    { color: '#5CCB96', opacity: 0.55, size: 520, x: 0.85, y: 0.02 },
    { color: '#F2BE5E', opacity: 0.42, size: 420, x: 0.0, y: 0.45 },
    { color: '#7CCFCB', opacity: 0.42, size: 460, x: 0.92, y: 0.88 },
  ] as Blob[],
  text: '#0F1F17',
  muted: '#53645B',
  faint: '#8A9A91',
  primary: '#167A53',
  primaryStrong: '#0E5C3D',
  onPrimary: '#FFFFFF',
  accent: '#1DB87A',
  amber: '#E6A232',
  danger: '#D2362A',
  dangerFill: '#D93B2E',
  onDanger: '#FFFFFF',
  dangerSoft: 'rgba(217,59,46,0.12)',
  dangerBorder: 'rgba(217,59,46,0.35)',
  glass: 'rgba(255,255,255,0.55)',
  glassStrong: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.75)',
  glassHighlight: 'rgba(255,255,255,0.95)',
  glassShadow: 'rgba(15,31,23,0.16)',
  glassTint: 'light' as 'light' | 'dark',
  blur: 38,
  divider: 'rgba(15,31,23,0.08)',
  userBubble: 'rgba(22,122,83,0.14)',
  inputFill: 'rgba(255,255,255,0.6)',
  tabInactive: '#60716A',
  tabPill: 'rgba(22,122,83,0.14)',
  solidCard: '#FFFFFF',
};

const dark: typeof light = {
  scheme: 'dark' as Scheme,
  gradient: ['#06100B', '#0A1A12', '#0E1713'],
  blobs: [
    { color: '#22C486', opacity: 0.5, size: 560, x: 0.85, y: 0.0 },
    { color: '#1E9AB0', opacity: 0.38, size: 460, x: 0.0, y: 0.45 },
    { color: '#E0A040', opacity: 0.26, size: 420, x: 0.92, y: 0.9 },
  ],
  text: '#EAF2EC',
  muted: '#A2B5A9',
  faint: '#6E8076',
  primary: '#4FE3A3',
  primaryStrong: '#7BEDBC',
  onPrimary: '#06110B',
  accent: '#4FE3A3',
  amber: '#F2B950',
  danger: '#FF6F60',
  dangerFill: '#D43C31',
  onDanger: '#FFFFFF',
  dangerSoft: 'rgba(255,111,96,0.14)',
  dangerBorder: 'rgba(255,111,96,0.4)',
  glass: 'rgba(255,255,255,0.07)',
  glassStrong: 'rgba(255,255,255,0.11)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassHighlight: 'rgba(255,255,255,0.28)',
  glassShadow: 'rgba(0,0,0,0.5)',
  glassTint: 'dark',
  blur: 50,
  divider: 'rgba(255,255,255,0.08)',
  userBubble: 'rgba(79,227,163,0.16)',
  inputFill: 'rgba(255,255,255,0.06)',
  tabInactive: '#8EA094',
  tabPill: 'rgba(79,227,163,0.18)',
  solidCard: '#14211A',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 12, md: 18, lg: 24, xl: 30, pill: 999 } as const;

/** Manrope is bundled with the app (OFL); each weight is its own family on native. */
export const font = {
  medium: { fontFamily: 'Manrope_500Medium' },
  semibold: { fontFamily: 'Manrope_600SemiBold' },
  bold: { fontFamily: 'Manrope_700Bold' },
  extrabold: { fontFamily: 'Manrope_800ExtraBold' },
} as const;

export const type: {
  display: TextStyle;
  title: TextStyle;
  headline: TextStyle;
  body: TextStyle;
  callout: TextStyle;
  footnote: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
  mono: TextStyle;
} = {
  display: { ...font.extrabold, fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  title: { ...font.extrabold, fontSize: 26, lineHeight: 32, letterSpacing: -0.5 },
  headline: { ...font.bold, fontSize: 17, lineHeight: 22 },
  body: { ...font.medium, fontSize: 16, lineHeight: 24 },
  callout: { ...font.medium, fontSize: 15, lineHeight: 21 },
  footnote: { ...font.medium, fontSize: 13, lineHeight: 18 },
  caption: { ...font.semibold, fontSize: 12, lineHeight: 16 },
  overline: { ...font.extrabold, fontSize: 12, lineHeight: 16, letterSpacing: 1.4, textTransform: 'uppercase' },
  mono: { ...font.bold, fontVariant: ['tabular-nums'] },
};

/** Floating tab bar height incl. its bottom margin — screens pad their content by this. */
export const TAB_BAR_SPACE = 96;
