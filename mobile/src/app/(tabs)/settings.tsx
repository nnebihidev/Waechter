import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { aiStore, ensureModel, importModel, MODEL_MANIFEST, modelStorageBytes, reloadModel, removeImportedModel } from '../../ai/engine';
import type { Lang } from '../../i18n/lang';
import { updateSettings, useSettings, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { Badge, Body, Button, Card, CardTitle, Glass, IconBadge, Press, Progress, Reveal, ScreenHeader, Screen } from '../../ui/components';
import { font, radius, space, TAB_BAR_SPACE, type, useTheme } from '../../ui/theme';

function formatBytes(n: number): string {
  return n >= 1e9 ? `${(n / 1e9).toFixed(2)} GB` : `${Math.round(n / 1e6)} MB`;
}

/** Segmented control with a sliding glass thumb. */
function Segmented<T extends string>({ options, value, onChange }: { options: Array<{ value: T; label: string }>; value: T; onChange: (v: T) => void }) {
  const t = useTheme();
  const [width, setWidth] = useState(0);
  const slot = width / options.length;
  const x = useSharedValue(0);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  useEffect(() => {
    x.value = withSpring(index * slot, { damping: 18, stiffness: 200 });
  }, [index, slot, x]);
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <View style={[styles.segment, { backgroundColor: t.divider }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width - 6)}>
      {slot > 0 ? (
        <Animated.View style={[styles.thumb, { width: slot }, thumb]}>
          <LinearGradient colors={t.scheme === 'dark' ? ['#5CE9AE', '#22B57E'] : ['#1F8F62', '#126244']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      ) : null}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Press key={o.value} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => onChange(o.value)} style={styles.segmentItem} scaleTo={0.96}>
            <Text style={[active ? font.extrabold : font.semibold, { color: active ? t.onPrimary : t.text, fontSize: 14 }]}>{o.label}</Text>
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
    <Screen>
      <ScreenHeader title={s.tabSettings} />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
        <Reveal>
          <Card>
            <CardTitle title={s.language} subtitle={s.languageHint} icon="globe" />
            <Segmented options={langOptions} value={settings.language} onChange={(language) => updateSettings({ language })} />
          </Card>
        </Reveal>

        <Reveal index={1}>
          <Card>
            <CardTitle title={s.aiModel} subtitle={s.aiModelHint} icon="chip" />
            <Glass radiusSize="md" strong>
              <View style={styles.model}>
                <IconBadge name="sparkle" tone="solid" size={48} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[type.headline, { color: t.text, fontSize: 16 }]}>{MODEL_MANIFEST.displayName}</Text>
                  {badge}
                  <Text style={[type.footnote, { color: t.muted }]}>
                    {ai.source === 'imported' ? s.modelImported : s.modelBundled} · {s.storage}:{' '}
                    {formatBytes(modelStorageBytes() || (ai.source === 'bundled' ? MODEL_MANIFEST.sizeBytes : 0))}
                  </Text>
                </View>
              </View>
            </Glass>
            {ai.status === 'loading' || ai.status === 'unpacking' ? <Progress label={ai.status === 'unpacking' ? s.modelUnpacking : s.modelLoading} value={ai.progress} /> : null}
            {ai.status === 'idle' ? <Button label={s.loadModel} icon="play" onPress={() => void ensureModel()} /> : null}
            {ai.error ? <Body muted small>{ai.error}</Body> : null}

            {importState === 'copying' ? (
              <Progress label={s.importing} />
            ) : (
              <Button label={s.importModel} icon="download" variant="glass" disabled={ai.busy} onPress={() => void onImport()} />
            )}
            {importState === 'invalid' ? <Text style={[type.callout, { color: t.danger }]}>{s.importInvalid}</Text> : null}
            {importState === 'error' ? <Text style={[type.callout, { color: t.danger }]}>{importError}</Text> : null}
            {ai.source === 'imported' ? <Button label={s.removeModel} icon="trash" variant="dangerGlass" disabled={ai.busy} onPress={() => void removeImportedModel()} /> : null}

            <View style={[styles.switchRow, { borderTopColor: t.divider }]}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[type.headline, { color: t.text, fontSize: 16 }]}>{s.gpu}</Text>
                <Text style={[type.footnote, { color: t.muted }]}>{s.gpuHint}</Text>
              </View>
              <Switch
                value={settings.gpu}
                disabled={ai.busy}
                trackColor={{ true: t.accent, false: t.divider }}
                onValueChange={(gpu) => {
                  updateSettings({ gpu });
                  void reloadModel();
                }}
              />
            </View>
          </Card>
        </Reveal>

        <Reveal index={2}>
          <Card>
            <View style={styles.infoRow}>
              <IconBadge name="shield" tone="solid" />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[type.headline, { color: t.text }]}>{s.privacyTitle}</Text>
                <Body muted small>{s.privacyBody}</Body>
              </View>
            </View>
          </Card>
        </Reveal>

        <Reveal index={3}>
          <Card>
            <View style={styles.infoRow}>
              <IconBadge name="info" tone="amber" />
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[type.headline, { color: t.text }]}>{s.aboutTitle}</Text>
                <Text style={[type.footnote, { color: t.muted }]}>
                  {s.version} {Constants.expoConfig?.version ?? '1.0.0'}
                </Text>
                <Body muted small>{s.aboutBody.replace('{model}', MODEL_MANIFEST.displayName).replace('{license}', MODEL_MANIFEST.license)}</Body>
              </View>
            </View>
          </Card>
        </Reveal>

        <Text style={[type.footnote, { color: t.faint, textAlign: 'center' }]}>{s.oneTime}</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingBottom: TAB_BAR_SPACE, gap: space.md },
  segment: { flexDirection: 'row', borderRadius: radius.md, padding: 3 },
  thumb: { position: 'absolute', left: 3, top: 3, bottom: 3, borderRadius: radius.sm, overflow: 'hidden' },
  segmentItem: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xs },
  model: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: space.md },
  infoRow: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
});
