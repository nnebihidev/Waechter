import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '../../components/TabBar';
import { useT } from '../../state/settings';

export default function TabLayout() {
  const t = useT();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabAssistant }} />
      <Tabs.Screen name="translate" options={{ title: t.tabTranslate }} />
      <Tabs.Screen name="guides" options={{ title: t.tabGuidesShort }} />
      <Tabs.Screen name="tools" options={{ title: t.tabTools }} />
      <Tabs.Screen name="settings" options={{ title: t.tabSettingsShort }} />
    </Tabs>
  );
}
