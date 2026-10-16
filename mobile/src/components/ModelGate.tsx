import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { aiStore, ensureModel, reloadModel } from '../ai/engine';
import { useT } from '../state/settings';
import { useStore } from '../state/store';
import { Body, Button, Card, IconCircle, ProgressBar } from '../ui/components';
import { space, type, useTheme } from '../ui/theme';

/** Renders children once the on-device model is ready; otherwise explains why not. */
export function ModelGate({ children }: { children: ReactNode }) {
  const ai = useStore(aiStore);
  const t = useT();
  const theme = useTheme();

  useEffect(() => {
    void ensureModel();
  }, []);

  if (ai.status === 'ready') return <>{children}</>;

  const guidesButton = (
    <Button label={t.tabGuides} icon="book-outline" variant="outline" onPress={() => router.navigate('/guides')} />
  );

  return (
    <View style={styles.wrap}>
      <Card style={styles.card}>
        {ai.status === 'missing' ? (
          <>
            <IconCircle name="cloud-offline-outline" size={56} />
            <Text style={[type.title, styles.center, { color: theme.text }]}>{t.modelMissingTitle}</Text>
            <Body muted>{t.modelMissingBody}</Body>
            <Button label={t.openSettings} icon="settings-outline" onPress={() => router.navigate('/settings')} />
            {guidesButton}
          </>
        ) : ai.status === 'error' ? (
          <>
            <IconCircle name="alert-circle-outline" tone="dangerSoft" size={56} />
            <Text style={[type.title, styles.center, { color: theme.text }]}>{t.modelError}</Text>
            {ai.error ? <Body muted>{ai.error}</Body> : null}
            <Button label={t.retry} icon="refresh" onPress={() => void reloadModel()} />
            {guidesButton}
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={[type.title, styles.center, { color: theme.text }]}>
              {ai.status === 'unpacking' ? t.modelUnpacking : t.modelLoading}
            </Text>
            {ai.progress > 0 ? (
              <>
                <Text style={[type.callout, { color: theme.muted, fontVariant: ['tabular-nums'] }]}>
                  {Math.round(ai.progress * 100)} %
                </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: space.lg, justifyContent: 'center' },
  card: { alignItems: 'center', paddingVertical: space.xxl, gap: space.lg },
  center: { textAlign: 'center' },
});
