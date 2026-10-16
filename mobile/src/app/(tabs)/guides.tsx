import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { GUIDES } from '../../knowledge/guides';
import { indexFor } from '../../knowledge/search';
import type { Guide, GuideCategory } from '../../knowledge/types';
import { useLang, useT } from '../../state/settings';
import { Body, callEmergency, IconCircle, ListGroup, ListRow, ScreenHeader, SectionLabel, type IconName } from '../../ui/components';
import { radius, space, type, useTheme } from '../../ui/theme';

const ORDER: GuideCategory[] = ['emergency', 'firstaid', 'outdoor', 'everyday'];

function GuideRow({ guide }: { guide: Guide }) {
  const lang = useLang();
  const c = guide.content[lang];
  const tone = guide.category === 'emergency' ? 'danger' : guide.urgent ? 'dangerSoft' : guide.category === 'firstaid' ? 'solid' : 'soft';
  return (
    <ListRow
      title={c.title}
      subtitle={c.summary}
      left={<IconCircle name={guide.icon as IconName} tone={tone} />}
      onPress={() => router.push({ pathname: '/guide/[id]', params: { id: guide.id } })}
    />
  );
}

export default function GuidesScreen() {
  const t = useTheme();
  const s = useT();
  const lang = useLang();
  const [query, setQuery] = useState('');

  const results = useMemo(
    () => (query.trim() ? indexFor(GUIDES, lang).search(query, 8).map((h) => h.guide) : null),
    [query, lang],
  );
  const catLabel: Record<GuideCategory, string> = {
    emergency: s.catEmergency,
    firstaid: s.catFirstaid,
    outdoor: s.catOutdoor,
    everyday: s.catEveryday,
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader
        title={s.tabGuides}
        right={<Text style={[type.footnote, { color: t.muted }]}>{GUIDES.length} {s.guidesCount}</Text>}
      />
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={s.callLabel}
          onPress={() => callEmergency()}
          style={({ pressed }) => [styles.emergency, { backgroundColor: t.dangerFill, opacity: pressed ? 0.9 : 1 }]}
        >
          <Ionicons name="warning" size={34} color={t.onDanger} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: t.onDanger, fontSize: 24, fontWeight: '800' }}>{s.guidesEmergencyTitle} · 112</Text>
            <Text style={[type.footnote, { color: t.onDanger }]}>{s.guidesEmergencyBody}</Text>
          </View>
          <View style={[styles.emergencyCall, { borderColor: t.onDanger }]}>
            <Ionicons name="call" size={22} color={t.onDanger} />
          </View>
        </Pressable>

        <View style={[styles.search, { backgroundColor: t.card, borderColor: t.border }]}>
          <Ionicons name="search" size={20} color={t.faint} />
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
            <Pressable accessibilityRole="button" accessibilityLabel={s.clear} onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={20} color={t.faint} />
            </Pressable>
          ) : null}
        </View>

        {results ? (
          results.length > 0 ? (
            <ListGroup>
              {results.map((g) => (
                <GuideRow key={g.id} guide={g} />
              ))}
            </ListGroup>
          ) : (
            <Body muted>{s.noResults}</Body>
          )
        ) : (
          ORDER.map((cat) => {
            const items = GUIDES.filter((g) => g.category === cat);
            if (items.length === 0) return null;
            return (
              <View key={cat} style={{ gap: space.sm }}>
                <SectionLabel label={catLabel[cat]} tone={cat === 'emergency' ? 'danger' : 'primary'} />
                <ListGroup>
                  {items.map((g) => (
                    <GuideRow key={g.id} guide={g} />
                  ))}
                </ListGroup>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md },
  emergency: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.md },
  emergencyCall: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    minHeight: 50,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: space.sm },
});
