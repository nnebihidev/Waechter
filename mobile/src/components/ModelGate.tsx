import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { aiStore, ensureModel, reloadModel } from '../ai/engine';
import { useT } from '../state/settings';
import { useStore } from '../state/store';
import { Body, BrandMark, Button, Card, IconBadge, ProgressBar, Reveal } from '../ui/components';
import { space, type, useTheme } from '../ui/theme';

/** Slowly rotating brand mark — the app's "thinking" indicator. */
function Spinner() {
  const reduced = useReducedMotion();
  const r = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    r.value = withRepeat(withTiming(360, { duration: 6000, easing: Easing.linear }), -1, false);
  }, [r, reduced]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  return (
    <Animated.View style={style}>
      <BrandMark size={64} />
    </Animated.View>
  );
}

/** Renders children once the on-device model is ready; otherwise explains why not. */
export function ModelGate({ children }: { children: ReactNode }) {
  const ai = useStore(aiStore);
  const t = useT();
  const theme = useTheme();

  useEffect(() => {
    void ensureModel();
  }, []);

  if (ai.status === 'ready') return <>{children}</>;

  const guidesButton = <Button label={t.tabGuides} icon="book" variant="glass" onPress={() => router.navigate('/guides')} />;

  return (
    <View style={styles.wrap}>
      <Reveal>
        <Card strong contentStyle={styles.card}>
          {ai.status === 'missing' ? (
            <>
              <IconBadge name="cloudOff" size={64} />
              <Text style={[type.title, styles.center, { color: theme.text }]}>{t.modelMissingTitle}</Text>
              <Body muted>{t.modelMissingBody}</Body>
              <Button label={t.openSettings} icon="sliders" onPress={() => router.navigate('/settings')} />
              {guidesButton}
            </>
          ) : ai.status === 'error' ? (
            <>
              <IconBadge name="warning" tone="dangerSoft" size={64} />
              <Text style={[type.title, styles.center, { color: theme.text }]}>{t.modelError}</Text>
              {ai.error ? <Body muted small>{ai.error}</Body> : null}
              <Button label={t.retry} icon="refresh" onPress={() => void reloadModel()} />
              {guidesButton}
            </>
          ) : (
            <>
              <Spinner />
              <Text style={[type.title, styles.center, { color: theme.text }]}>
                {ai.status === 'unpacking' ? t.modelUnpacking : t.modelLoading}
              </Text>
              {ai.progress > 0 ? (
                <>
                  <Text style={[type.title, type.mono, { color: theme.primary }]}>{Math.round(ai.progress * 100)} %</Text>
                  <View style={{ alignSelf: 'stretch' }}>
                    <ProgressBar value={ai.progress} />
                  </View>
                </>
              ) : null}
              {ai.lowMemory ? <Body muted small>{t.modelLowMemory}</Body> : null}
              <Body muted small>{t.loadingHint}</Body>
              {guidesButton}
            </>
          )}
        </Card>
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: space.lg, justifyContent: 'center' },
  card: { alignItems: 'center', paddingVertical: space.lg, gap: space.lg },
  center: { textAlign: 'center' },
});
