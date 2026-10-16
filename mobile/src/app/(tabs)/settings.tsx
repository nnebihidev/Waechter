import Constants from 'expo-constants';
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
import { Badge, Body, Button, Card, CardTitle, IconCircle, Progress, ScreenHeader } from '../../ui/components';
import { radius, space, type, useTheme } from '../../ui/theme';

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

  const badge =
    ai.status === 'ready' ? (
      <Badge label={s.modelReady} />
    ) : ai.status === 'missing' || ai.status === 'error' ? (
      <Badge label={ai.status === 'missing' ? s.modelMissingTitle : s.modelError} tone="danger" />
    ) : (
      <Badge label={s.modelNotLoaded} tone="neutral" />
    );

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
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader title={s.tabSettings} />
      <ScrollView contentContainerStyle={styles.wrap}>
        <Card>
          <CardTitle title={s.language} subtitle={s.languageHint} />
          <View style={[styles.segment, { backgroundColor: t.bg, borderColor: t.border }]}>
            {langOptions.map((o) => {
              const active = settings.language === o.value;
              return (
                <Pressable
                  key={o.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => updateSettings({ language: o.value })}
                  style={[styles.segmentItem, active && { backgroundColor: t.card, borderColor: t.primary }]}
                >
                  <Text style={{ color: active ? t.primary : t.text, fontWeight: active ? '800' : '600', fontSize: 14 }}>
                    {o.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card>
          <CardTitle title={s.aiModel} subtitle={s.aiModelHint} />
          <View style={[styles.model, { borderColor: t.border }]}>
            <IconCircle name="hardware-chip-outline" tone="solid" size={48} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[type.headline, { color: t.text, fontSize: 16 }]}>{MODEL_MANIFEST.displayName}</Text>
              {badge}
              <Text style={[type.footnote, { color: t.muted }]}>
                {ai.source === 'imported' ? s.modelImported : s.modelBundled} · {s.storage}: {formatBytes(modelStorageBytes() || (ai.source === 'bundled' ? MODEL_MANIFEST.sizeBytes : 0))}
              </Text>
            </View>
          </View>
          {ai.status === 'loading' || ai.status === 'unpacking' ? (
            <Progress label={ai.status === 'unpacking' ? s.modelUnpacking : s.modelLoading} value={ai.progress} />
          ) : null}
          {ai.status === 'idle' ? <Button label={s.loadModel} icon="play" onPress={() => void ensureModel()} /> : null}
          {ai.error ? <Body muted small>{ai.error}</Body> : null}

          {importState === 'copying' ? (
            <Progress label={s.importing} />
          ) : (
            <Button label={s.importModel} icon="download-outline" variant="outline" disabled={ai.busy} onPress={() => void onImport()} />
          )}
          {importState === 'invalid' ? <Text style={{ color: t.danger }}>{s.importInvalid}</Text> : null}
          {importState === 'error' ? <Text style={{ color: t.danger }}>{importError}</Text> : null}
          {ai.source === 'imported' ? (
            <Button
              label={s.removeModel}
              icon="trash-outline"
              variant="dangerOutline"
              disabled={ai.busy}
              onPress={() => void removeImportedModel()}
            />
          ) : null}

          <View style={[styles.switchRow, { borderTopColor: t.divider }]}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[type.headline, { color: t.text, fontSize: 16 }]}>{s.gpu}</Text>
              <Text style={[type.footnote, { color: t.muted }]}>{s.gpuHint}</Text>
            </View>
            <Switch
              value={settings.gpu}
              disabled={ai.busy}
              trackColor={{ true: t.accent, false: t.border }}
              onValueChange={(gpu) => {
                updateSettings({ gpu });
                void reloadModel();
              }}
            />
          </View>
        </Card>

        <Card>
          <View style={styles.infoRow}>
            <IconCircle name="shield-checkmark-outline" tone="solid" />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[type.headline, { color: t.text }]}>{s.privacyTitle}</Text>
              <Body muted small>{s.privacyBody}</Body>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.infoRow}>
            <IconCircle name="information-circle-outline" tone="solid" />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[type.headline, { color: t.text }]}>{s.aboutTitle}</Text>
              <Text style={[type.footnote, { color: t.muted }]}>
                {s.version} {Constants.expoConfig?.version ?? '1.0.0'}
              </Text>
              <Body muted small>
                {s.aboutBody.replace('{model}', MODEL_MANIFEST.displayName).replace('{license}', MODEL_MANIFEST.license)}
              </Body>
            </View>
          </View>
        </Card>

        <Text style={[type.footnote, { color: t.faint, textAlign: 'center' }]}>{s.oneTime}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md },
  segment: { flexDirection: 'row', borderRadius: radius.md, borderWidth: 1, padding: 3, gap: 3 },
  segmentItem: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xs,
  },
  model: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderWidth: 1, borderRadius: radius.md, padding: space.md },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: space.md,
  },
  infoRow: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
});
