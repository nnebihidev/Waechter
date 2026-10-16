import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { aiStore, generate, stopGeneration } from '../../ai/engine';
import { buildTranslationMessages } from '../../ai/prompts';
import { ModelGate } from '../../components/ModelGate';
import { TRANSLATION_LANGS, translationLangName, type TranslationLangCode } from '../../i18n/lang';
import { useLang, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { Button, Chip, ScreenHeader, SectionLabel } from '../../ui/components';
import { radius, space, type, useTheme } from '../../ui/theme';

const MAX_CHARS = 4000;

function LangRow({
  label,
  value,
  onChange,
  allowAuto,
}: {
  label: string;
  value: TranslationLangCode | 'auto';
  onChange: (v: TranslationLangCode | 'auto') => void;
  allowAuto?: boolean;
}) {
  const t = useTheme();
  const s = useT();
  const lang = useLang();
  return (
    <View style={{ gap: space.sm }}>
      <Text style={[type.footnote, { color: t.muted, fontWeight: '700' }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingRight: space.lg }}>
        {allowAuto ? <Chip label={s.autoDetect} icon="sparkles" active={value === 'auto'} onPress={() => onChange('auto')} /> : null}
        {TRANSLATION_LANGS.map((l) => (
          <Chip key={l.code} label={l[lang]} active={l.code === value} onPress={() => onChange(l.code)} />
        ))}
      </ScrollView>
    </View>
  );
}

function Translator() {
  const t = useTheme();
  const s = useT();
  const uiLang = useLang();
  const { busy } = useStore(aiStore);
  const [from, setFrom] = useState<TranslationLangCode | 'auto'>('auto');
  const [to, setTo] = useState<TranslationLangCode>(uiLang === 'de' ? 'en' : 'de');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!input.trim() || busy) return;
    setError(null);
    setCopied(false);
    setOutput('');
    try {
      const result = await generate(buildTranslationMessages(input.trim(), from, to), setOutput, {
        temperature: 0.2,
        maxTokens: Math.min(2048, Math.ceil(input.length / 2) + 128),
      });
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setCopied(false);
  };

  const swap = () => {
    if (from === 'auto') return;
    setFrom(to);
    setTo(from);
    if (output) {
      setInput(output);
      setOutput('');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <LangRow label={s.translateFrom} value={from} onChange={setFrom} allowAuto />
        <View style={styles.swapRow}>
          <View style={[styles.swapLine, { backgroundColor: t.divider }]} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={s.swap}
            disabled={from === 'auto'}
            onPress={swap}
            style={[styles.swap, { borderColor: t.border, backgroundColor: t.card, opacity: from === 'auto' ? 0.4 : 1 }]}
          >
            <Ionicons name="swap-vertical" size={20} color={t.primary} />
          </Pressable>
          <View style={[styles.swapLine, { backgroundColor: t.divider }]} />
        </View>
        <LangRow label={s.translateTo} value={to} onChange={(v) => v !== 'auto' && setTo(v)} />

        <View style={[styles.inputCard, { borderColor: t.border, backgroundColor: t.card }]}>
          <TextInput
            value={input}
            onChangeText={(v) => setInput(v.slice(0, MAX_CHARS))}
            placeholder={s.translatePlaceholder}
            placeholderTextColor={t.faint}
            multiline
            style={[styles.input, { color: t.text }]}
          />
          <View style={styles.inputFoot}>
            <Text style={[type.footnote, { color: t.faint, fontVariant: ['tabular-nums'], flex: 1 }]}>
              {input.length} / {MAX_CHARS} {s.characters}
            </Text>
            {input ? (
              <Pressable accessibilityRole="button" accessibilityLabel={s.clear} onPress={clear} hitSlop={10}>
                <Ionicons name="close-circle" size={22} color={t.faint} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.row}>
          {busy ? (
            <Button label={s.stop} icon="stop" variant="danger" onPress={() => void stopGeneration()} style={{ flex: 1 }} />
          ) : (
            <Button label={s.translate} icon="sparkles" onPress={() => void run()} disabled={!input.trim()} style={{ flex: 1 }} />
          )}
          <Button label={s.clear} icon="trash-outline" variant="outline" onPress={clear} disabled={!input || busy} style={{ flex: 1 }} />
        </View>

        {error ? <Text style={{ color: t.danger }}>{error}</Text> : null}

        {output || busy ? (
          <View style={{ gap: space.sm }}>
            <SectionLabel label={s.translationLabel} />
            <View style={[styles.result, { borderColor: t.primarySoft, backgroundColor: t.primarySofter }]}>
              <View style={styles.resultHead}>
                <Ionicons name="sparkles" size={16} color={t.accent} />
                <Text style={[type.footnote, { color: t.accent, fontWeight: '700', flex: 1 }]}>
                  {translationLangName(to, uiLang)}
                </Text>
                {busy ? <ActivityIndicator size="small" color={t.accent} /> : null}
              </View>
              <Text selectable style={[styles.resultText, { color: t.text }]}>
                {output || '…'}
              </Text>
              {output && !busy ? (
                <>
                  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.border }} />
                  <Pressable
                    accessibilityRole="button"
                    onPress={async () => {
                      await Clipboard.setStringAsync(output);
                      setCopied(true);
                    }}
                    style={styles.copy}
                  >
                    <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color={t.primary} />
                    <Text style={{ color: t.primary, fontWeight: '700' }}>{copied ? s.copied : s.copy}</Text>
                  </Pressable>
                </>
              ) : null}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function TranslateScreen() {
  const t = useTheme();
  const s = useT();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader title={s.tabTranslate} />
      <ModelGate>
        <Translator />
      </ModelGate>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md },
  swapRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  swapLine: { flex: 1, height: StyleSheet.hairlineWidth },
  swap: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  inputCard: { borderWidth: 1, borderRadius: radius.md, padding: space.lg, gap: space.sm },
  input: { minHeight: 110, fontSize: 20, lineHeight: 28, textAlignVertical: 'top', padding: 0 },
  inputFoot: { flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', gap: space.md },
  result: { borderWidth: 1, borderRadius: radius.md, padding: space.lg, gap: space.md },
  resultHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultText: { fontSize: 20, lineHeight: 28 },
  copy: { flexDirection: 'row', gap: 6, alignItems: 'center' },
});
