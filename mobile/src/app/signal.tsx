import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useT } from '../state/settings';
import { alpineTimeline, morsePulses, toTimeline } from '../tools/morse';

/** Full-screen light signal. Tap anywhere to close. */
export default function SignalScreen() {
  useKeepAwake();
  const s = useT();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const timeline = useMemo(() => (mode === 'alpine' ? alpineTimeline() : toTimeline(morsePulses('sos'))), [mode]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const pulse = timeline[index];
    if (!pulse) return undefined;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % timeline.length), pulse.ms);
    return () => clearTimeout(timer);
  }, [index, timeline]);

  const on = timeline[index]?.on ?? false;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={s.sosStop}
      onPress={() => router.back()}
      style={[styles.full, { backgroundColor: on ? '#FFFFFF' : '#000000' }]}
    >
      <StatusBar hidden />
      <Text style={[styles.hint, { color: on ? '#000000' : '#666666' }]}>{s.sosStop}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  hint: { fontSize: 14, marginBottom: 48 },
});
