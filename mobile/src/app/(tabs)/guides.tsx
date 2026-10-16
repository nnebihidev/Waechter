import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { GUIDES } from '../../knowledge/guides';
import { indexFor } from '../../knowledge/search';
import type { Guide, GuideCategory } from '../../knowledge/types';
import { useLang, useT } from '../../state/settings';
import type { IconName } from '../../ui/components';
import { Body } from '../../ui/components';
import { radius, space, useTheme } from '../../ui/theme';

const ORDER: GuideCategory[] = ['emergency', 'firstaid', 'outdoor', 'everyday'];

function GuideRow({ guide }: { guide: Guide }) {
  const t = useTheme();
  const lang = useLang();
  const c = guide.content[lang];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/guide/[id]', params: { id: guide.id } })}
      style={({ pressed }) => [styles.row, { backgroundColor: t.card, borderColor: t.border, opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={[styles.icon, { backgroundColor: guide.urgent ? t.dangerSoft : t.bg }]}>
        <Ionicons name={guide.icon as IconName} size={22} color={guide.urgent ? t.danger : t.primary} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: t.text, fontSize: 16, fontWeight: '600' }}>{c.title}</Text>
        <Text style={{ color: t.muted, fontSize: 13 }} numberOfLines={2}>
          {c.summary}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={t.muted} />
    </Pressable>
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
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Pressable
        accessibilityRole="button"
        onPress={() => void Linking.openURL('tel:112').catch(() => undefined)}
        style={[styles.emergency, { backgroundColor: t.danger }]}
      >
        <Ionicons name="call" size={28} color={t.onDanger} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: t.onDanger, fontSize: 20, fontWeight: '800' }}>{s.guidesEmergencyTitle} · 112</Text>
          <Text style={{ color: t.onDanger, fontSize: 14 }}>{s.guidesEmergencyBody}</Text>
        </View>
      </Pressable>

      <View style={[styles.search, { backgroundColor: t.card, borderColor: t.border }]}>
        <Ionicons name="search" size={18} color={t.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={s.guidesSearch}
          placeholderTextColor={t.muted}
          style={{ flex: 1, color: t.text, fontSize: 16, paddingVertical: space.sm }}
          clearButtonMode="while-editing"
          autoCorrect={false}
        />
      </View>

      {results ? (
        results.length > 0 ? (
          results.map((g) => <GuideRow key={g.id} guide={g} />)
        ) : (
          <Body muted>{s.noResults}</Body>
        )
      ) : (
        ORDER.map((cat) => {
          const items = GUIDES.filter((g) => g.category === cat);
          if (items.length === 0) return null;
          return (
            <View key={cat} style={{ gap: space.sm }}>
              <Text style={[styles.section, { color: t.muted }]}>{catLabel[cat]}</Text>
              {items.map((g) => (
                <GuideRow key={g.id} guide={g} />
              ))}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space.lg, gap: space.md, paddingBottom: space.xl * 2 },
  emergency: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.md },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  section: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: space.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
