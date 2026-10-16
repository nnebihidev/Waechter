import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { guideById } from '../../knowledge/guides';
import { chatStore } from '../../state/chat';
import { useLang, useT } from '../../state/settings';
import { Body, Button, EmergencyBanner } from '../../ui/components';
import { radius, space, useTheme } from '../../ui/theme';

export default function GuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = guideById(id ?? '');
  const lang = useLang();
  const t = useTheme();
  const s = useT();

  if (!guide) return <Body muted>{s.noResults}</Body>;
  const c = guide.content[lang];
  let step = 0;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Stack.Screen options={{ title: c.title }} />
      {guide.urgent ? <EmergencyBanner text={s.callBanner} /> : null}
      <Text style={[styles.title, { color: t.text }]}>{c.title}</Text>
      <Body muted>{c.summary}</Body>
      {c.sections.map((section, si) => (
        <View key={si} style={[styles.section, { backgroundColor: t.card, borderColor: t.border }]}>
          {section.heading ? <Text style={[styles.heading, { color: t.primary }]}>{section.heading}</Text> : null}
          {section.steps.map((text) => {
            step += 1;
            return (
              <View key={step} style={styles.step}>
                <View style={[styles.num, { backgroundColor: t.primary }]}>
                  <Text style={{ color: t.onPrimary, fontWeight: '700', fontSize: 13 }}>{step}</Text>
                </View>
                <Text style={[styles.stepText, { color: t.text }]}>{text}</Text>
              </View>
            );
          })}
        </View>
      ))}
      <Button
        label={s.askAssistant}
        icon="chatbubbles"
        variant="secondary"
        onPress={() => {
          chatStore.set({ draft: `${c.title}: ` });
          router.navigate('/');
        }}
      />
      <Text style={[styles.disclaimer, { color: t.muted }]}>{s.guideDisclaimer}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space.lg, gap: space.md, paddingBottom: space.xl * 2 },
  title: { fontSize: 24, fontWeight: '800' },
  section: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, padding: space.lg, gap: space.md },
  heading: { fontSize: 15, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  step: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  num: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepText: { flex: 1, fontSize: 17, lineHeight: 25 },
  disclaimer: { fontSize: 12, lineHeight: 17 },
});
