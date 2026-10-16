import Constants from 'expo-constants';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { aiStore, ensureModel, importModel, MODEL_MANIFEST, modelStorageBytes, reloadModel, removeImportedModel } from '../../ai/engine';
import { aiStatusLabel, ProgressRule } from '../../components/ModelGate';
import type { Lang } from '../../i18n/lang';
import { updateSettings, useSettings, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { Badge, Body, Display, IconFrame, Press, Reveal, Screen, SectionLabel, Slab, StatusStrip } from '../../ui/kit';
import { radius, space, TAB_BAR_HEIGHT, type, useTheme } from '../../ui/theme';

function formatBytes(n: number): string {
  return n >= 1e9 ? `${(n / 1e9).toFixed(2)} GB` : `${Math.round(n / 1e6)} MB`;
}

function Segmented<T extends string>({ options, value, onChange }: { options: Array<{ value: T; label: string }>; value: T; onChange: (v: T) => void }) {
  const t = useTheme();
  return (
    <View style={[styles.segment, { borderColor: t.line }]}>
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <Press
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            scaleTo={0.97}
            style={[styles.segmentItem, { backgroundColor: active ? t.signal : 'transparent' }, i > 0 && { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: t.line }]}
          >
            <Text style={[type.label, { color: active ? t.onSignal : t.text, letterSpacing: 1.2 }]}>{o.label}</Text>
          </Press>
        );
      })}
    </View>
  );
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
    <Screen>
      <StatusStrip left={aiStatusLabel(ai, s)} rightStrong={s.version} right={Constants.expoConfig?.version ?? '1.0.0'} />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
        <Reveal>
          <Display style={{ marginTop: space.lg }}>{s.tabSettings}</Display>
        </Reveal>

        <Reveal index={1} style={styles.group}>
          <SectionLabel label={s.language} />
          <Segmented options={langOptions} value={settings.language} onChange={(language) => updateSettings({ language })} />
        </Reveal>

        <Reveal index={2} style={styles.group}>
          <SectionLabel label={s.aiModel} />
          <View style={[styles.model, { borderColor: t.line, backgroundColor: t.surface }]}>
            <IconFrame name="chip" size={44} signal={ai.status === 'ready'} />
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={[type.headline, { color: t.text }]}>{MODEL_MANIFEST.displayName}</Text>
              <Badge label={ai.status === 'ready' ? s.modelReady : ai.status === 'missing' ? s.modelMissingTitle : ai.status === 'error' ? s.modelError : s.modelNotLoaded} tone={ai.status === 'ready' ? 'signal' : 'neutral'} />
              <Text style={[type.footnote, { color: t.muted }]}>
                {ai.source === 'imported' ? s.modelImported : s.modelBundled} · {formatBytes(modelStorageBytes() || (ai.source === 'bundled' ? MODEL_MANIFEST.sizeBytes : 0))}
              </Text>
            </View>
          </View>
          {ai.status === 'loading' || ai.status === 'unpacking' ? (
            <View>
              <Text style={[type.labelSmall, { color: t.signal }]}>
                {ai.status === 'unpacking' ? s.modelUnpacking : s.modelLoading} {Math.round(ai.progress * 100)}%
              </Text>
              <ProgressRule value={ai.progress} />
            </View>
          ) : null}
          {ai.status === 'idle' ? <Slab label={s.loadModel} icon="play" compact onPress={() => void ensureModel()} /> : null}
          {ai.error ? <Body muted small>{ai.error}</Body> : null}
          {importState === 'copying' ? (
            <Text style={[type.labelSmall, { color: t.signal }]}>{s.importing}</Text>
          ) : (
            <Slab label={s.importModel} icon="download" variant="neutral" compact disabled={ai.busy} onPress={() => void onImport()} />
          )}
          {importState === 'invalid' ? <Text style={[type.callout, { color: t.signal }]}>{s.importInvalid}</Text> : null}
          {importState === 'error' ? <Text style={[type.callout, { color: t.signal }]}>{importError}</Text> : null}
          {ai.source === 'imported' ? <Slab label={s.removeModel} icon="trash" variant="ghost" compact disabled={ai.busy} onPress={() => void removeImportedModel()} /> : null}
          <View style={[styles.switchRow, { borderTopColor: t.line }]}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[type.headline, { color: t.text }]}>{s.gpu}</Text>
              <Text style={[type.footnote, { color: t.muted }]}>{s.gpuHint}</Text>
            </View>
            <Switch
              value={settings.gpu}
              disabled={ai.busy}
              trackColor={{ true: t.signal, false: t.line }}
              thumbColor={t.text}
              onValueChange={(gpu) => {
                updateSettings({ gpu });
                void reloadModel();
              }}
            />
          </View>
        </Reveal>

        <Reveal index={3} style={styles.group}>
          <SectionLabel label={s.privacyTitle} />
          <Body muted small>{s.privacyBody}</Body>
        </Reveal>

        <Reveal index={4} style={styles.group}>
          <SectionLabel label={s.aboutTitle} />
          <Body muted small>{s.aboutBody.replace('{model}', MODEL_MANIFEST.displayName).replace('{license}', MODEL_MANIFEST.license)}</Body>
          <Text style={[type.labelSmall, { color: t.dim, marginTop: space.sm }]}>{s.oneTime}</Text>
        </Reveal>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.xl, paddingBottom: TAB_BAR_HEIGHT },
  group: { marginTop: space.xl, gap: space.md },
  segment: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.sm, overflow: 'hidden' },
  segmentItem: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xs },
  model: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderWidth: 1, borderRadius: radius.sm, padding: space.md },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: space.md },
});
