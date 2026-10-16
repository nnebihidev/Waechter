import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { aiStore, generate, stopGeneration } from '../../ai/engine';
import { buildTranslationMessages } from '../../ai/prompts';
import { ModelGate } from '../../components/ModelGate';
import { TRANSLATION_LANGS, translationLangName, type TranslationLangCode } from '../../i18n/lang';
import { useLang, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { Button, Chip, Glass, Icon, Press, Reveal, ScreenHeader, SectionLabel, Screen } from '../../ui/components';
import { font, space, TAB_BAR_SPACE, type, useTheme } from '../../ui/theme';

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
      <Text style={[type.caption, { color: t.muted, paddingHorizontal: space.xl, letterSpacing: 1, textTransform: 'uppercase' }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.lg }}>
        {allowAuto ? <Chip label={s.autoDetect} icon="sparkle" active={value === 'auto'} onPress={() => onChange('auto')} /> : null}
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
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Reveal>
          <LangRow label={s.translateFrom} value={from} onChange={setFrom} allowAuto />
        </Reveal>
        <Reveal index={1} style={styles.swapRow}>
          <View style={[styles.swapLine, { backgroundColor: t.divider }]} />
          <Press accessibilityRole="button" accessibilityLabel={s.swap} disabled={from === 'auto'} onPress={swap} scaleTo={0.88} style={{ opacity: from === 'auto' ? 0.4 : 1 }}>
            <Glass radiusSize="pill" strong>
              <View style={styles.swap}>
                <Icon name="swap" size={20} color={t.primary} strokeWidth={2} />
              </View>
            </Glass>
          </Press>
          <View style={[styles.swapLine, { backgroundColor: t.divider }]} />
        </Reveal>
        <Reveal index={2}>
          <LangRow label={s.translateTo} value={to} onChange={(v) => v !== 'auto' && setTo(v)} />
        </Reveal>

        <Reveal index={3} style={styles.block}>
          <Glass radiusSize="lg" strong>
            <View style={styles.inputCard}>
              <TextInput
                value={input}
                onChangeText={(v) => setInput(v.slice(0, MAX_CHARS))}
                placeholder={s.translatePlaceholder}
                placeholderTextColor={t.faint}
                multiline
                style={[styles.input, { color: t.text }]}
              />
              <View style={styles.inputFoot}>
                <Text style={[type.footnote, type.mono, { color: t.faint, flex: 1 }]}>
                  {input.length} / {MAX_CHARS} {s.characters}
                </Text>
                {input ? (
                  <Press accessibilityRole="button" accessibilityLabel={s.clear} onPress={clear} hitSlop={10}>
                    <Icon name="close" size={20} color={t.faint} />
                  </Press>
                ) : null}
              </View>
            </View>
          </Glass>
        </Reveal>

        <Reveal index={4} style={[styles.block, styles.row]}>
          {busy ? (
            <Button label={s.stop} icon="stop" variant="danger" onPress={() => void stopGeneration()} style={{ flex: 1 }} />
          ) : (
            <Button label={s.translate} icon="sparkle" onPress={() => void run()} disabled={!input.trim()} style={{ flex: 1 }} />
          )}
          <Button label={s.clear} icon="trash" variant="glass" onPress={clear} disabled={!input || busy} style={{ flex: 1 }} />
        </Reveal>

        {error ? <Text style={[type.callout, { color: t.danger, paddingHorizontal: space.lg }]}>{error}</Text> : null}

        {output || busy ? (
          <Reveal style={[styles.block, { gap: space.sm }]}>
            <SectionLabel label={s.translationLabel} />
            <Glass radiusSize="lg" strong style={{ borderColor: t.primary }}>
              <View style={styles.result}>
                <View style={styles.resultHead}>
                  <Icon name="sparkle" size={16} color={t.primary} strokeWidth={2} />
                  <Text style={[type.caption, { color: t.primary, flex: 1, letterSpacing: 1, textTransform: 'uppercase' }]}>{translationLangName(to, uiLang)}</Text>
                  {busy ? <ActivityIndicator size="small" color={t.accent} /> : null}
                </View>
                <Text selectable style={[styles.resultText, { color: t.text }]}>
                  {output || '…'}
                </Text>
                {output && !busy ? (
                  <Press
                    accessibilityRole="button"
                    onPress={async () => {
                      await Clipboard.setStringAsync(output);
                      setCopied(true);
                    }}
                    style={styles.copy}
                  >
                    <Icon name={copied ? 'check' : 'copy'} size={18} color={t.primary} strokeWidth={2} />
                    <Text style={[font.bold, { color: t.primary }]}>{copied ? s.copied : s.copy}</Text>
                  </Press>
                ) : null}
              </View>
            </Glass>
          </Reveal>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function TranslateScreen() {
  const s = useT();
  return (
    <Screen>
      <ScreenHeader title={s.tabTranslate} />
      <ModelGate>
        <Translator />
      </ModelGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: TAB_BAR_SPACE, gap: space.md },
  block: { paddingHorizontal: space.lg },
  swapRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg },
  swapLine: { flex: 1, height: StyleSheet.hairlineWidth },
  swap: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  inputCard: { padding: space.lg, gap: space.sm },
  input: { ...font.medium, minHeight: 110, fontSize: 20, lineHeight: 28, textAlignVertical: 'top', padding: 0 },
  inputFoot: { flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', gap: space.md },
  result: { padding: space.lg, gap: space.md },
  resultHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultText: { ...font.semibold, fontSize: 21, lineHeight: 30 },
  copy: { flexDirection: 'row', gap: 6, alignItems: 'center' },
});
