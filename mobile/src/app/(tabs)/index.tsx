import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { aiStore, ensureModel, generate, PROMPT_BUDGET_TOKENS, stopGeneration } from '../../ai/engine';
import { guardInput, guardOutput } from '../../ai/harness';
import { buildAssistantMessages, looksLikeEmergency, type ChatMessage } from '../../ai/prompts';
import { aiStatusLabel, ProgressRule } from '../../components/ModelGate';
import type { Lang } from '../../i18n/lang';
import { GUIDES, guideById } from '../../knowledge/guides';
import { indexFor, pickReferences } from '../../knowledge/search';
import { chatStore, nextId, updateEntry, type ChatEntry } from '../../state/chat';
import { useLang, useLegal, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { cardinal, normalizeHeading } from '../../tools/geo';
import { useSensors } from '../../tools/useSensors';
import { haptic, Markdown, ScrollToBottom, TypingDots, useSmoothText } from '../../ui/chat';
import { AlertBar, Body, Caret, Hero, Hud, Icon, Press, Reveal, Screen, SectionLabel, StatusStrip, Tile, callEmergency } from '../../ui/kit';
import { font, radius, space, type, useTheme } from '../../ui/theme';

async function send(text: string, lang: Lang, errorText: string) {
  const question = text.trim();
  if (!question || aiStore.get().busy) return;
  void haptic.send();
  const history: ChatMessage[] = chatStore
    .get()
    .entries.filter((e) => !e.failed)
    .map((e) => ({ role: e.role, content: e.content }));
  const verdict = guardInput(question, lang);
  // Guides only ground emergency and everyday turns; a person in crisis must not get first-aid chips.
  // Short emergency phrases score low, everyday chatter must clear a higher bar to avoid stray matches.
  const references =
    verdict.intent === 'emergency'
      ? pickReferences(indexFor(GUIDES, lang).search(question), 2, 2)
      : verdict.intent === 'everyday'
        ? pickReferences(indexFor(GUIDES, lang).search(question), 2, 4.5)
        : [];
  const user: ChatEntry = { id: nextId(), role: 'user', content: question, emergency: looksLikeEmergency(question) };
  const answer: ChatEntry = { id: nextId(), role: 'assistant', content: verdict.reply ?? verdict.preamble ?? '', streaming: !verdict.reply, sources: references.map((g) => g.id) };
  chatStore.set((s) => ({ entries: [...s.entries, user, answer], draft: '' }));
  // Blocked intents never reach the model.
  if (verdict.reply) {
    void haptic.warn();
    return;
  }
  const prefix = verdict.preamble ? `${verdict.preamble}\n\n` : '';
  const messages = buildAssistantMessages({ lang, history, userText: question, references, budgetTokens: PROMPT_BUDGET_TOKENS, intent: verdict.intent });
  try {
    const final = await generate(messages, (partial) => updateEntry(answer.id, { content: prefix + partial }), {
      temperature: verdict.intent === 'story' ? 0.8 : verdict.intent === 'crisis' || verdict.intent === 'companion' ? 0.5 : 0.6,
    });
    updateEntry(answer.id, { content: prefix + guardOutput(final, lang), streaming: false });
    void haptic.done();
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    updateEntry(answer.id, { content: `${errorText}: ${reason}`, streaming: false, failed: true });
  }
}

const Message = memo(function Message({ entry, lang }: { entry: ChatEntry; lang: Lang }) {
  const t = useTheme();
  const s = useT();
  const mine = entry.role === 'user';
  const shown = useSmoothText(entry.content, !!entry.streaming);
  const pending = !!entry.streaming && shown.length === 0;
  return (
    <Animated.View entering={FadeInDown.duration(240)} layout={LinearTransition.duration(180)} style={styles.msg}>
      <View style={[styles.msgRule, { backgroundColor: mine ? t.line : t.signal }]} />
      <View style={{ flex: 1, gap: space.sm }}>
        <Text style={[type.labelSmall, { color: mine ? t.dim : t.signal }]}>{mine ? s.you : pending ? s.thinking : 'Kompass'}</Text>
        {mine ? (
          <Text selectable style={[type.headline, { color: t.text }]}>
            {entry.content}
          </Text>
        ) : pending ? (
          <TypingDots />
        ) : (
          <Markdown text={shown} color={entry.failed ? t.signal : t.text} trailing={entry.streaming ? <Caret color={t.signal} /> : undefined} />
        )}
        {mine && entry.emergency ? <AlertBar text={s.emergencyCallTitle} /> : null}
        {!mine && entry.sources && entry.sources.length > 0 && !entry.streaming ? (
          <View style={styles.sources}>
            <Text style={[type.labelSmall, { color: t.dim }]}>{s.basedOn}</Text>
            {entry.sources.map((id) => {
              const g = guideById(id);
              return g ? (
                <Press key={id} accessibilityRole="link" onPress={() => router.push({ pathname: '/guide/[id]', params: { id } })} scaleTo={0.96} style={[styles.sourceChip, { borderColor: t.signal }]}>
                  <Icon name={g.icon} size={13} color={t.signal} strokeWidth={2} />
                  <Text style={[type.labelSmall, { color: t.signal, flexShrink: 1 }]}>{g.content[lang].title}</Text>
                </Press>
              ) : null;
            })}
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
});

function Composer({ onSubmit }: { onSubmit: (text: string) => void }) {
  const t = useTheme();
  const s = useT();
  const ai = useStore(aiStore);
  const { entries, draft } = useStore(chatStore);
  const ready = ai.status === 'ready';
  const canSend = ready && draft.trim().length > 0 && !ai.busy;
  return (
    <View style={styles.composerWrap}>
      {!ready ? (
        <Press accessibilityRole="button" onPress={() => (ai.status === 'missing' || ai.status === 'error' ? router.navigate('/settings') : undefined)} style={{ marginBottom: space.sm }}>
          <Text style={[type.labelSmall, { color: t.signal }]}>
            {ai.status === 'missing' ? s.modelMissingTitle : ai.status === 'error' ? s.modelError : ai.status === 'unpacking' ? s.modelUnpacking : s.modelLoading}
            {ai.progress > 0 && ai.progress < 1 ? `  ${Math.round(ai.progress * 100)}%` : ''}
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
          <Press accessibilityRole="button" accessibilityLabel={s.send} disabled={!canSend} onPress={() => onSubmit(draft)} style={[styles.square, { backgroundColor: canSend ? t.signal : 'transparent', borderColor: canSend ? t.signal : t.line }]}>
            <Icon name="arrowUp" size={18} color={canSend ? t.onSignal : t.dim} strokeWidth={2.2} />
          </Press>
        )}
      </View>
    </View>
  );
}

function Home({ submit }: { submit: (text: string) => void }) {
  const s = useT();
  const lang = useLang();
  const { degrees, position } = useSensors();
  const coords = position?.coords;
  const hero = s.heroLines.split('|');
  return (
    <ScrollView contentContainerStyle={styles.home} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
          <Tile
            title={s.tileLost}
            caption={s.tileLostSub}
            icon="mountain"
            onPress={() => {
              void haptic.tap();
              router.push({ pathname: '/guide/[id]', params: { id: 'lost' } });
            }}
          />
          <Tile
            title={s.tileInjured}
            caption={s.tileInjuredSub}
            icon="heartPulse"
            onPress={() => {
              void haptic.tap();
              router.navigate('/guides');
            }}
          />
          <Tile title={s.tileTalk} caption={s.tileTalkSub} icon="chat" onPress={() => submit(s.talkPrompt)} />
          <Tile title={s.tileStory} caption={s.tileStorySub} icon="book" onPress={() => submit(s.storyPrompt)} />
          <Tile
            title={s.tileTranslate}
            caption={s.tileTranslateSub}
            icon="translate"
            onPress={() => {
              void haptic.tap();
              router.navigate('/translate');
            }}
          />
        </View>
      </Reveal>
    </ScrollView>
  );
}

function Chat({ entries, lang }: { entries: ChatEntry[]; lang: Lang }) {
  const t = useTheme();
  const s = useT();
  const l = useLegal();
  const ai = useStore(aiStore);
  const list = useRef<FlashListRef<ChatEntry>>(null);
  const [away, setAway] = useState(false);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setAway(contentSize.height - (contentOffset.y + layoutMeasurement.height) > 160);
  }, []);

  const renderItem = useCallback(({ item }: { item: ChatEntry }) => <Message entry={item} lang={lang} />, [lang]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.chatHead}>
        <Text style={[type.display, { color: t.text }]}>{s.tabAssistant}</Text>
        {!ai.busy ? (
          <Press
            accessibilityRole="button"
            accessibilityLabel={s.newChat}
            onPress={() => {
              void haptic.tap();
              chatStore.set({ entries: [] });
            }}
            style={[styles.square, { borderColor: t.line }]}
          >
            <Icon name="compose" size={18} color={t.text} />
          </Press>
        ) : null}
      </View>
      <FlashList
        ref={list}
        data={entries}
        renderItem={renderItem}
        keyExtractor={(e) => e.id}
        extraData={lang}
        onScroll={onScroll}
        scrollEventThrottle={48}
        maintainVisibleContentPosition={{ autoscrollToBottomThreshold: 0.25, startRenderingFromBottom: true, animateAutoScrollToBottom: true }}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<Text style={[type.footnote, { color: t.dim, marginTop: space.md }]}>{l.aiNotice}</Text>}
      />
      <ScrollToBottom visible={away} label={s.jumpToLatest} onPress={() => list.current?.scrollToEnd({ animated: true })} />
    </View>
  );
}

