import { useColorScheme } from 'react-native';

const light = {
  bg: '#F4F6F2',
  card: '#FFFFFF',
  text: '#13201A',
  muted: '#5B6B62',
  border: '#D9E0DA',
  primary: '#1F6B4A',
  onPrimary: '#FFFFFF',
  danger: '#B3261E',
  onDanger: '#FFFFFF',
  dangerSoft: '#FCE8E6',
  userBubble: '#1F6B4A',
  onUserBubble: '#FFFFFF',
  botBubble: '#FFFFFF',
};

const dark: typeof light = {
  bg: '#0F1A14',
  card: '#18261E',
  text: '#E8EFEA',
  muted: '#9FB0A6',
  border: '#2A3B31',
  primary: '#5CC08F',
  onPrimary: '#0F1A14',
  danger: '#FF6B5E',
  onDanger: '#1A0503',
  dangerSoft: '#3A1714',
  userBubble: '#2F7D59',
  onUserBubble: '#FFFFFF',
  botBubble: '#18261E',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 8, md: 12, lg: 18 } as const;
