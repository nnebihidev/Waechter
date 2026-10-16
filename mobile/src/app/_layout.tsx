import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '../ui/theme';

export default function RootLayout() {
  const t = useTheme();
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ contentStyle: { backgroundColor: t.bg } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="guide/[id]"
          options={{
            title: '',
            headerStyle: { backgroundColor: t.primary },
            headerTintColor: t.onPrimary,
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen name="signal" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
