import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { aiStore, generate, stopGeneration } from '../../ai/engine';
import { buildTranslationMessages } from '../../ai/prompts';
import { ModelGate } from '../../components/ModelGate';
import { TRANSLATION_LANGS, type TranslationLangCode } from '../../i18n/lang';
import { useLang, useT } from '../../state/settings';
import { useStore } from '../../state/store';
import { Button } from '../../ui/components';
import { radius, space, useTheme } from '../../ui/theme';

function LangRow({
  label,
  value,
  onChange,
  allowAuto,
  autoLabel,
}: {
  label: string;
  value: TranslationLangCode | 'auto';
  onChange: (v: TranslationLangCode | 'auto') => void;
  allowAuto?: boolean;
  autoLabel: string;
}) {
  const t = useTheme();
  const lang = useLang();
  const options: Array<{ code: TranslationLangCode | 'auto'; name: string }> = [
    ...(allowAuto ? [{ code: 'auto' as const, name: autoLabel }] : []),
    ...TRANSLATION_LANGS.map((l) => ({ code: l.code, name: l[lang] })),
  ];
  return (
    <View style={{ gap: space.xs }}>
      <Text style={{ color: t.muted, fontSize: 13, fontWeight: '600' }}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.xs }}>
        {options.map((o) => {
          const active = o.code === value;
          return (
            <Pressable
              key={o.code}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(o.code)}
              style={[
                styles.chip,
                { borderColor: active ? t.primary : t.border, backgroundColor: active ? t.primary : t.card },
              ]}
            >
              <Text style={{ color: active ? t.onPrimary : t.text, fontWeight: '600' }}>{o.name}</Text>
            </Pressable>
          );
        })}
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
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <LangRow label={s.translateFrom} value={from} onChange={setFrom} allowAuto autoLabel={s.autoDetect} />
      <View style={styles.swapRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={s.swap}
          disabled={from === 'auto'}
          onPress={swap}
          style={{ opacity: from === 'auto' ? 0.35 : 1, padding: space.xs }}
        >
          <Ionicons name="swap-vertical" size={26} color={t.primary} />
        </Pressable>
      </View>
      <LangRow
        label={s.translateTo}
        value={to}
        onChange={(v) => v !== 'auto' && setTo(v)}
        autoLabel={s.autoDetect}
      />

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder={s.translatePlaceholder}
        placeholderTextColor={t.muted}
        multiline
        style={[styles.box, { color: t.text, borderColor: t.border, backgroundColor: t.card }]}
      />
      <View style={styles.row}>
        {busy ? (
          <Button label={s.stop} icon="stop" variant="danger" onPress={() => void stopGeneration()} />
        ) : (
          <Button label={s.translate} icon="language" onPress={() => void run()} disabled={!input.trim()} />
        )}
        {input ? (
          <Button
            label={s.clear}
            variant="secondary"
            onPress={() => {
              setInput('');
              setOutput('');
            }}
          />
        ) : null}
      </View>

      {error ? <Text style={{ color: t.danger }}>{error}</Text> : null}
      {output ? (
        <View style={[styles.box, styles.output, { borderColor: t.primary, backgroundColor: t.card }]}>
          <Text selectable style={{ color: t.text, fontSize: 18, lineHeight: 26 }}>
            {output}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await Clipboard.setStringAsync(output);
              setCopied(true);
            }}
            style={styles.copy}
          >
            <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color={t.primary} />
            <Text style={{ color: t.primary, fontWeight: '600' }}>{copied ? s.copied : s.copy}</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

export default function TranslateScreen() {
  return (
    <ModelGate>
      <Translator />
    </ModelGate>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space.lg, gap: space.md },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: space.md, paddingVertical: space.sm },
  swapRow: { alignItems: 'center', marginVertical: -space.sm },
  box: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: space.md,
    fontSize: 17,
    textAlignVertical: 'top',
  },
  output: { gap: space.md, borderWidth: 1.5 },
  row: { flexDirection: 'row', gap: space.sm },
  copy: { flexDirection: 'row', gap: space.xs, alignItems: 'center', alignSelf: 'flex-end' },
});
