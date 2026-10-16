import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TERMS_VERSION } from '../legal/texts';
import { updateSettings, useLang, useLegal } from '../state/settings';
import { BrandMark } from '../ui/icons';
import { Body, Display, Press, Reveal, Screen, Slab, StatusStrip } from '../ui/kit';
import { space, type, useTheme } from '../ui/theme';

/** First-launch screen: the four things a user must know, then explicit acceptance. */
export default function WelcomeScreen() {
  const t = useTheme();
  const l = useLegal();
  const lang = useLang();
  const insets = useSafeAreaInsets();

  const accept = () => {
    updateSettings({ acceptedTerms: { version: TERMS_VERSION, at: new Date().toISOString() } });
    router.replace('/');
  };

  return (
    <Screen>
      <StatusStrip left={lang === 'de' ? 'Offline · Erster Start' : 'Offline · First start'} />
      <ScrollView contentContainerStyle={[styles.wrap, { paddingBottom: insets.bottom + 180 }]} showsVerticalScrollIndicator={false}>
        <Reveal>
          <BrandMark size={56} />
          <Display style={{ marginTop: space.lg }}>{l.welcomeTitle}</Display>
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
      </ScrollView>
      <View style={[styles.foot, { backgroundColor: t.bg, borderTopColor: t.line, paddingBottom: insets.bottom + space.md }]}>
        <Text style={[type.footnote, { color: t.muted }]}>{l.welcomeAcceptHint}</Text>
        <Slab label={l.welcomeAccept} icon="check" onPress={accept} />
        <Press accessibilityRole="link" onPress={() => router.push({ pathname: '/legal', params: { section: 'terms' } })} style={{ alignSelf: 'center', paddingVertical: 4 }}>
          <Text style={[type.label, { color: t.signal }]}>{l.welcomeRead}</Text>
        </Press>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.xl, paddingTop: space.lg },
  point: { flexDirection: 'row', gap: 14, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  num: { fontFamily: 'BarlowCondensed_700Bold', fontSize: 34, lineHeight: 36, width: 44, letterSpacing: -0.5 },
  foot: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.xl, paddingTop: space.md, gap: space.md, borderTopWidth: StyleSheet.hairlineWidth },
});
