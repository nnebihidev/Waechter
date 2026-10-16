import { router, useLocalSearchParams } from 'expo-router';
import { Fragment } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { splitStep } from '../../knowledge/format';
import { guideById } from '../../knowledge/guides';
import { chatStore } from '../../state/chat';
import { useLang, useLegal, useT } from '../../state/settings';
import { AlertBar, Body, Display, Icon, Press, Reveal, Screen, SectionLabel, Slab, StatusStrip } from '../../ui/kit';
import { font, radius, space, type, useTheme } from '../../ui/theme';

export default function GuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = guideById(id ?? '');
  const lang = useLang();
  const t = useTheme();
  const s = useT();
  const l = useLegal();
  const insets = useSafeAreaInsets();

  if (!guide) return <Body muted>{s.noResults}</Body>;
  const c = guide.content[lang];
  const total = c.sections.reduce((n, sec) => n + sec.steps.length, 0);
  let step = 0;
  const catLabel = guide.category === 'emergency' || guide.urgent ? s.catEmergency : guide.category === 'outdoor' ? s.catOutdoor : s.catFirstaid;

  return (
    <Screen>
      <StatusStrip left={`${s.catFirstaid} · ${catLabel}`} rightStrong={s.stepOf} right={`1 / ${total}`} />
      <View style={styles.bar}>
        <Press accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} scaleTo={0.9} style={[styles.back, { borderColor: t.line }]}>
          <Icon name="chevronLeft" size={20} color={t.text} strokeWidth={2.2} />
        </Press>
        {guide.urgent ? <AlertBar text={s.callBanner} style={{ flex: 1 }} /> : <View style={{ flex: 1 }} />}
      </View>

      <ScrollView contentContainerStyle={[styles.wrap, { paddingBottom: insets.bottom + space.xxl }]} showsVerticalScrollIndicator={false}>
        <Reveal>
          <Display style={{ marginTop: space.lg }}>{c.title.split(/\s[—–-]\s/)[0]}</Display>
          {c.title.includes(' — ') ? <Text style={[type.title, { color: t.signal, marginTop: space.xs, fontSize: 18, lineHeight: 20 }]}>{c.title.split(' — ')[1]}</Text> : null}
          <Body muted style={{ marginTop: space.md }}>
            {c.summary}
          </Body>
        </Reveal>

        {c.sections.map((section, si) => (
          <Reveal key={si} index={si + 1} style={{ marginTop: space.xl }}>
            {section.heading ? <SectionLabel label={section.heading} tone="signal" style={{ marginBottom: space.xs }} /> : null}
            {section.steps.map((text) => {
              step += 1;
              const split = splitStep(text);
              const parts = !split.title && split.body.length <= 80 ? { title: split.body, body: '' } : split;
              const hot = /\b112\b/.test(text);
              return (
                <Fragment key={step}>
                  <View style={[styles.step, { borderBottomColor: t.line }]}>
                    <Text style={[styles.num, { color: hot ? t.signal : t.dim }]}>{String(step).padStart(2, '0')}</Text>
                    <View style={{ flex: 1, paddingTop: 5, gap: 3 }}>
                      {parts.title ? <Text style={[type.headline, { color: t.text }]}>{parts.title}</Text> : null}
                      {parts.body ? <Text style={[parts.title ? type.callout : type.body, { color: parts.title ? t.muted : t.text }]}>{parts.body}</Text> : null}
                    </View>
                  </View>
                </Fragment>
              );
            })}
          </Reveal>
        ))}

        <Reveal index={c.sections.length + 1} style={{ marginTop: space.xl, gap: space.md }}>
          <Slab
            label={s.askAssistant}
            icon="sparkle"
            variant="ghost"
            compact
            onPress={() => {
              chatStore.set({ draft: `${c.title}: ` });
              router.navigate('/');
            }}
          />
          <View style={styles.disclaimer}>
            <Icon name="shield" size={14} color={t.dim} />
            <Text style={[type.footnote, { color: t.dim, flex: 1 }]}>{l.guideNotice}</Text>
          </View>
          <View style={styles.disclaimer}>
            <Icon name="book" size={14} color={t.dim} />
            <Text style={[type.footnote, { color: t.dim, flex: 1 }]}>{l.sourcesNotice}</Text>
          </View>
        </Reveal>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: space.xl, marginTop: space.xs },
  back: { width: 40, height: 40, borderWidth: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  wrap: { paddingHorizontal: space.xl },
  step: { flexDirection: 'row', gap: 14, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth },
  num: { ...font.display, fontSize: 34, lineHeight: 36, width: 44, letterSpacing: -0.5 },
  disclaimer: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
});
