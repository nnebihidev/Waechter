import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { aiStore, ensureModel, reloadModel, type AiState } from '../ai/engine';
import { useT } from '../state/settings';
import { useStore } from '../state/store';
import { Body, Display, IconFrame, Reveal, Slab } from '../ui/kit';
import { space, type, useTheme } from '../ui/theme';

/** Thin signal-coloured progress rule. */
export function ProgressRule({ value }: { value: number }) {
  const t = useTheme();
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withSpring(Math.max(0, Math.min(1, value)), { damping: 20, stiffness: 120 });
  }, [value, w]);
  const fill = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }} style={[styles.track, { backgroundColor: t.line }]}>
      <Animated.View style={[styles.fill, { backgroundColor: t.signal, shadowColor: t.signal }, fill]} />
    </View>
  );
}

/** Status line for the instrument strip. */
export function aiStatusLabel(ai: AiState, s: ReturnType<typeof useT>): string {
  if (ai.status === 'ready') return s.statusOffline;
  if (ai.status === 'missing' || ai.status === 'error') return s.statusMissing;
  return s.statusLoading;
}

/** Renders children once the on-device model is ready; otherwise explains why not. */
export function ModelGate({ children }: { children: ReactNode }) {
  const ai = useStore(aiStore);
  const s = useT();
  const t = useTheme();

  useEffect(() => {
    void ensureModel();
  }, []);

  if (ai.status === 'ready') return <>{children}</>;

  return (
    <View style={styles.wrap}>
      <Reveal>
        {ai.status === 'missing' ? (
          <View style={styles.block}>
            <IconFrame name="cloudOff" size={52} />
            <Display style={{ marginTop: space.lg }}>{s.modelMissingTitle}</Display>
            <Body muted style={{ marginTop: space.sm }}>
              {s.modelMissingBody}
            </Body>
            <Slab label={s.openSettings} icon="sliders" onPress={() => router.navigate('/settings')} style={{ marginTop: space.xl }} />
            <Slab label={s.tabGuides} icon="book" variant="neutral" compact onPress={() => router.navigate('/guides')} style={{ marginTop: space.sm }} />
          </View>
        ) : ai.status === 'error' ? (
          <View style={styles.block}>
            <IconFrame name="warning" size={52} signal />
            <Display style={{ marginTop: space.lg }}>{s.modelError}</Display>
            {ai.error ? (
              <Body muted small style={{ marginTop: space.sm }}>
                {ai.error}
              </Body>
            ) : null}
            <Slab label={s.retry} icon="refresh" onPress={() => void reloadModel()} style={{ marginTop: space.xl }} />
          </View>
        ) : (
          <View style={styles.block}>
            <Text style={[type.label, { color: t.signal }]}>{ai.status === 'unpacking' ? s.modelUnpacking : s.modelLoading}</Text>
            <Text style={[type.number, { color: t.text, marginTop: space.md }]}>{Math.round(ai.progress * 100)}%</Text>
            <ProgressRule value={ai.progress} />
            <Body muted small style={{ marginTop: space.md }}>
              {s.loadingHint}
              {ai.lowMemory ? ` ${s.modelLowMemory}` : ''}
            </Body>
          </View>
        )}
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: space.xl, justifyContent: 'center' },
  block: { paddingVertical: space.xl },
  track: { height: 2, marginTop: space.md, overflow: 'visible' },
  fill: { height: 2, shadowOpacity: 0.9, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
});
