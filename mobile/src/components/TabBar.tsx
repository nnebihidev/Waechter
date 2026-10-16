import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '../ui/glass';
import { Icon, type IconName } from '../ui/icons';
import { font, radius, space, useTheme } from '../ui/theme';

const ICONS: Record<string, IconName> = {
  index: 'sparkle',
  translate: 'translate',
  guides: 'book',
  tools: 'compass',
  settings: 'sliders',
};

/** Floating frosted tab bar with a spring-driven pill under the active tab. */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const count = state.routes.length;
  const slot = width / Math.max(1, count);
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withSpring(state.index * slot, { damping: 18, stiffness: 180 });
  }, [state.index, slot, x]);

  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Glass radiusSize="xl" strong blur>
        <View style={styles.bar} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
          {slot > 0 ? (
            <Animated.View pointerEvents="none" style={[styles.pill, { width: slot - 8, backgroundColor: t.tabPill }, pill]} />
          ) : null}
          {state.routes.map((route, i) => {
            const focused = state.index === i;
            const { options } = descriptors[route.key] ?? {};
            const label = typeof options?.title === 'string' ? options.title : route.name;
            const color = focused ? t.primary : t.tabInactive;
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
                <Icon name={ICONS[route.name] ?? 'info'} size={24} color={color} strokeWidth={focused ? 2.1 : 1.7} />
                <Text numberOfLines={1} style={[focused ? font.extrabold : font.semibold, { color, fontSize: 10.5 }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: space.md, right: space.md, bottom: 0 },
  bar: { flexDirection: 'row', paddingHorizontal: 4, paddingVertical: 6, height: 66 },
  pill: { position: 'absolute', left: 8, top: 6, bottom: 6, borderRadius: radius.lg },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: radius.lg },
});
