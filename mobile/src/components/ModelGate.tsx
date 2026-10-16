import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { aiStore, ensureModel, reloadModel } from '../ai/engine';
import { useT } from '../state/settings';
import { useStore } from '../state/store';
import { Body, Button, Card, H2, Progress } from '../ui/components';
import { space } from '../ui/theme';

/** Renders children once the on-device model is ready; otherwise explains why not. */
export function ModelGate({ children }: { children: ReactNode }) {
  const ai = useStore(aiStore);
  const t = useT();

  useEffect(() => {
    void ensureModel();
  }, []);

  if (ai.status === 'ready') return <>{children}</>;

  return (
    <View style={styles.wrap}>
      {ai.status === 'missing' ? (
        <Card>
          <H2>{t.modelMissingTitle}</H2>
          <Body muted>{t.modelMissingBody}</Body>
          <Button label={t.openSettings} icon="settings" onPress={() => router.navigate('/settings')} />
          <Button label={t.tabGuides} icon="medkit" variant="secondary" onPress={() => router.navigate('/guides')} />
        </Card>
      ) : ai.status === 'error' ? (
        <Card>
          <H2>{t.modelError}</H2>
          <Body muted>{ai.error ?? ''}</Body>
          <Button label={t.retry} icon="refresh" onPress={() => void reloadModel()} />
        </Card>
      ) : (
        <Card>
          <Progress label={ai.status === 'unpacking' ? t.modelUnpacking : t.modelLoading} value={ai.progress} />
          {ai.lowMemory ? <Body muted>{t.modelLowMemory}</Body> : null}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space.lg },
});
