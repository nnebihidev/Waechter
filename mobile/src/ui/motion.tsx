import { useEffect, type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Pressable with a quick, hard scale — instrument buttons, not bubbles. */
export function Press({ children, style, scaleTo = 0.97, ...rest }: PressableProps & { scaleTo?: number; style?: StyleProp<ViewStyle> }) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withTiming(scaleTo, { duration: 70 });
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 16, stiffness: 400 });
        rest.onPressOut?.(e);
      }}
      style={[animated, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

/** Short upward slide-in; stagger with `index`. Fast, no bounce. */
export function Reveal({ children, index = 0, style }: { children: ReactNode; index?: number; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View entering={reduced ? undefined : FadeInDown.delay(40 + index * 45).duration(260).easing(Easing.out(Easing.cubic))} style={style}>
      {children}
    </Animated.View>
  );
}

/** Pulsing glow (opacity) — the SOS slab breathes. */
export function Breathe({ children, style, min = 0.75 }: { children: ReactNode; style?: StyleProp<ViewStyle>; min?: number }) {
  const reduced = useReducedMotion();
  const o = useSharedValue(1);
  useEffect(() => {
    if (reduced) return;
    o.value = withRepeat(withTiming(min, { duration: 1100, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [o, reduced, min]);
  const s = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[s, style]}>{children}</Animated.View>;
}

/** Blinking block cursor, used while an answer streams. */
export function Caret({ color }: { color: string }) {
  const o = useSharedValue(1);
  useEffect(() => {
    o.value = withRepeat(withTiming(0, { duration: 420, easing: Easing.steps(1) }), -1, true);
  }, [o]);
  const s = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width: 9, height: 16, backgroundColor: color, marginLeft: 3, transform: [{ translateY: 3 }] }, s]} />;
}
