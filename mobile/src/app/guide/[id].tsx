import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Fragment } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { splitStep } from '../../knowledge/format';
import { guideById } from '../../knowledge/guides';
import { chatStore } from '../../state/chat';
import { useLang, useT } from '../../state/settings';
import { Body, Button, callEmergency, Glass, Icon, IconBadge, Press, Reveal, type IconName, Screen } from '../../ui/components';
import { font, radius, space, type, useTheme } from '../../ui/theme';

const SECTION_ICONS: IconName[] = ['checkCircle', 'hand', 'info', 'bulb'];

export default function GuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = guideById(id ?? '');
  const lang = useLang();
  const t = useTheme();
  const s = useT();
  const insets = useSafeAreaInsets();

  if (!guide) return <Body muted>{s.noResults}</Body>;
  const c = guide.content[lang];
  let step = 0;

  return (
    <Screen>
      <View style={[styles.top, { paddingTop: insets.top + space.sm }]}>
        <Press accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} scaleTo={0.9}>
          <Glass radiusSize="pill" strong>
            <View style={styles.back}>
              <Icon name="chevronLeft" size={22} color={t.primary} strokeWidth={2.2} />
            </View>
          </Glass>
        </Press>
        {guide.urgent ? (
          <Press accessibilityRole="button" accessibilityLabel={s.callLabel} onPress={() => callEmergency()} scaleTo={0.96} style={{ flex: 1 }}>
            <LinearGradient colors={['#E8483A', '#C22D22']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.strip}>
              <Icon name="warning" size={18} color="#fff" strokeWidth={2.2} />
              <Text numberOfLines={1} style={[font.extrabold, { color: '#fff', fontSize: 14, flex: 1 }]}>
                {s.callBanner}
              </Text>
              <Icon name="phone" size={18} color="#fff" strokeWidth={2.2} />
            </LinearGradient>
          </Press>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={[styles.wrap, { paddingBottom: insets.bottom + space.xxl }]} showsVerticalScrollIndicator={false}>
        <Reveal style={styles.hero}>
          <IconBadge name={guide.icon} tone={guide.urgent ? 'danger' : 'solid'} size={58} />
          <Text accessibilityRole="header" style={[type.title, { color: t.text }]}>
            {c.title}
          </Text>
          <Text style={[type.body, { color: t.muted }]}>{c.summary}</Text>
        </Reveal>

        {c.sections.map((section, si) => (
          <Reveal key={si} index={si + 1}>
            <Glass radiusSize="lg">
              {section.heading ? (
                <View style={styles.sectionHead}>
                  <Icon name={SECTION_ICONS[si % SECTION_ICONS.length] ?? 'info'} size={20} color={t.primary} strokeWidth={2} />
                  <Text style={[type.overline, { color: t.primary }]}>{section.heading}</Text>
                </View>
              ) : null}
              {section.steps.map((text, i) => {
                step += 1;
                const split = splitStep(text);
                const parts = !split.title && split.body.length <= 80 ? { title: split.body, body: '' } : split;
                return (
                  <Fragment key={step}>
                    {i > 0 || section.heading ? <View style={[styles.divider, { backgroundColor: t.divider }]} /> : null}
                    <View style={styles.step}>
                      <LinearGradient colors={t.scheme === 'dark' ? ['#5CE9AE', '#22B57E'] : ['#1F8F62', '#126244']} style={styles.num}>
                        <Text style={[font.extrabold, { color: t.onPrimary, fontSize: 14 }]}>{step}</Text>
                      </LinearGradient>
                      <View style={{ flex: 1, gap: 3 }}>
                        {parts.title ? <Text style={[type.headline, { color: t.text }]}>{parts.title}</Text> : null}
                        {parts.body ? (
                          <Text style={[parts.title ? type.callout : type.body, { color: parts.title ? t.muted : t.text }]}>{parts.body}</Text>
                        ) : null}
                      </View>
                    </View>
                  </Fragment>
                );
              })}
            </Glass>
          </Reveal>
        ))}

        <Reveal index={c.sections.length + 1} style={{ gap: space.md }}>
          <Button
            label={s.askAssistant}
            icon="sparkle"
            variant="glass"
            onPress={() => {
              chatStore.set({ draft: `${c.title}: ` });
              router.navigate('/');
            }}
          />
          <View style={styles.disclaimer}>
            <Icon name="shield" size={16} color={t.faint} />
            <Text style={[type.footnote, { color: t.faint, flex: 1 }]}>{s.guideDisclaimer}</Text>
          </View>
        </Reveal>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingBottom: space.sm },
  back: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  strip: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: 14, height: 42, borderRadius: radius.pill },
  wrap: { padding: space.lg, gap: space.md },
  hero: { gap: space.sm, paddingHorizontal: space.xs, paddingVertical: space.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, paddingTop: space.lg, paddingBottom: space.xs },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 66 },
  step: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', paddingHorizontal: space.lg, paddingVertical: 14 },
  num: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  disclaimer: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start', paddingHorizontal: space.xs },
});
