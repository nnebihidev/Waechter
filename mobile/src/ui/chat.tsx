import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { Icon } from './icons';
import { parseMarkdown, type Inline } from './markdown';
import { Press } from './motion';
import { font, radius, type, useTheme } from './theme';

/** Haptics are a no-op on web and never throw. */
export const haptic = {
  tap: () => Haptics.selectionAsync().catch(() => undefined),
  send: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined),
  done: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined),
  warn: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined),
};

/**
 * ChatGPT-style reveal: the model delivers tokens in bursts; this shows the text
 * at a steady pace that speeds up when a backlog builds, so it never stutters.
 */
export function useSmoothText(target: string, active: boolean): string {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) {
      shownRef.current = target;
      setShown(target);
      return undefined;
    }
    let raf = 0;
    const step = () => {
      const cur = shownRef.current;
      if (!target.startsWith(cur)) {
        shownRef.current = target;
        setShown(target);
      } else if (cur.length < target.length) {
        const backlog = target.length - cur.length;
        const n = Math.max(1, Math.min(backlog, Math.round(backlog / 10)));
        shownRef.current = target.slice(0, cur.length + n);
        setShown(shownRef.current);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, reduced]);

  return shown;
}

function Inlines({ inlines, color, base }: { inlines: Inline[]; color: string; base: object }) {
  return (
    <Text style={[base, { color }]}>
      {inlines.map((i, k) => (
        <Text key={k} style={[i.bold && font.bodyStrong, i.italic && { fontStyle: 'italic' }]}>
          {i.text}
        </Text>
      ))}
    </Text>
  );
}

/** Renders the Markdown subset; tolerant of partial (streaming) input. */
export function Markdown({ text, color, trailing }: { text: string; color: string; trailing?: React.ReactNode }) {
  const t = useTheme();
  const blocks = parseMarkdown(text);
  return (
    <View style={{ gap: 8 }}>
      {blocks.map((b, i) => {
        const last = i === blocks.length - 1;
        if (b.type === 'heading') return <Inlines key={i} inlines={b.inlines} color={color} base={{ ...type.headline, marginTop: i ? 4 : 0 }} />;
        if (b.type === 'paragraph')
          return (
            <Text key={i} style={[type.body, { color }]}>
              {b.inlines.map((x, k) => (
                <Text key={k} style={[x.bold && font.bodyStrong, x.italic && { fontStyle: 'italic' }]}>
                  {x.text}
                </Text>
              ))}
              {last ? trailing : null}
            </Text>
          );
        return (
          <View key={i} style={{ gap: 6 }}>
            {b.items.map((item, k) => (
              <View key={k} style={styles.li}>
                <Text style={[type.body, font.bodyStrong, { color: b.type === 'numbered' ? t.signal : t.muted, width: b.type === 'numbered' ? 26 : 14 }]}>
                  {b.type === 'numbered' ? `${b.start + k}.` : '•'}
                </Text>
                <Text style={[type.body, { color, flex: 1 }]}>
                  {item.map((x, j) => (
                    <Text key={j} style={[x.bold && font.bodyStrong, x.italic && { fontStyle: 'italic' }]}>
                      {x.text}
                    </Text>
                  ))}
                  {last && k === b.items.length - 1 ? trailing : null}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

function Dot({ delay, color }: { delay: number; color: string }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(delay, withRepeat(withSequence(withTiming(-5, { duration: 260, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) }), withTiming(0, { duration: 300 })), -1, false));
  }, [y, delay]);
  const s = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[styles.dot, { backgroundColor: color }, s]} />;
}

/** Three bouncing dots while the first token is pending. */
export function TypingDots({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(120)} style={[styles.dots, style]}>
      <Dot delay={0} color={t.signal} />
      <Dot delay={150} color={t.signal} />
      <Dot delay={300} color={t.signal} />
    </Animated.View>
  );
}

/** Floating "jump to latest" control, shown when the user scrolled up. */
export function ScrollToBottom({ visible, onPress, label }: { visible: boolean; onPress: () => void; label: string }) {
  const t = useTheme();
  if (!visible) return null;
  return (
    <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(120)} style={styles.jumpWrap} pointerEvents="box-none">
      <Press accessibilityRole="button" accessibilityLabel={label} onPress={onPress} scaleTo={0.92} style={[styles.jump, { backgroundColor: t.surface, borderColor: t.line, shadowColor: '#000' }]}>
        <Icon name="arrowUp" size={18} color={t.signal} strokeWidth={2.2} />
      </Press>
    </Animated.View>
  );
}

export const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  li: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center', height: 22, paddingLeft: 2 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  jumpWrap: { position: 'absolute', right: 20, bottom: 100 },
  jump: { width: 40, height: 40, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '180deg' }], shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
});
