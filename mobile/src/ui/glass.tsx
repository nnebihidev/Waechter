import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View, useWindowDimensions, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
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

import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { radius, useTheme, type Blob } from './theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Soft aurora blob: a real radial gradient that drifts slowly. */
function AuroraBlob({ blob, index }: { blob: Blob; index: number }) {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const drift = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    drift.value = withRepeat(
      withTiming(1, { duration: 14000 + index * 3000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [drift, index, reduced]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * (index % 2 === 0 ? 28 : -22) },
      { translateY: drift.value * (index % 2 === 0 ? -18 : 24) },
      { scale: 1 + drift.value * 0.08 },
    ],
  }));

  const id = `blob${index}`;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.blob,
        { left: blob.x * width - blob.size / 2, top: blob.y * height - blob.size / 2, width: blob.size, height: blob.size },
        style,
      ]}
    >
      <Svg width={blob.size} height={blob.size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={blob.color} stopOpacity={blob.opacity} />
            <Stop offset="0.55" stopColor={blob.color} stopOpacity={blob.opacity * 0.45} />
            <Stop offset="1" stopColor={blob.color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={50} cy={50} r={50} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

/** Full-screen gradient with slowly drifting colour blobs. Put it behind every screen. */
export function Backdrop() {
  const t = useTheme();
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={t.gradient as [string, string, ...string[]]} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />
      {t.blobs.map((b, i) => (
        <AuroraBlob key={i} blob={b} index={i} />
      ))}
    </View>
  );
}

/** Opaque screen root with its own aurora backdrop. Every route uses it, so
 *  navigator transitions and inactive scenes never bleed through. */
export function Screen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={[{ flex: 1, backgroundColor: t.gradient[0] }, style]}>
      <Backdrop />
      {children}
    </View>
  );
}

export interface GlassProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Stronger fill for surfaces that must stay readable over busy content. */
  strong?: boolean;
  /** Blur the content behind the panel. Off by default on Android (expensive in lists). */
  blur?: boolean;
  radiusSize?: keyof typeof radius;
  padded?: boolean;
}

/** Frosted panel: blur + translucent fill + hairline light edge + soft shadow. */
export function Glass({ children, style, strong, blur, radiusSize = 'md', padded }: GlassProps) {
  const t = useTheme();
  const useBlur = blur ?? Platform.OS !== 'android';
  const r = radius[radiusSize];
  return (
    <View style={[styles.shadow, { shadowColor: t.glassShadow, borderRadius: r }, style]}>
      <View style={[styles.clip, { borderRadius: r, borderColor: t.glassBorder }]}>
        {useBlur ? (
          <BlurView
            tint={t.glassTint}
            intensity={t.blur}
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: strong ? t.glassStrong : t.glass }]} />
        <LinearGradient
          pointerEvents="none"
          colors={[t.glassHighlight, 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0.5 }}
          style={[StyleSheet.absoluteFill, { opacity: t.scheme === 'dark' ? 0.35 : 0.55 }]}
        />
        <View style={padded ? styles.padded : undefined}>{children}</View>
      </View>
    </View>
  );
}

/** Pressable with a spring scale and dim on press. */
export function Press({ children, style, scaleTo = 0.97, ...rest }: PressableProps & { scaleTo?: number; style?: StyleProp<ViewStyle> }) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, { damping: 18, stiffness: 320 });
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 14, stiffness: 260 });
        rest.onPressOut?.(e);
      }}
      style={[animated, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

/** Slides content up and fades it in; stagger with `index`. */
export function Reveal({ children, index = 0, style }: { children: ReactNode; index?: number; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View entering={reduced ? undefined : FadeInDown.delay(60 + index * 55).duration(420).springify().damping(18)} style={style}>
      {children}
    </Animated.View>
  );
}

/** Expanding ring behind an element, e.g. the SOS button. */
export function Pulse({ color, size, children }: { color: string; size: number; children: ReactNode }) {
  const reduced = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    p.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1, false);
  }, [p, reduced]);
  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + p.value * 0.55 }],
    opacity: 0.45 * (1 - p.value),
  }));
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color }, ring]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute' },
  shadow: {
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  clip: { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  padded: { padding: 18 },
});
