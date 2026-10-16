import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TERMS_VERSION } from '../legal/texts';
import { updateSettings, useLang, useLegal } from '../state/settings';
import { BrandMark } from '../ui/icons';
import { Body, CheckRow, Display, Press, Reveal, Screen, SectionLabel, Slab, StatusStrip } from '../ui/kit';
import { space, type, useTheme } from '../ui/theme';

/**
 * First-launch consent. The declaration must be scrolled to the end and every
 * mandatory box ticked before the app unlocks. Nothing is sent anywhere; the
 * consent record (version, time, ticked ids, app version) stays on the device.
 */
export default function WelcomeScreen() {
  const t = useTheme();
  const l = useLegal();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [readToEnd, setReadToEnd] = useState(false);

  const allChecked = l.consentChecks.every((c) => checked[c.id]);
  const canAccept = allChecked && readToEnd;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 24) setReadToEnd(true);
  };
  const onLayoutCheck = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Short screens: content may already fit without scrolling.
    const { contentSize, layoutMeasurement } = e.nativeEvent;
    if (contentSize.height <= layoutMeasurement.height + 24) setReadToEnd(true);
  };

  const accept = () => {
    if (!canAccept) return;
    updateSettings({
      acceptedTerms: {
        version: TERMS_VERSION,
        at: new Date().toISOString(),
        checks: l.consentChecks.map((c) => c.id),
        appVersion: Constants.expoConfig?.version ?? '0',
      },
    });
    router.replace('/');
  };

  return (
    <Screen>
      <StatusStrip left={lang === 'de' ? 'Offline · Erster Start' : 'Offline · First start'} rightStrong={`v${TERMS_VERSION}`} />
      <ScrollView
        contentContainerStyle={[styles.wrap, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator
        onScroll={onScroll}
        onMomentumScrollEnd={onScroll}
        onScrollEndDrag={onScroll}
        onScrollBeginDrag={onLayoutCheck}
        scrollEventThrottle={64}
      >
        <Reveal>
          <BrandMark size={52} />
          <Display style={{ marginTop: space.lg }}>{l.consentTitle}</Display>
          <Body muted style={{ marginTop: space.md }}>
            {l.welcomeIntro}
          </Body>
        </Reveal>

        {l.welcomePoints.map((p, i) => (
          <Reveal key={p.title} index={i + 1} style={[styles.point, { borderBottomColor: t.line }]}>
            <Text style={[styles.num, { color: i === 0 ? t.signal : t.dim }]}>{String(i + 1).padStart(2, '0')}</Text>
            <View style={{ flex: 1, paddingTop: 5, gap: 3 }}>
              <Text style={[type.headline, { color: t.text }]}>{p.title}</Text>
              <Text style={[type.callout, { color: t.muted }]}>{p.body}</Text>
            </View>
          </Reveal>
        ))}

        <Reveal index={5} style={{ marginTop: space.xl, gap: space.md }}>
          <SectionLabel label={l.consentTitle} tone="signal" />
          {l.consentParagraphs.map((p, i) => (
            <Text key={i} style={[type.body, { color: t.text }]}>
              {p}
            </Text>
          ))}
          <Press accessibilityRole="link" onPress={() => router.push({ pathname: '/legal', params: { section: 'terms' } })} style={{ alignSelf: 'flex-start', paddingVertical: 4 }}>
            <Text style={[type.label, { color: t.signal }]}>{l.welcomeRead} ›</Text>
          </Press>
        </Reveal>

        <Reveal index={6} style={{ marginTop: space.lg }}>
          <SectionLabel label={lang === 'de' ? 'Bestätigung' : 'Confirmation'} />
          <View style={{ marginTop: space.xs }}>
            {l.consentChecks.map((c) => (
              <CheckRow key={c.id} label={c.label} checked={!!checked[c.id]} onToggle={() => setChecked((prev) => ({ ...prev, [c.id]: !prev[c.id] }))} />
            ))}
          </View>
        </Reveal>
      </ScrollView>

      <View style={[styles.foot, { backgroundColor: t.bg, borderTopColor: t.line, paddingBottom: insets.bottom + space.md }]}>
        <Text style={[type.footnote, { color: canAccept ? t.muted : t.signal }]}>{!readToEnd ? l.consentScrollHint : l.welcomeAcceptHint}</Text>
        <Slab label={l.welcomeAccept} icon="check" onPress={accept} disabled={!canAccept} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.xl, paddingTop: space.lg },
  point: { flexDirection: 'row', gap: 14, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  num: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 34, lineHeight: 36, width: 44, letterSpacing: -0.5 },
  foot: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.xl, paddingTop: space.md, gap: space.md, borderTopWidth: StyleSheet.hairlineWidth },
});
