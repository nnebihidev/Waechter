import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '../ui/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const t = useTheme();
  const [loaded] = useFonts({ Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold });

  useEffect(() => {
    if (loaded) void SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded]);

  if (!loaded) return null;

  const base = t.scheme === 'dark' ? DarkTheme : DefaultTheme;
  const bg = t.gradient[0] ?? '#000000';
  const navTheme = { ...base, colors: { ...base.colors, background: bg, card: bg, primary: t.primary, text: t.text } };

  return (
    <SafeAreaProvider>
      <StatusBar style={t.scheme === 'dark' ? 'light' : 'dark'} />
      <ThemeProvider value={navTheme}>
        <Stack screenOptions={{ contentStyle: { backgroundColor: bg }, headerShown: false, animation: 'fade_from_bottom' }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="guide/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="signal" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
