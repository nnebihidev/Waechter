import { useColorScheme } from 'react-native';

// Design tokens. Forest green carries the brand; red is reserved for emergencies.
const light = {
  bg: '#F6F5EF',
  card: '#FFFFFF',
  cardAlt: '#FBFAF6',
  text: '#14231B',
  muted: '#5E6C64',
  faint: '#8C9891',
  border: '#E3E3DA',
  divider: '#ECECE4',
  primary: '#1F4D36',
  primaryStrong: '#173B29',
  onPrimary: '#FFFFFF',
  accent: '#2E7D4F',
  primarySoft: '#E7EFE8',
  primarySofter: '#F1F6F1',
  danger: '#C62828',
  dangerStrong: '#B71C1C',
  /** Red used as a filled surface (buttons, emergency cards); always paired with onDanger. */
  dangerFill: '#C62828',
  onDanger: '#FFFFFF',
  dangerSoft: '#FDECEA',
  dangerBorder: '#F2B8B5',
  userBubble: '#DCEBDD',
  onUserBubble: '#14231B',
  shadow: '#1F2A22',
};

const dark: typeof light = {
  bg: '#0E1712',
  card: '#16231B',
  cardAlt: '#132019',
  text: '#E9F0EB',
  muted: '#A2B2A8',
  faint: '#77877D',
  border: '#26372D',
  divider: '#21302A',
  primary: '#6FCB98',
  primaryStrong: '#8AD8AC',
  onPrimary: '#0E1712',
  accent: '#6FCB98',
  primarySoft: '#1E3428',
  primarySofter: '#182A20',
  danger: '#FF6B5E',
  dangerStrong: '#FF8A80',
  dangerFill: '#C9372C',
  onDanger: '#FFFFFF',
  dangerSoft: '#3A1714',
  dangerBorder: '#6B2A24',
  userBubble: '#24442F',
  onUserBubble: '#E9F0EB',
  shadow: '#000000',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 10, md: 14, lg: 18, pill: 999 } as const;

export const type = {
  largeTitle: { fontSize: 34, fontWeight: '800', letterSpacing: -0.6 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3 },
  headline: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 23 },
  callout: { fontSize: 15, lineHeight: 21 },
  footnote: { fontSize: 13, lineHeight: 18 },
  overline: { fontSize: 13, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
} as const;
