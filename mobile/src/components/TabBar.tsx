import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '../ui/icons';
import { TAB_BAR_HEIGHT, type, useTheme } from '../ui/theme';

const ICONS: Record<string, IconName> = {
  index: 'sparkle',
  guides: 'book',
  translate: 'translate',
  tools: 'compass',
  settings: 'sliders',
};

/** Flat instrument tab bar: hairline on top, a glowing signal marker slides to the active tab. */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const count = state.routes.length;
  const slot = width / Math.max(1, count);
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withSpring(state.index * slot + slot / 2 - 14, { damping: 20, stiffness: 260 });
  }, [state.index, slot, x]);

  const marker = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={[styles.bar, { backgroundColor: t.bg, borderTopColor: t.line, paddingBottom: insets.bottom }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {slot > 0 ? <Animated.View pointerEvents="none" style={[styles.marker, { backgroundColor: t.signal, shadowColor: t.signal }, marker]} /> : null}
      <View style={styles.tabs}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const { options } = descriptors[route.key] ?? {};
          const label = typeof options?.title === 'string' ? options.title : route.name;
          const color = focused ? t.signal : t.dim;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={styles.tab}
            >
              <Icon name={ICONS[route.name] ?? 'info'} size={24} color={color} strokeWidth={focused ? 2 : 1.6} />
              <Text numberOfLines={1} style={[type.tab, { color }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { borderTopWidth: StyleSheet.hairlineWidth },
  marker: { position: 'absolute', top: -1, width: 28, height: 2, shadowOpacity: 0.9, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  tabs: { flexDirection: 'row', height: TAB_BAR_HEIGHT, paddingTop: 10, paddingHorizontal: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 6 },
});
