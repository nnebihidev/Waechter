import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '../../components/TabBar';
import { useT } from '../../state/settings';

export default function TabLayout() {
  const t = useT();
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t.tabHome }} />
      <Tabs.Screen name="guides" options={{ title: t.tabHelp }} />
      <Tabs.Screen name="translate" options={{ title: t.tabLanguage }} />
      <Tabs.Screen name="tools" options={{ title: t.tabNavigate }} />
      <Tabs.Screen name="settings" options={{ title: t.tabMore }} />
    </Tabs>
  );
}
