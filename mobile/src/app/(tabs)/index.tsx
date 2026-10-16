import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { aiStore, generate, PROMPT_BUDGET_TOKENS, stopGeneration } from '../../ai/engine';
import { buildAssistantMessages, looksLikeEmergency, plainifyMarkdown, type ChatMessage } from '../../ai/prompts';
import { ModelGate } from '../../components/ModelGate';
import type { Lang } from '../../i18n/lang';
import { SUGGESTIONS } from '../../i18n/strings';
import { GUIDES, guideById } from '../../knowledge/guides';
import { indexFor, pickReferences } from '../../knowledge/search';
import { chatStore, nextId, updateEntry, type ChatEntry } from '../../state/chat';
import { useLang, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { BrandMark, EmergencyCallCard, Glass, Icon, IconBadge, Press, Reveal, ScreenHeader, Screen } from '../../ui/components';
import { font, radius, space, TAB_BAR_SPACE, type, useTheme } from '../../ui/theme';

async function send(text: string, lang: Lang, errorText: string) {
  const question = text.trim();
  if (!question || aiStore.get().busy) return;

  const history: ChatMessage[] = chatStore
    .get()
    .entries.filter((e) => !e.failed)
    .map((e) => ({ role: e.role, content: e.content }));
  const references = pickReferences(indexFor(GUIDES, lang).search(question));
  const user: ChatEntry = { id: nextId(), role: 'user', content: question, emergency: looksLikeEmergency(question) };
  const answer: ChatEntry = {
    id: nextId(),
    role: 'assistant',
    content: '',
    streaming: true,
    sources: references.map((g) => g.id),
  };
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

/** Blinking caret shown while the answer streams. */
function Caret() {
  const t = useTheme();
  const o = useSharedValue(1);
  useEffect(() => {
    o.value = withRepeat(withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[styles.caret, { backgroundColor: t.primary }, style]} />;
}

function UserMessage({ entry }: { entry: ChatEntry }) {
  const t = useTheme();
  const s = useT();
  return (
    <Reveal style={{ gap: space.md }}>
      <View style={[styles.userBubble, { backgroundColor: t.userBubble, borderColor: t.glassBorder }]}>
        <Text selectable style={[type.body, { color: t.text }]}>
          {entry.content}
        </Text>
      </View>
      {entry.emergency ? <EmergencyCallCard title={s.emergencyCallTitle} subtitle={s.emergencyCallBody} callLabel={s.callLabel} /> : null}
    </Reveal>
  );
}

function AssistantMessage({ entry, lang }: { entry: ChatEntry; lang: Lang }) {
  const t = useTheme();
  const s = useT();
  const text = plainifyMarkdown(entry.content);
  return (
    <Reveal style={{ gap: space.sm }}>
      <Glass radiusSize="lg" style={{ maxWidth: '94%' }}>
        <View style={styles.answer}>
          <View style={styles.answerHead}>
            <BrandMark size={18} ring={false} />
            <Text style={[type.caption, { color: t.primary, letterSpacing: 1.5, textTransform: 'uppercase' }]}>Kompass</Text>
          </View>
          <Text selectable style={[type.body, { color: entry.failed ? t.danger : t.text }]}>
            {text}
            {entry.streaming ? ' ' : ''}
            {entry.streaming ? <Caret /> : null}
          </Text>
        </View>
      </Glass>
      {entry.sources && entry.sources.length > 0 && !entry.streaming ? (
        <View style={styles.sources}>
          <Text style={[type.footnote, { color: t.muted }]}>{s.basedOn}</Text>
          {entry.sources.map((id) => {
            const g = guideById(id);
            return g ? (
              <Press key={id} accessibilityRole="link" onPress={() => router.push({ pathname: '/guide/[id]', params: { id } })} scaleTo={0.95}>
                <Glass radiusSize="pill">
                  <View style={styles.sourceChip}>
                    <Icon name={g.icon} size={14} color={t.primary} strokeWidth={2} />
                    <Text style={[font.bold, { color: t.primary, fontSize: 13 }]}>{g.content[lang].title}</Text>
                  </View>
                </Glass>
              </Press>
            ) : null;
          })}
        </View>
      ) : null}
    </Reveal>
  );
}

function Chat() {
  const t = useTheme();
  const s = useT();
  const lang = useLang();
  const { entries, draft } = useStore(chatStore);
  const { busy } = useStore(aiStore);
  const scroll = useRef<ScrollView>(null);
  const submit = (text: string) => void send(text, lang, s.modelError);
  const canSend = draft.trim().length > 0;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scroll}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => entries.length > 0 && scroll.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {entries.length === 0 ? (
          <View style={{ gap: space.md }}>
            <Reveal>
              <Text style={[type.body, { color: t.muted, paddingHorizontal: space.xs }]}>{s.assistantGreeting}</Text>
            </Reveal>
            {SUGGESTIONS[lang].map((q, i) => (
              <Reveal key={q.title} index={i + 1}>
                <Press accessibilityRole="button" onPress={() => submit(q.prompt)}>
                  <Glass radiusSize="lg">
                    <View style={styles.suggestion}>
                      <IconBadge name={q.icon} size={48} tone={i === 1 ? 'amber' : 'soft'} />
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={[type.headline, { color: t.text, fontSize: 16 }]}>{q.title}</Text>
                        <Text style={[type.footnote, { color: t.muted }]}>{q.detail}</Text>
                      </View>
                      <Icon name="chevronRight" size={18} color={t.faint} />
                    </View>
                  </Glass>
                </Press>
              </Reveal>
            ))}
          </View>
        ) : (
          entries.map((e) => (e.role === 'user' ? <UserMessage key={e.id} entry={e} /> : <AssistantMessage key={e.id} entry={e} lang={lang} />))
        )}
        {entries.length > 0 ? (
          <View style={styles.disclaimer}>
            <Icon name="shield" size={14} color={t.faint} />
            <Text style={[type.footnote, { color: t.faint, flex: 1 }]}>{s.aiDisclaimer}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.composerWrap}>
        <Glass radiusSize="xl" strong blur>
          <View style={styles.composer}>
            <TextInput
              value={draft}
              onChangeText={(v) => chatStore.set({ draft: v })}
              placeholder={s.assistantPlaceholder}
              placeholderTextColor={t.faint}
              multiline
              style={[styles.input, { color: t.text }]}
            />
            <View style={styles.composerFoot}>
              <Icon name="leaf" size={15} color={t.primary} />
              <Text style={[type.footnote, { color: t.muted, flex: 1 }]}>{s.onDevice}</Text>
              {busy ? (
                <Press accessibilityRole="button" accessibilityLabel={s.stop} onPress={() => void stopGeneration()} scaleTo={0.92}>
                  <LinearGradient colors={['#E8483A', '#C22D22']} style={styles.stop}>
                    <Icon name="stop" size={14} color="#fff" />
                    <Text style={[font.bold, { color: '#fff' }]}>{s.stop}</Text>
                  </LinearGradient>
                </Press>
              ) : (
                <Press accessibilityRole="button" accessibilityLabel={s.send} disabled={!canSend} onPress={() => submit(draft)} scaleTo={0.9}>
                  <LinearGradient
                    colors={canSend ? (t.scheme === 'dark' ? ['#5CE9AE', '#22B57E'] : ['#1F8F62', '#126244']) : [t.divider, t.divider]}
                    style={styles.send}
                  >
                    <Icon name="arrowUp" size={22} color={canSend ? t.onPrimary : t.faint} strokeWidth={2.2} />
                  </LinearGradient>
                </Press>
              )}
            </View>
          </View>
        </Glass>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function AssistantScreen() {
  const t = useTheme();
  const s = useT();
  const { entries } = useStore(chatStore);
  const { busy } = useStore(aiStore);
  return (
    <Screen>
      <ScreenHeader
        title={s.tabAssistant}
        right={
          entries.length > 0 && !busy ? (
            <Press accessibilityRole="button" accessibilityLabel={s.newChat} onPress={() => chatStore.set({ entries: [] })} scaleTo={0.9}>
              <Glass radiusSize="pill">
                <View style={styles.headerButton}>
                  <Icon name="compose" size={20} color={t.primary} />
                </View>
              </Glass>
            </Press>
          ) : null
        }
      />
      <View style={styles.offlineWrap}>
        <Glass radiusSize="pill">
          <View style={styles.offline}>
            <Icon name="cloudOff" size={16} color={t.primary} strokeWidth={2} />
            <Text style={[font.bold, { color: t.primary, fontSize: 13 }]}>{s.offlineBadge}</Text>
          </View>
        </Glass>
      </View>
      <ModelGate>
        <Chat />
      </ModelGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  offlineWrap: { paddingHorizontal: space.xl, alignItems: 'flex-start', marginTop: -space.sm, marginBottom: space.xs },
  offline: { flexDirection: 'row', gap: space.sm, alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  list: { padding: space.lg, gap: space.lg, paddingBottom: space.lg },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: 14 },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    borderRadius: radius.lg,
    borderBottomRightRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  answer: { padding: space.lg, gap: space.sm },
  answerHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  caret: { width: 3, height: 16, borderRadius: 2, marginLeft: 2, transform: [{ translateY: 2 }] },
  sources: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, alignItems: 'center' },
  sourceChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.md, paddingVertical: 7 },
  disclaimer: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: space.sm },
  composerWrap: { paddingHorizontal: space.md, paddingBottom: TAB_BAR_SPACE - 10 },
  composer: { paddingHorizontal: space.lg, paddingTop: space.sm },
  input: { ...font.medium, minHeight: 44, maxHeight: 140, fontSize: 16, paddingVertical: space.sm },
  composerFoot: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: space.sm, paddingTop: space.xs },
  send: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  stop: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: space.lg, height: 42 },
});
