import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { GUIDES } from '../../knowledge/guides';
import { indexFor } from '../../knowledge/search';
import type { Guide, GuideCategory } from '../../knowledge/types';
import { useLang, useT } from '../../state/settings';
import { Body, callEmergency, Glass, Icon, IconBadge, ListGroup, ListRow, Press, Reveal, ScreenHeader, SectionLabel, Screen } from '../../ui/components';
import { font, radius, space, TAB_BAR_SPACE, type, useTheme } from '../../ui/theme';

const ORDER: GuideCategory[] = ['emergency', 'firstaid', 'outdoor', 'everyday'];

function GuideRow({ guide }: { guide: Guide }) {
  const lang = useLang();
  const c = guide.content[lang];
  const tone = guide.category === 'emergency' ? 'danger' : guide.urgent ? 'dangerSoft' : guide.category === 'outdoor' ? 'amber' : 'soft';
  return (
    <ListRow
      title={c.title}
      subtitle={c.summary}
      left={<IconBadge name={guide.icon} tone={tone} size={46} />}
      onPress={() => router.push({ pathname: '/guide/[id]', params: { id: guide.id } })}
    />
  );
}

export default function GuidesScreen() {
  const t = useTheme();
  const s = useT();
  const lang = useLang();
  const [query, setQuery] = useState('');

  const results = useMemo(() => (query.trim() ? indexFor(GUIDES, lang).search(query, 8).map((h) => h.guide) : null), [query, lang]);
  const catLabel: Record<GuideCategory, string> = {
    emergency: s.catEmergency,
    firstaid: s.catFirstaid,
    outdoor: s.catOutdoor,
    everyday: s.catEveryday,
  };

  return (
    <Screen>
      <ScreenHeader title={s.tabGuides} eyebrow={`${GUIDES.length} ${s.guidesCount}`} />
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Reveal>
          <Press accessibilityRole="button" accessibilityLabel={s.callLabel} onPress={() => callEmergency()} scaleTo={0.97}>
            <LinearGradient colors={['#E8483A', '#B9271D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.emergency}>
              <View style={styles.emergencyGlow} />
              <Icon name="warning" size={34} color="#fff" strokeWidth={2} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[font.extrabold, { color: '#fff', fontSize: 24, letterSpacing: -0.4 }]}>{s.guidesEmergencyTitle} · 112</Text>
                <Text style={[type.footnote, { color: 'rgba(255,255,255,0.9)' }]}>{s.guidesEmergencyBody}</Text>
              </View>
              <View style={styles.emergencyCall}>
                <Icon name="phone" size={22} color="#fff" strokeWidth={2.2} />
              </View>
            </LinearGradient>
          </Press>
        </Reveal>

        <Reveal index={1}>
          <Glass radiusSize="md" strong>
            <View style={styles.search}>
              <Icon name="search" size={20} color={t.faint} strokeWidth={2} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={s.guidesSearch}
                placeholderTextColor={t.faint}
                style={[styles.searchInput, { color: t.text }]}
                autoCorrect={false}
                returnKeyType="search"
              />
              {query ? (
                <Press accessibilityRole="button" accessibilityLabel={s.clear} onPress={() => setQuery('')} hitSlop={10}>
                  <Icon name="close" size={20} color={t.faint} />
                </Press>
              ) : null}
            </View>
          </Glass>
        </Reveal>

        {results ? (
          results.length > 0 ? (
            <Reveal>
              <ListGroup>
                {results.map((g) => (
                  <GuideRow key={g.id} guide={g} />
                ))}
              </ListGroup>
            </Reveal>
          ) : (
            <Body muted>{s.noResults}</Body>
          )
        ) : (
          ORDER.map((cat, ci) => {
            const items = GUIDES.filter((g) => g.category === cat);
            if (items.length === 0) return null;
            return (
              <Reveal key={cat} index={ci + 2} style={{ gap: space.sm }}>
                <SectionLabel label={catLabel[cat]} tone={cat === 'emergency' ? 'danger' : 'primary'} />
                <ListGroup>
                  {items.map((g) => (
                    <GuideRow key={g.id} guide={g} />
                  ))}
                </ListGroup>
              </Reveal>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingBottom: TAB_BAR_SPACE, gap: space.md },
  emergency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#B9271D',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  emergencyGlow: { position: 'absolute', right: -40, top: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.14)' },
  emergencyCall: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md, minHeight: 52 },
  searchInput: { ...font.medium, flex: 1, fontSize: 16, paddingVertical: space.sm },
});
