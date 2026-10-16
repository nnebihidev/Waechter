import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { aiStore, generate, stopGeneration } from '../../ai/engine';
import { buildTranslationMessages } from '../../ai/prompts';
import { aiStatusLabel, ModelGate } from '../../components/ModelGate';
import { TRANSLATION_LANGS, translationLangName, type TranslationLangCode } from '../../i18n/lang';
import { useLang, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { Caret, Chip, Display, Icon, Press, Reveal, Screen, SectionLabel, Slab, StatusStrip } from '../../ui/kit';
import { font, radius, space, TAB_BAR_HEIGHT, type, useTheme } from '../../ui/theme';

const MAX_CHARS = 4000;

function LangRow({ label, value, onChange, allowAuto }: { label: string; value: TranslationLangCode | 'auto'; onChange: (v: TranslationLangCode | 'auto') => void; allowAuto?: boolean }) {
  const s = useT();
  const lang = useLang();
  return (
    <View style={{ gap: space.sm }}>
      <SectionLabel label={label} style={{ paddingHorizontal: space.xl }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.xl }}>
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
      const result = await generate(buildTranslationMessages(input.trim(), from, to), setOutput, { temperature: 0.2, maxTokens: Math.min(2048, Math.ceil(input.length / 2) + 128) });
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
          <View style={[styles.rule, { backgroundColor: t.line }]} />
          <Press accessibilityRole="button" accessibilityLabel={s.swap} disabled={from === 'auto'} onPress={swap} scaleTo={0.9} style={[styles.swap, { borderColor: t.line, opacity: from === 'auto' ? 0.35 : 1 }]}>
            <Icon name="swap" size={18} color={t.signal} strokeWidth={2} />
          </Press>
          <View style={[styles.rule, { backgroundColor: t.line }]} />
        </Reveal>
        <Reveal index={2}>
          <LangRow label={s.translateTo} value={to} onChange={(v) => v !== 'auto' && setTo(v)} />
        </Reveal>

        <Reveal index={3} style={styles.block}>
          <View style={[styles.inputCard, { backgroundColor: t.surface, borderColor: t.line }]}>
            <TextInput
              value={input}
              onChangeText={(v) => setInput(v.slice(0, MAX_CHARS))}
              placeholder={s.translatePlaceholder}
              placeholderTextColor={t.dim}
              multiline
              style={[styles.input, { color: t.text }]}
            />
            <View style={styles.inputFoot}>
              <Text style={[type.labelSmall, { color: t.dim, flex: 1 }]}>
                {input.length} / {MAX_CHARS} {s.characters}
              </Text>
              {input ? (
                <Press accessibilityRole="button" accessibilityLabel={s.clear} onPress={clear} hitSlop={10}>
                  <Icon name="close" size={18} color={t.dim} />
                </Press>
              ) : null}
            </View>
          </View>
        </Reveal>

        <Reveal index={4} style={[styles.block, styles.row]}>
          {busy ? (
            <Slab label={s.stop} icon="stop" compact onPress={() => void stopGeneration()} style={{ flex: 1 }} />
          ) : (
            <Slab label={s.translate} icon="sparkle" compact onPress={() => void run()} disabled={!input.trim()} style={{ flex: 1 }} />
          )}
          <Slab label={s.clear} icon="trash" variant="neutral" compact onPress={clear} disabled={!input || busy} style={{ flex: 1 }} />
        </Reveal>

        {error ? <Text style={[type.callout, { color: t.signal, paddingHorizontal: space.xl }]}>{error}</Text> : null}

        {output || busy ? (
          <Reveal style={styles.block}>
            <SectionLabel label={`${s.translationLabel} · ${translationLangName(to, uiLang)}`} tone="signal" />
            <View style={[styles.result, { borderLeftColor: t.signal }]}>
              <Text selectable style={[styles.resultText, { color: t.text }]}>
                {output}
                {busy ? <Caret color={t.signal} /> : null}
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
                  <Icon name={copied ? 'check' : 'copy'} size={16} color={t.signal} strokeWidth={2} />
                  <Text style={[type.label, { color: t.signal }]}>{copied ? s.copied : s.copy}</Text>
                </Press>
              ) : null}
            </View>
          </Reveal>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function TranslateScreen() {
  const s = useT();
  const ai = useStore(aiStore);
  return (
    <Screen>
      <StatusStrip left={aiStatusLabel(ai, s)} rightStrong={String(TRANSLATION_LANGS.length)} right={s.tileTranslateSub.replace(/^\d+\s*/, '')} />
      <Display style={{ paddingHorizontal: space.xl, marginTop: space.lg, marginBottom: space.lg }}>{s.tabTranslate}</Display>
      <ModelGate>
        <Translator />
      </ModelGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: TAB_BAR_HEIGHT, gap: space.lg },
  block: { paddingHorizontal: space.xl },
  swapRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.xl },
  rule: { flex: 1, height: StyleSheet.hairlineWidth },
  swap: { width: 38, height: 38, borderWidth: 1, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  inputCard: { borderWidth: 1, borderRadius: radius.sm, padding: space.lg, gap: space.sm },
  input: { ...font.body, minHeight: 100, fontSize: 19, lineHeight: 27, textAlignVertical: 'top', padding: 0 },
  inputFoot: { flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', gap: space.md },
  result: { borderLeftWidth: 2, paddingLeft: 14, marginTop: space.md, gap: space.md },
  resultText: { ...font.bodyStrong, fontSize: 21, lineHeight: 30 },
  copy: { flexDirection: 'row', gap: 6, alignItems: 'center' },
});
