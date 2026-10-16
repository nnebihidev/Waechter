import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import licenses from '../legal/licenses.json';
import type { LegalSection } from '../legal/texts';
import { useLegal, useSettings } from '../state/settings';
import { Chip, Display, Icon, Press, Reveal, Screen, SectionLabel, StatusStrip } from '../ui/kit';
import { radius, space, type, useTheme } from '../ui/theme';

type Section = 'consent' | 'terms' | 'privacy' | 'imprint' | 'licenses';
const SECTIONS: Section[] = ['consent', 'terms', 'privacy', 'imprint', 'licenses'];

function Doc({ sections }: { sections: LegalSection[] }) {
  const t = useTheme();
  return (
    <View style={{ gap: space.xl }}>
      {sections.map((s) => (
        <View key={s.heading} style={{ gap: space.sm }}>
          <SectionLabel label={s.heading} />
          {s.paragraphs.map((p, i) => (
            <Text key={i} selectable style={[type.body, { color: p.includes('{{') ? t.signal : t.text }]}>
              {p}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function LegalScreen() {
  const { section } = useLocalSearchParams<{ section?: Section }>();
  const [active, setActive] = useState<Section>(section && SECTIONS.includes(section) ? section : 'terms');
  const t = useTheme();
  const l = useLegal();
  const { acceptedTerms } = useSettings();
  const insets = useSafeAreaInsets();
  const titles: Record<Section, string> = { consent: l.consentTitle, terms: l.termsTitle, privacy: l.privacyTitle, imprint: l.imprintTitle, licenses: l.licensesTitle };

  return (
    <Screen topo={false}>
      <StatusStrip left={l.legalMenu} rightStrong={acceptedTerms ? l.acceptedOn : undefined} right={acceptedTerms ? new Date(acceptedTerms.at).toLocaleDateString() : undefined} />
      <View style={styles.bar}>
        <Press accessibilityRole="button" accessibilityLabel="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} scaleTo={0.9} style={[styles.back, { borderColor: t.line }]}>
          <Icon name="chevronLeft" size={20} color={t.text} strokeWidth={2.2} />
        </Press>
        <Display style={{ flex: 1, fontSize: 34, lineHeight: 36 }} fit>{titles[active]}</Display>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ flexGrow: 0, height: 36 + 2 * space.md }}>
        {SECTIONS.map((s) => (
          <Chip key={s} label={titles[s]} active={s === active} onPress={() => setActive(s)} />
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={[styles.wrap, { paddingBottom: insets.bottom + space.xxl }]} showsVerticalScrollIndicator={false}>
        <Reveal key={active}>
          {active === 'licenses' ? (
            <View style={{ gap: space.md }}>
              <Text style={[type.body, { color: t.muted }]}>{l.licensesIntro}</Text>
              <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.line }}>
                {licenses.map((e) => (
                  <View key={e.name} style={[styles.lic, { borderBottomColor: t.line }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[type.headline, { color: t.text, fontSize: 15 }]}>{e.name}</Text>
                      {e.version ? <Text style={[type.footnote, { color: t.dim }]}>{e.version}</Text> : null}
                    </View>
                    <Text style={[type.labelSmall, { color: t.signal }]}>{e.license}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Doc sections={active === 'consent' ? [{ heading: l.consentTitle, paragraphs: l.consentParagraphs }, { heading: acceptedTerms ? `${l.acceptedOn} ${new Date(acceptedTerms.at).toLocaleString()}` : '—', paragraphs: l.consentChecks.map((c) => `✓ ${c.label}`) }] : active === 'terms' ? l.terms : active === 'privacy' ? l.privacy : l.imprint} />
          )}
        </Reveal>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: space.xl, marginTop: space.sm },
  back: { width: 40, height: 40, borderWidth: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  chips: { gap: space.sm, paddingHorizontal: space.xl, paddingVertical: space.md },
  wrap: { paddingHorizontal: space.xl, paddingTop: space.sm },
  lic: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
});