export default function HomeScreen() {
  const s = useT();
  const lang = useLang();
  const ai = useStore(aiStore);
  const { entries } = useStore(chatStore);
  const { position } = useSensors();
  const coords = position?.coords;

  useEffect(() => {
    void ensureModel();
  }, []);

  const submit = useCallback((text: string) => void send(text, lang, s.modelError), [lang, s.modelError]);

  return (
    <Screen>
      <StatusStrip
        left={aiStatusLabel(ai, s)}
        rightStrong={coords ? `${coords.latitude.toFixed(2)}° ${coords.latitude >= 0 ? 'N' : 'S'}` : undefined}
        right={coords ? `${Math.abs(coords.longitude).toFixed(2)}° ${coords.longitude >= 0 ? (lang === 'de' ? 'O' : 'E') : 'W'}` : undefined}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
        {entries.length === 0 ? <Home submit={submit} /> : <Chat entries={entries} lang={lang} />}
        <Composer onSubmit={submit} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  home: { paddingHorizontal: space.xl, paddingBottom: space.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chatHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xl, marginTop: space.lg, marginBottom: space.sm },
  list: { paddingHorizontal: space.xl, paddingBottom: space.lg },
  msg: { flexDirection: 'row', gap: 14, paddingVertical: space.md },
  msgRule: { width: 2, borderRadius: 1 },
  sources: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, alignItems: 'center', marginTop: space.xs },
  sourceChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6, flexShrink: 1 },
  composerWrap: { paddingHorizontal: space.xl, paddingTop: space.sm, paddingBottom: space.md },
  composer: { minHeight: 58, borderWidth: 1, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 16, paddingRight: 10 },
  input: { ...font.body, flex: 1, fontSize: 16, maxHeight: 120, paddingVertical: 14 },
  square: { width: 38, height: 38, borderWidth: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
});
