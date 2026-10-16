import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import {
  aiStore,
  ensureModel,
  importModel,
  MODEL_MANIFEST,
  modelStorageBytes,
  reloadModel,
  removeImportedModel,
} from '../../ai/engine';
import type { Lang } from '../../i18n/lang';
import { updateSettings, useSettings, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { Body, Button, Card, H2, Progress } from '../../ui/components';
import { radius, space, useTheme } from '../../ui/theme';

function formatBytes(n: number): string {
  return n >= 1e9 ? `${(n / 1e9).toFixed(2)} GB` : `${Math.round(n / 1e6)} MB`;
}

export default function SettingsScreen() {
  const t = useTheme();
  const s = useT();
  const settings = useSettings();
  const ai = useStore(aiStore);
  const [importState, setImportState] = useState<'idle' | 'copying' | 'invalid' | 'error'>('idle');
  const [importError, setImportError] = useState('');

  const langOptions: Array<{ value: Lang | 'auto'; label: string }> = [
    { value: 'auto', label: s.languageAuto },
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'English' },
  ];

  const statusLabel =
    ai.status === 'ready'
      ? `${s.modelReady} · ${ai.source === 'imported' ? s.modelImported : s.modelBundled}`
      : ai.status === 'missing'
        ? s.modelMissingTitle
        : ai.status === 'error'
          ? s.modelError
          : s.modelNotLoaded;

  const onImport = async () => {
    setImportState('idle');
    try {
      const result = await importModel(() => setImportState('copying'));
      setImportState(result === 'invalid' ? 'invalid' : 'idle');
    } catch (e) {
      setImportError(e instanceof Error ? e.message : String(e));
      setImportState('error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Card>
        <H2>{s.language}</H2>
        <View style={styles.segment}>
          {langOptions.map((o) => {
            const active = settings.language === o.value;
            return (
              <Pressable
                key={o.value}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => updateSettings({ language: o.value })}
                style={[
                  styles.segmentItem,
                  { borderColor: active ? t.primary : t.border, backgroundColor: active ? t.primary : 'transparent' },
                ]}
              >
                <Text style={{ color: active ? t.onPrimary : t.text, fontWeight: '600' }}>{o.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card>
        <H2>{s.aiModel}</H2>
        <Body>{MODEL_MANIFEST.displayName}</Body>
        <Body muted>{statusLabel}</Body>
        {ai.status === 'loading' || ai.status === 'unpacking' ? (
          <Progress label={ai.status === 'unpacking' ? s.modelUnpacking : s.modelLoading} value={ai.progress} />
        ) : null}
        {ai.status === 'idle' ? <Button label={s.retry} icon="play" onPress={() => void ensureModel()} /> : null}
        {ai.error ? <Text style={{ color: t.danger }}>{ai.error}</Text> : null}
        <Body muted>
          {s.storage}: {formatBytes(modelStorageBytes())}
        </Body>

        {importState === 'copying' ? (
          <Progress label={s.importing} />
        ) : (
          <Button label={s.importModel} icon="folder-open" variant="secondary" disabled={ai.busy} onPress={() => void onImport()} />
        )}
        {importState === 'invalid' ? <Text style={{ color: t.danger }}>{s.importInvalid}</Text> : null}
        {importState === 'error' ? <Text style={{ color: t.danger }}>{importError}</Text> : null}
        {ai.source === 'imported' ? (
          <Button label={s.removeModel} icon="trash" variant="secondary" disabled={ai.busy} onPress={() => void removeImportedModel()} />
        ) : null}

        <View style={styles.switchRow}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: t.text, fontSize: 16, fontWeight: '600' }}>{s.gpu}</Text>
            <Text style={{ color: t.muted, fontSize: 13 }}>{s.gpuHint}</Text>
          </View>
          <Switch
            value={settings.gpu}
            disabled={ai.busy}
            onValueChange={(gpu) => {
              updateSettings({ gpu });
              void reloadModel();
            }}
          />
        </View>
      </Card>

      <Card>
        <H2>{s.privacyTitle}</H2>
        <Body muted>{s.privacyBody}</Body>
      </Card>

      <Card>
        <H2>{s.aboutTitle}</H2>
        <Body muted>
          {s.aboutBody.replace('{model}', MODEL_MANIFEST.displayName).replace('{license}', MODEL_MANIFEST.license)}
        </Body>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space.lg, gap: space.md, paddingBottom: space.xl * 2 },
  segment: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  segmentItem: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.sm },
});
