import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '../state/settings';
import { alpineTimeline, morsePulses, toTimeline } from '../tools/morse';
import { font } from '../ui/theme';

/** Full-screen light signal. Pure black/white for maximum contrast; tap anywhere to close. */
export default function SignalScreen() {
  useKeepAwake();
  const s = useT();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const timeline = useMemo(() => (mode === 'alpine' ? alpineTimeline() : toTimeline(morsePulses('sos'))), [mode]);
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const pulse = timeline[index];
    if (!pulse) return undefined;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % timeline.length), pulse.ms);
    return () => clearTimeout(timer);
  }, [index, timeline]);

  const on = timeline[index]?.on ?? false;
  const fg = on ? '#111111' : '#FFFFFF';
  const dim = on ? '#555555' : '#8A8A8A';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={s.sosStop} onPress={() => router.back()} style={[styles.full, { backgroundColor: on ? '#FFFFFF' : '#000000' }]}>
      <StatusBar hidden />
      <View style={[styles.top, { paddingTop: insets.top + 24 }]}>
        <Text style={[font.extrabold, styles.brand, { color: fg }]}>Kompass</Text>
        <Text style={[font.semibold, styles.mode, { color: dim }]}>{mode === 'alpine' ? s.alpine : 'SOS  · · ·  — — —  · · ·'}</Text>
      </View>
      <Text style={[font.medium, styles.hint, { color: dim, marginBottom: insets.bottom + 40 }]}>{s.sosStop}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 28 },
  top: { gap: 4 },
  brand: { fontSize: 30 },
  mode: { fontSize: 18 },
  hint: { fontSize: 15 },
});
