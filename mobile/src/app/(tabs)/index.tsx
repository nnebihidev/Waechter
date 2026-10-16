import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
import { BrandMark, Card, EmergencyCallCard, IconCircle, ScreenHeader, type IconName } from '../../ui/components';
import { radius, space, type, useTheme } from '../../ui/theme';

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

  const messages = buildAssistantMessages({
    lang,
    history,
    userText: question,
    references,
    budgetTokens: PROMPT_BUDGET_TOKENS,
  });
  try {
    const final = await generate(messages, (partial) => updateEntry(answer.id, { content: partial }));
    updateEntry(answer.id, { content: final, streaming: false });
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    updateEntry(answer.id, { content: `${errorText}: ${reason}`, streaming: false, failed: true });
  }
}

function UserMessage({ entry }: { entry: ChatEntry }) {
  const t = useTheme();
  const s = useT();
  return (
    <View style={{ gap: space.md }}>
      <View style={[styles.userBubble, { backgroundColor: t.userBubble }]}>
        <Text selectable style={[type.body, { color: t.onUserBubble }]}>
          {entry.content}
        </Text>
      </View>
      {entry.emergency ? (
        <EmergencyCallCard title={s.emergencyCallTitle} subtitle={s.emergencyCallBody} callLabel={s.callLabel} />
      ) : null}
    </View>
  );
}

function AssistantMessage({ entry, lang }: { entry: ChatEntry; lang: Lang }) {
  const t = useTheme();
  const s = useT();
  const text = plainifyMarkdown(entry.content);
  return (
    <View style={{ gap: space.sm }}>
      <Card style={styles.answer}>
        <View style={styles.answerHead}>
          <BrandMark size={18} />
          <Text style={[type.footnote, { color: t.primary, fontWeight: '700' }]}>Kompass</Text>
          {entry.streaming ? <ActivityIndicator size="small" color={t.accent} /> : null}
        </View>
        {text ? (
          <Text selectable style={[type.body, { color: entry.failed ? t.danger : t.text }]}>
            {text}
          </Text>
        ) : (
          <Text style={[type.body, { color: t.faint }]}>…</Text>
        )}
      </Card>
      {entry.sources && entry.sources.length > 0 && !entry.streaming ? (
        <View style={styles.sources}>
          <Text style={[type.footnote, { color: t.muted }]}>{s.basedOn}</Text>
          {entry.sources.map((id) => {
            const g = guideById(id);
            return g ? (
              <Pressable
                key={id}
                accessibilityRole="link"
                onPress={() => router.push({ pathname: '/guide/[id]', params: { id } })}
                style={({ pressed }) => [styles.sourceChip, { borderColor: t.primary, backgroundColor: pressed ? t.primarySoft : t.card }]}
              >
                <Ionicons name={g.icon as IconName} size={14} color={t.primary} />
                <Text style={{ color: t.primary, fontSize: 13, fontWeight: '700' }}>{g.content[lang].title}</Text>
              </Pressable>
            ) : null;
          })}
        </View>
      ) : null}
    </View>
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
      >
        {entries.length === 0 ? (
          <View style={{ gap: space.md }}>
            <Text style={[type.body, { color: t.muted }]}>{s.assistantGreeting}</Text>
            {SUGGESTIONS[lang].map((q) => (
              <Pressable
                key={q.title}
                accessibilityRole="button"
                onPress={() => submit(q.prompt)}
                style={({ pressed }) => [
                  styles.suggestion,
                  { backgroundColor: pressed ? t.primarySofter : t.card, borderColor: t.border },
                ]}
              >
                <IconCircle name={q.icon as IconName} size={48} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[type.headline, { color: t.text, fontSize: 16 }]}>{q.title}</Text>
                  <Text style={[type.footnote, { color: t.muted }]}>{q.detail}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={t.faint} />
              </Pressable>
            ))}
          </View>
        ) : (
          entries.map((e) =>
            e.role === 'user' ? <UserMessage key={e.id} entry={e} /> : <AssistantMessage key={e.id} entry={e} lang={lang} />,
          )
        )}
        {entries.length > 0 ? (
          <View style={styles.disclaimer}>
            <Ionicons name="shield-checkmark-outline" size={14} color={t.faint} />
            <Text style={[type.footnote, { color: t.faint, flex: 1 }]}>{s.aiDisclaimer}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.composerWrap, { backgroundColor: t.bg }]}>
        <View style={[styles.composer, { backgroundColor: t.card, borderColor: t.border }]}>
          <TextInput
            value={draft}
            onChangeText={(v) => chatStore.set({ draft: v })}
            placeholder={s.assistantPlaceholder}
            placeholderTextColor={t.faint}
            multiline
            style={[styles.input, { color: t.text }]}
          />
          <View style={styles.composerFoot}>
            <Ionicons name="leaf-outline" size={16} color={t.accent} />
            <Text style={[type.footnote, { color: t.muted, flex: 1 }]}>{s.onDevice}</Text>
            {busy ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={s.stop}
                onPress={() => void stopGeneration()}
                style={[styles.stop, { backgroundColor: t.dangerFill }]}
              >
                <Ionicons name="stop" size={14} color={t.onDanger} />
                <Text style={{ color: t.onDanger, fontWeight: '700' }}>{s.stop}</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={s.send}
                disabled={!canSend}
                onPress={() => submit(draft)}
                style={[styles.send, { backgroundColor: canSend ? t.primary : t.divider }]}
              >
                <Ionicons name="arrow-up" size={22} color={canSend ? t.onPrimary : t.faint} />
              </Pressable>
            )}
          </View>
        </View>
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
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader
        title={s.tabAssistant}
        right={
          entries.length > 0 && !busy ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={s.newChat}
              onPress={() => chatStore.set({ entries: [] })}
              style={[styles.headerButton, { borderColor: t.border, backgroundColor: t.card }]}
            >
              <Ionicons name="create-outline" size={20} color={t.primary} />
            </Pressable>
          ) : null
        }
      />
      <View style={[styles.offline, { backgroundColor: t.primarySoft }]}>
        <Ionicons name="airplane" size={16} color={t.primary} />
        <Text style={[type.footnote, { color: t.primary, fontWeight: '600' }]}>{s.offlineBadge}</Text>
      </View>
      <ModelGate>
        <Chat />
      </ModelGate>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offline: {
    flexDirection: 'row',
    gap: space.sm,
    alignItems: 'center',
    marginHorizontal: space.lg,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    borderRadius: radius.sm,
  },
  list: { padding: space.lg, gap: space.lg },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: space.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    borderRadius: radius.lg,
    borderBottomRightRadius: 6,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  answer: { gap: space.sm, maxWidth: '96%' },
  answerHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sources: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, alignItems: 'center' },
  sourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: 6,
  },
  disclaimer: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: space.sm },
  composerWrap: { paddingHorizontal: space.md, paddingTop: space.xs, paddingBottom: space.sm },
  composer: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, paddingHorizontal: space.md, paddingTop: space.sm },
  input: { minHeight: 44, maxHeight: 140, fontSize: 16, paddingVertical: space.sm },
  composerFoot: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: space.sm, paddingTop: space.xs },
  send: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  stop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    height: 40,
  },
});
