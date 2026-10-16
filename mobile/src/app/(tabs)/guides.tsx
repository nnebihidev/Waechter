import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { GUIDES } from '../../knowledge/guides';
import { indexFor } from '../../knowledge/search';
import type { Guide, GuideCategory } from '../../knowledge/types';
import { useLang, useT } from '../../state/settings';
import { Body, callEmergency, Display, Icon, IconFrame, List, ListRow, Press, Reveal, Screen, SectionLabel, Slab, StatusStrip } from '../../ui/kit';
import { font, radius, space, TAB_BAR_HEIGHT, useTheme } from '../../ui/theme';

const ORDER: GuideCategory[] = ['emergency', 'firstaid', 'outdoor', 'everyday'];

function GuideRow({ guide }: { guide: Guide }) {
  const lang = useLang();
  const c = guide.content[lang];
  return (
    <ListRow
      title={c.title}
      subtitle={c.summary}
      left={<IconFrame name={guide.icon} signal={guide.urgent} />}
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
  const catLabel: Record<GuideCategory, string> = { emergency: s.catEmergency, firstaid: s.catFirstaid, outdoor: s.catOutdoor, everyday: s.catEveryday };

  return (
    <Screen>
      <StatusStrip left={`${s.catFirstaid} · ${s.catOutdoor}`} rightStrong={String(GUIDES.length)} right={s.guidesCount} />
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Reveal>
          <Display style={{ marginTop: space.lg }}>{s.tabGuides}</Display>
        </Reveal>
        <Reveal index={1} style={{ marginTop: space.lg }}>
          <Slab label={s.guidesEmergencyTitle + ' · 112'} sub={s.guidesEmergencyBody} icon="phone" onPress={() => callEmergency()} accessibilityLabel={s.callLabel} />
        </Reveal>
        <Reveal index={2} style={[styles.search, { backgroundColor: t.surface, borderColor: t.line }]}>
          <Icon name="search" size={18} color={t.dim} strokeWidth={2} />
          <TextInput value={query} onChangeText={setQuery} placeholder={s.guidesSearch} placeholderTextColor={t.dim} style={[styles.searchInput, { color: t.text }]} autoCorrect={false} returnKeyType="search" />
          {query ? (
            <Press accessibilityRole="button" accessibilityLabel={s.clear} onPress={() => setQuery('')} hitSlop={10}>
              <Icon name="close" size={18} color={t.dim} />
            </Press>
          ) : null}
        </Reveal>

        {results ? (
          results.length > 0 ? (
            <Reveal>
              <List>
                {results.map((g) => (
                  <GuideRow key={g.id} guide={g} />
                ))}
              </List>
            </Reveal>
          ) : (
            <Body muted style={{ marginTop: space.lg }}>
              {s.noResults}
            </Body>
          )
        ) : (
          ORDER.map((cat, ci) => {
            const items = GUIDES.filter((g) => g.category === cat);
            if (items.length === 0) return null;
            return (
              <Reveal key={cat} index={ci + 3} style={{ marginTop: space.xl }}>
                <SectionLabel label={catLabel[cat]} tone={cat === 'emergency' ? 'signal' : 'muted'} style={{ marginBottom: space.xs }} />
                <List>
                  {items.map((g) => (
                    <GuideRow key={g.id} guide={g} />
                  ))}
                </List>
              </Reveal>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.xl, paddingBottom: TAB_BAR_HEIGHT },
  search: { marginTop: space.md, borderWidth: 1, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: 14, minHeight: 50 },
  searchInput: { ...font.body, flex: 1, fontSize: 15, paddingVertical: space.sm },
});
