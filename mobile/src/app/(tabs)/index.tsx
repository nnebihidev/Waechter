import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { aiStore, ensureModel, generate, PROMPT_BUDGET_TOKENS, stopGeneration } from '../../ai/engine';
import { buildAssistantMessages, looksLikeEmergency, plainifyMarkdown, type ChatMessage } from '../../ai/prompts';
import { aiStatusLabel, ProgressRule } from '../../components/ModelGate';
import type { Lang } from '../../i18n/lang';
import { GUIDES, guideById } from '../../knowledge/guides';
import { indexFor, pickReferences } from '../../knowledge/search';
import { chatStore, nextId, updateEntry, type ChatEntry } from '../../state/chat';
import { useLang, useLegal, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { cardinal, normalizeHeading } from '../../tools/geo';
import { useSensors } from '../../tools/useSensors';
import { AlertBar, Body, Caret, Hero, Hud, Icon, Press, Reveal, Screen, SectionLabel, StatusStrip, Tile, callEmergency } from '../../ui/kit';
import { font, radius, space, type, useTheme } from '../../ui/theme';

async function send(text: string, lang: Lang, errorText: string) {
  const question = text.trim();
  if (!question || aiStore.get().busy) return;
  const history: ChatMessage[] = chatStore
    .get()
    .entries.filter((e) => !e.failed)
    .map((e) => ({ role: e.role, content: e.content }));
  const references = pickReferences(indexFor(GUIDES, lang).search(question));
  const user: ChatEntry = { id: nextId(), role: 'user', content: question, emergency: looksLikeEmergency(question) };
  const answer: ChatEntry = { id: nextId(), role: 'assistant', content: '', streaming: true, sources: references.map((g) => g.id) };
  chatStore.set((s) => ({ entries: [...s.entries, user, answer], draft: '' }));
  const messages = buildAssistantMessages({ lang, history, userText: question, references, budgetTokens: PROMPT_BUDGET_TOKENS });
  try {
    const final = await generate(messages, (partial) => updateEntry(answer.id, { content: partial }));
    updateEntry(answer.id, { content: final, streaming: false });
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    updateEntry(answer.id, { content: `${errorText}: ${reason}`, streaming: false, failed: true });
  }
}

function Message({ entry, lang }: { entry: ChatEntry; lang: Lang }) {
  const t = useTheme();
  const s = useT();
  const mine = entry.role === 'user';
  return (
    <Reveal style={styles.msg}>
      <View style={[styles.msgRule, { backgroundColor: mine ? t.line : t.signal }]} />
      <View style={{ flex: 1, gap: space.sm }}>
        <Text style={[type.labelSmall, { color: mine ? t.dim : t.signal }]}>{mine ? s.you : 'Kompass'}</Text>
        <Text selectable style={[mine ? type.headline : type.body, { color: entry.failed ? t.signal : t.text }]}>
          {mine ? entry.content : plainifyMarkdown(entry.content)}
          {entry.streaming ? <Caret color={t.signal} /> : null}
        </Text>
        {mine && entry.emergency ? <AlertBar text={s.emergencyCallTitle} /> : null}
        {!mine && entry.sources && entry.sources.length > 0 && !entry.streaming ? (
          <View style={styles.sources}>
            <Text style={[type.labelSmall, { color: t.dim }]}>{s.basedOn}</Text>
            {entry.sources.map((id) => {
              const g = guideById(id);
              return g ? (
                <Press key={id} accessibilityRole="link" onPress={() => router.push({ pathname: '/guide/[id]', params: { id } })} scaleTo={0.96} style={[styles.sourceChip, { borderColor: t.signal }]}>
                  <Icon name={g.icon} size={13} color={t.signal} strokeWidth={2} />
                  <Text style={[type.labelSmall, { color: t.signal }]}>{g.content[lang].title}</Text>
                </Press>
              ) : null;
            })}
          </View>
        ) : null}
      </View>
    </Reveal>
  );
}

export default function HomeScreen() {
  const t = useTheme();
  const s = useT();
  const l = useLegal();
  const lang = useLang();
  const ai = useStore(aiStore);
  const { entries, draft } = useStore(chatStore);
  const { degrees, position } = useSensors();
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    void ensureModel();
  }, []);

  const ready = ai.status === 'ready';
  const canSend = ready && draft.trim().length > 0 && !ai.busy;
  const submit = (text: string) => void send(text, lang, s.modelError);
  const coords = position?.coords;
  const hero = s.heroLines.split('|');

  return (
    <Screen>
      <StatusStrip
        left={aiStatusLabel(ai, s)}
        rightStrong={coords ? `${coords.latitude.toFixed(2)}° ${coords.latitude >= 0 ? 'N' : 'S'}` : undefined}
        right={coords ? `${Math.abs(coords.longitude).toFixed(2)}° ${coords.longitude >= 0 ? (lang === 'de' ? 'O' : 'E') : 'W'}` : undefined}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scroll}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => entries.length > 0 && scroll.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {entries.length === 0 ? (
            <>
              <Reveal>
                <Hero lines={hero} accent={1} style={{ marginTop: space.xxl }} />
                <Body muted style={{ marginTop: space.md, maxWidth: 300 }}>
                  {s.heroSub}
                </Body>
              </Reveal>
              <Reveal index={1} style={{ marginTop: space.xl }}>
                <Hud
                  cells={[
                    { value: degrees == null ? '—' : `${Math.round(normalizeHeading(degrees))}°`, unit: degrees == null ? undefined : cardinal(degrees, lang), label: s.hudHeading },
                    { value: coords?.altitude != null ? Math.round(coords.altitude).toLocaleString(lang) : '—', unit: coords?.altitude != null ? 'm' : undefined, label: s.hudAltitude },
                    { value: coords ? `±${Math.round(coords.accuracy ?? 0)}` : '—', unit: coords ? 'm' : undefined, label: s.hudGps },
                  ]}
                />
              </Reveal>
              <Reveal index={2}>
                <SectionLabel label={s.scenarios} style={{ marginTop: space.xl, marginBottom: space.md }} />
                <View style={styles.grid}>
                  <Tile title={s.tileEmergency} caption={s.tileEmergencySub} icon="phone" signal onPress={() => callEmergency()} />
                  <Tile title={s.tileLost} caption={s.tileLostSub} icon="mountain" onPress={() => router.push({ pathname: '/guide/[id]', params: { id: 'lost' } })} />
                  <Tile title={s.tileInjured} caption={s.tileInjuredSub} icon="heartPulse" onPress={() => router.navigate('/guides')} />
                  <Tile title={s.tileTranslate} caption={s.tileTranslateSub} icon="translate" onPress={() => router.navigate('/translate')} />
                </View>
              </Reveal>
            </>
          ) : (
            <>
              <View style={styles.chatHead}>
                <Text style={[type.display, { color: t.text }]}>{s.tabAssistant}</Text>
                {!ai.busy ? (
                  <Press accessibilityRole="button" accessibilityLabel={s.newChat} onPress={() => chatStore.set({ entries: [] })} style={[styles.square, { borderColor: t.line }]}>
                    <Icon name="compose" size={18} color={t.text} />
                  </Press>
                ) : null}
              </View>
              {entries.map((e) => (
                <Message key={e.id} entry={e} lang={lang} />
              ))}
              <Text style={[type.footnote, { color: t.dim, marginTop: space.sm }]}>{l.aiNotice}</Text>
            </>
          )}
        </ScrollView>

        <View style={styles.composerWrap}>
          {!ready ? (
            <Press accessibilityRole="button" onPress={() => (ai.status === 'missing' || ai.status === 'error' ? router.navigate('/settings') : undefined)} style={{ marginBottom: space.sm }}>
              <Text style={[type.labelSmall, { color: t.signal }]}>
                {ai.status === 'missing' ? s.modelMissingTitle : ai.status === 'error' ? s.modelError : ai.status === 'unpacking' ? s.modelUnpacking : s.modelLoading}
                {ai.progress > 0 && ai.progress < 1 && ai.status !== 'ready' ? `  ${Math.round(ai.progress * 100)}%` : ''}
              </Text>
              {ai.status === 'loading' || ai.status === 'unpacking' ? <ProgressRule value={ai.progress} /> : null}
            </Press>
          ) : null}
          <View style={[styles.composer, { backgroundColor: t.surface, borderColor: t.line }]}>
            <Text style={[font.display, { color: t.signal, fontSize: 24, lineHeight: 26 }]}>›</Text>
            <TextInput
              value={draft}
              onChangeText={(v) => chatStore.set({ draft: v })}
              placeholder={entries.length === 0 ? s.promptShort : s.assistantPlaceholder}
              placeholderTextColor={t.dim}
              multiline
              editable={ready}
              style={[styles.input, { color: t.text }]}
            />
            {ai.busy ? (
              <Press accessibilityRole="button" accessibilityLabel={s.stop} onPress={() => void stopGeneration()} style={[styles.square, { backgroundColor: t.signal, borderColor: t.signal }]}>
                <Icon name="stop" size={14} color={t.onSignal} />
              </Press>
            ) : (
              <Press accessibilityRole="button" accessibilityLabel={s.send} disabled={!canSend} onPress={() => submit(draft)} style={[styles.square, { backgroundColor: canSend ? t.signal : 'transparent', borderColor: canSend ? t.signal : t.line }]}>
                <Icon name="arrowUp" size={18} color={canSend ? t.onSignal : t.dim} strokeWidth={2.2} />
              </Press>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: space.xl, paddingBottom: space.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chatHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.lg, marginBottom: space.lg },
  msg: { flexDirection: 'row', gap: 14, paddingVertical: space.md },
  msgRule: { width: 2, borderRadius: 1 },
  sources: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, alignItems: 'center', marginTop: space.xs },
  sourceChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6 },
  composerWrap: { paddingHorizontal: space.xl, paddingTop: space.sm, paddingBottom: space.md },
  composer: { minHeight: 58, borderWidth: 1, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 16, paddingRight: 10 },
  input: { ...font.body, flex: 1, fontSize: 16, maxHeight: 120, paddingVertical: 14 },
  square: { width: 38, height: 38, borderWidth: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
});

