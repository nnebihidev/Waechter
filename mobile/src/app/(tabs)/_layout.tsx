import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ColorValue } from 'react-native';

import { useT } from '../../state/settings';
import type { IconName } from '../../ui/components';
import { useTheme } from '../../ui/theme';

function icon(name: IconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  const t = useT();
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        sceneStyle: { backgroundColor: theme.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabAssistant, tabBarIcon: icon('chatbubbles') }} />
      <Tabs.Screen name="translate" options={{ title: t.tabTranslate, tabBarIcon: icon('language') }} />
      <Tabs.Screen name="guides" options={{ title: t.tabGuides, tabBarIcon: icon('medkit') }} />
      <Tabs.Screen name="tools" options={{ title: t.tabTools, tabBarIcon: icon('compass') }} />
      <Tabs.Screen name="settings" options={{ title: t.tabSettings, tabBarIcon: icon('settings') }} />
    </Tabs>
  );
}
