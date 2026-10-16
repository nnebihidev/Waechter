import { BarlowCondensed_600SemiBold, BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';
import { Manrope_500Medium, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
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
  const [loaded] = useFonts({ BarlowCondensed_600SemiBold, BarlowCondensed_700Bold, Manrope_500Medium, Manrope_700Bold });

  useEffect(() => {
    if (loaded) void SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded]);

  if (!loaded) return null;

  const base = t.scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = { ...base, colors: { ...base.colors, background: t.bg, card: t.bg, primary: t.signal, text: t.text, border: t.line } };

  return (
    <SafeAreaProvider>
      <StatusBar style={t.scheme === 'dark' ? 'light' : 'dark'} />
      <ThemeProvider value={navTheme}>
        <Stack screenOptions={{ contentStyle: { backgroundColor: t.bg }, headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="guide/[id]" options={{ animation: 'slide_from_right', animationDuration: 220 }} />
          <Stack.Screen name="signal" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
