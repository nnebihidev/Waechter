import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { splitStep } from '../../knowledge/format';
import { guideById } from '../../knowledge/guides';
import { chatStore } from '../../state/chat';
import { useLang, useT } from '../../state/settings';
import { Body, Button, callEmergency, Card, type IconName } from '../../ui/components';
import { space, type, useTheme } from '../../ui/theme';

const SECTION_ICONS: IconName[] = ['checkmark-circle-outline', 'hand-left-outline', 'information-circle-outline', 'bulb-outline'];

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
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <Stack.Screen options={{ title: c.title }} />
      {guide.urgent ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={s.callLabel}
          onPress={() => callEmergency()}
          style={[styles.strip, { backgroundColor: t.dangerSoft }]}
        >
          <Ionicons name="warning" size={20} color={t.danger} />
          <Text style={{ color: t.danger, fontWeight: '800', fontSize: 16 }}>{s.callBanner}</Text>
          <Ionicons name="call" size={18} color={t.danger} />
        </Pressable>
      ) : null}
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text accessibilityRole="header" style={[type.title, { color: t.primary }]}>
          {c.title}
        </Text>
        <Text style={[type.body, { color: t.muted }]}>{c.summary}</Text>

        {c.sections.map((section, si) => (
          <Card key={si} padded={false} style={{ gap: 0 }}>
            {section.heading ? (
              <View style={styles.sectionHead}>
                <Ionicons name={SECTION_ICONS[si % SECTION_ICONS.length] ?? 'list'} size={22} color={t.primary} />
                <Text style={[type.overline, { color: t.primary, fontSize: 15 }]}>{section.heading}</Text>
              </View>
            ) : null}
            {section.steps.map((text, i) => {
              step += 1;
              const split = splitStep(text);
              // A short single sentence reads best as a bold instruction on its own.
              const parts = !split.title && split.body.length <= 80 ? { title: split.body, body: '' } : split;
              return (
                <Fragment key={step}>
                  {i > 0 || section.heading ? <View style={[styles.divider, { backgroundColor: t.divider }]} /> : null}
                  <View style={styles.step}>
                    <View style={[styles.num, { backgroundColor: t.primary }]}>
                      <Text style={{ color: t.onPrimary, fontWeight: '800', fontSize: 14 }}>{step}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 3 }}>
                      {parts.title ? (
                        <Text style={[type.headline, { color: t.text }]}>{parts.title}</Text>
                      ) : null}
                      {parts.body ? (
                        <Text style={[parts.title ? type.callout : type.body, { color: parts.title ? t.muted : t.text }]}>
                          {parts.body}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </Fragment>
              );
            })}
          </Card>
        ))}

        <Button
          label={s.askAssistant}
          icon="chatbubble-ellipses-outline"
          variant="outline"
          onPress={() => {
            chatStore.set({ draft: `${c.title}: ` });
            router.navigate('/');
          }}
        />
        <View style={styles.disclaimer}>
          <Ionicons name="shield-checkmark-outline" size={16} color={t.faint} />
          <Text style={[type.footnote, { color: t.faint, flex: 1 }]}>{s.guideDisclaimer}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, paddingVertical: space.md },
  wrap: { padding: space.lg, gap: space.md, paddingBottom: space.xxl * 2 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, paddingTop: space.lg, paddingBottom: space.xs },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 64 },
  step: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', paddingHorizontal: space.lg, paddingVertical: space.md },
  num: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  disclaimer: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start', paddingHorizontal: space.xs },
});
