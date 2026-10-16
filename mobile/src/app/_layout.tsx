import { BarlowCondensed_600SemiBold, BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';
import { Manrope_500Medium, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TERMS_VERSION } from '../legal/texts';
import { useSettings } from '../state/settings';
import { useTheme } from '../ui/theme';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const t = useTheme();
  const { acceptedTerms } = useSettings();
  const accepted = acceptedTerms !== null && acceptedTerms.version >= TERMS_VERSION;
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
      <KeyboardProvider>
      <ThemeProvider value={navTheme}>
        <Stack screenOptions={{ contentStyle: { backgroundColor: t.bg }, headerShown: false, animation: 'fade' }}>
          <Stack.Protected guard={!accepted}>
            <Stack.Screen name="welcome" />
          </Stack.Protected>
          <Stack.Protected guard={accepted}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="guide/[id]" options={{ animation: 'slide_from_right', animationDuration: 220 }} />
            <Stack.Screen name="signal" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
          </Stack.Protected>
          <Stack.Screen name="legal" options={{ animation: 'slide_from_bottom' }} />
        </Stack>
      </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
