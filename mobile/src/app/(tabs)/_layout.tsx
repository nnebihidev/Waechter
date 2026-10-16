import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

import { useT } from '../../state/settings';
import type { IconName } from '../../ui/components';
import { useTheme } from '../../ui/theme';

function icon(active: IconName, inactive: IconName) {
  return ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
    <Ionicons name={focused ? active : inactive} size={size} color={color} />
  );
}

export default function TabLayout() {
  const t = useT();
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.faint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        sceneStyle: { backgroundColor: theme.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabAssistant, tabBarIcon: icon('sparkles', 'sparkles-outline') }} />
      <Tabs.Screen name="translate" options={{ title: t.tabTranslate, tabBarIcon: icon('language', 'language-outline') }} />
      <Tabs.Screen name="guides" options={{ title: t.tabGuidesShort, tabBarIcon: icon('book', 'book-outline') }} />
      <Tabs.Screen name="tools" options={{ title: t.tabTools, tabBarIcon: icon('compass', 'compass-outline') }} />
      <Tabs.Screen name="settings" options={{ title: t.tabSettingsShort, tabBarIcon: icon('settings', 'settings-outline') }} />
    </Tabs>
  );
}
