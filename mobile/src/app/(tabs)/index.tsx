import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { aiStore, generate, PROMPT_BUDGET_TOKENS, stopGeneration } from '../../ai/engine';
import { buildAssistantMessages, looksLikeEmergency, plainifyMarkdown, type ChatMessage } from '../../ai/prompts';
import { ModelGate } from '../../components/ModelGate';
import { GUIDES, guideById } from '../../knowledge/guides';
import { indexFor, pickReferences } from '../../knowledge/search';
import { chatStore, nextId, updateEntry, type ChatEntry } from '../../state/chat';
import { useLang, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { Body, EmergencyBanner } from '../../ui/components';
import { radius, space, useTheme } from '../../ui/theme';

async function send(text: string, lang: 'en' | 'de', errorText: string) {
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

function Bubble({ entry, lang }: { entry: ChatEntry; lang: 'en' | 'de' }) {
  const t = useTheme();
  const s = useT();
  const mine = entry.role === 'user';
  return (
    <View style={{ gap: space.sm }}>
      {entry.emergency ? (
        <EmergencyBanner text={s.emergencyBanner} onPress={() => router.navigate('/guides')} />
      ) : null}
      <View
        style={[
          styles.bubble,
          mine
            ? { alignSelf: 'flex-end', backgroundColor: t.userBubble }
            : { alignSelf: 'flex-start', backgroundColor: t.botBubble, borderColor: t.border, borderWidth: StyleSheet.hairlineWidth },
        ]}
      >
        <Text selectable style={[styles.bubbleText, { color: mine ? t.onUserBubble : entry.failed ? t.danger : t.text }]}>
          {mine ? entry.content : plainifyMarkdown(entry.content) || (entry.streaming ? '…' : '')}
        </Text>
      </View>
      {!mine && entry.sources && entry.sources.length > 0 && !entry.streaming ? (
        <View style={styles.sources}>
          <Text style={[styles.sourceLabel, { color: t.muted }]}>{s.basedOn}</Text>
          {entry.sources.map((id) => {
            const g = guideById(id);
            return g ? (
              <Pressable
                key={id}
                accessibilityRole="link"
                onPress={() => router.push({ pathname: '/guide/[id]', params: { id } })}
                style={[styles.chip, { borderColor: t.primary }]}
              >
                <Text style={{ color: t.primary, fontSize: 13, fontWeight: '600' }}>{g.content[lang].title}</Text>
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scroll}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      >
        {entries.length === 0 ? (
          <View style={{ gap: space.md }}>
            <Body muted>{s.assistantEmpty}</Body>
            {s.assistantSuggestions.map((q) => (
              <Pressable
                key={q}
                onPress={() => submit(q)}
                style={[styles.suggestion, { backgroundColor: t.card, borderColor: t.border }]}
              >
                <Text style={{ color: t.text, fontSize: 15 }}>{q}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          entries.map((e) => <Bubble key={e.id} entry={e} lang={lang} />)
        )}
        {entries.length > 0 ? (
          <Text style={[styles.disclaimer, { color: t.muted }]}>{s.aiDisclaimer}</Text>
        ) : null}
      </ScrollView>

      <View style={[styles.composer, { backgroundColor: t.card, borderTopColor: t.border }]}>
        {entries.length > 0 && !busy ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={s.newChat}
            onPress={() => chatStore.set({ entries: [] })}
            style={styles.iconButton}
          >
            <Ionicons name="add-circle-outline" size={28} color={t.muted} />
          </Pressable>
        ) : null}
        <TextInput
          value={draft}
          onChangeText={(v) => chatStore.set({ draft: v })}
          placeholder={s.assistantPlaceholder}
          placeholderTextColor={t.muted}
          multiline
          style={[styles.input, { color: t.text, borderColor: t.border, backgroundColor: t.bg }]}
        />
        {busy ? (
          <Pressable accessibilityRole="button" accessibilityLabel={s.stop} onPress={() => void stopGeneration()} style={styles.iconButton}>
            <Ionicons name="stop-circle" size={34} color={t.danger} />
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={s.send}
            disabled={!draft.trim()}
            onPress={() => submit(draft)}
            style={[styles.iconButton, { opacity: draft.trim() ? 1 : 0.4 }]}
          >
            <Ionicons name="arrow-up-circle" size={34} color={t.primary} />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default function AssistantScreen() {
  const t = useTheme();
  const s = useT();
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.offline, { backgroundColor: t.card, borderBottomColor: t.border }]}>
        <Ionicons name="airplane" size={14} color={t.primary} />
        <Text style={{ color: t.muted, fontSize: 12 }}>{s.offlineBadge}</Text>
      </View>
      <ModelGate>
        <Chat />
      </ModelGate>
    </View>
  );
}

const styles = StyleSheet.create({
  offline: {
    flexDirection: 'row',
    gap: space.xs,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: { padding: space.lg, gap: space.md },
  bubble: { maxWidth: '88%', borderRadius: radius.lg, paddingHorizontal: space.md, paddingVertical: space.sm + 2 },
  bubbleText: { fontSize: 16, lineHeight: 23 },
  sources: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, alignItems: 'center' },
  sourceLabel: { fontSize: 13 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: space.sm, paddingVertical: 3 },
  suggestion: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: space.md },
  disclaimer: { fontSize: 12, textAlign: 'center', marginTop: space.sm },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.sm,
    padding: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingTop: 11,
    paddingBottom: 11,
    fontSize: 16,
  },
  iconButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
