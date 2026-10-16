import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useLang, useT } from '../../state/settings';
import { cardinal, formatDecimal, formatDMS, normalizeHeading } from '../../tools/geo';
import { Body, Button, Card, H2 } from '../../ui/components';
import { space, useTheme } from '../../ui/theme';

type Perm = 'unknown' | 'granted' | 'denied';

function useSensors(active: boolean) {
  const [perm, setPerm] = useState<Perm>('unknown');
  const [heading, setHeading] = useState<Location.LocationHeadingObject | null>(null);
  const [position, setPosition] = useState<Location.LocationObject | null>(null);

  const request = useCallback(async () => {
    const res = await Location.requestForegroundPermissionsAsync();
    setPerm(res.granted ? 'granted' : 'denied');
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!active) return undefined;
      let cancelled = false;
      const subs: Location.LocationSubscription[] = [];
      void (async () => {
        const current = await Location.getForegroundPermissionsAsync();
        if (cancelled) return;
        if (!current.granted) {
          setPerm(current.canAskAgain ? 'unknown' : 'denied');
          return;
        }
        setPerm('granted');
        // Both come from on-device sensors and GNSS; no network location provider is required.
        subs.push(await Location.watchHeadingAsync(setHeading));
        subs.push(
          await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 2000, distanceInterval: 1 },
            setPosition,
          ),
        );
        if (cancelled) subs.forEach((s) => s.remove());
      })();
      return () => {
        cancelled = true;
        subs.forEach((s) => s.remove());
      };
    }, [active, perm]),
  );

  return { perm, request, heading, position };
}

function CompassRose({ heading, label }: { heading: number; label: string }) {
  const t = useTheme();
  const lang = useLang();
  const marks = lang === 'de' ? ['N', 'O', 'S', 'W'] : ['N', 'E', 'S', 'W'];
  return (
    <View style={styles.compassWrap}>
      <View style={[styles.lubber, { backgroundColor: t.danger }]} />
      <View style={[styles.rose, { borderColor: t.border, transform: [{ rotate: `${-heading}deg` }] }]}>
        {marks.map((m, i) => (
          <Text
            key={m}
            style={[
              styles.mark,
              { color: i === 0 ? t.danger : t.text, transform: [{ rotate: `${i * 90}deg` }, { translateY: -92 }] },
            ]}
          >
            {m}
          </Text>
        ))}
      </View>
      <Text style={[styles.heading, { color: t.text }]}>
        {Math.round(heading)}° {cardinal(heading, lang)}
      </Text>
      <Text style={{ color: t.muted }}>{label}</Text>
    </View>
  );
}

export default function ToolsScreen() {
  const t = useTheme();
  const s = useT();
  const lang = useLang();
  const { perm, request, heading, position } = useSensors(true);
  const [copied, setCopied] = useState(false);

  const trueAvailable = heading !== null && heading.trueHeading >= 0;
  const deg = heading ? normalizeHeading(trueAvailable ? heading.trueHeading : heading.magHeading) : 0;
  const coords = position?.coords;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {perm !== 'granted' ? (
        <Card>
          <Body muted>{s.locationDenied}</Body>
          {perm === 'unknown' ? <Button label={s.locationAllow} icon="location" onPress={() => void request()} /> : null}
        </Card>
      ) : null}

      <Card>
        <H2>{s.compass}</H2>
        {heading ? (
          <>
            <CompassRose heading={deg} label={trueAvailable ? s.compassTrue : s.compassMagnetic} />
            {heading.accuracy !== undefined && heading.accuracy <= 1 ? <Body muted>{s.compassCalibrate}</Body> : null}
          </>
        ) : (
          <Body muted>…</Body>
        )}
      </Card>

      <Card>
        <H2>{s.location}</H2>
        {coords ? (
          <Pressable
            accessibilityRole="button"
            accessibilityHint={s.copy}
            onPress={async () => {
              await Clipboard.setStringAsync(formatDecimal(coords.latitude, coords.longitude));
              setCopied(true);
            }}
            style={{ gap: space.xs }}
          >
            <Text selectable style={[styles.coords, { color: t.text }]}>
              {formatDecimal(coords.latitude, coords.longitude)}
            </Text>
            <Text selectable style={{ color: t.text, fontSize: 16 }}>
              {formatDMS(coords.latitude, coords.longitude, lang)}
            </Text>
            <Text style={{ color: t.muted }}>
              {s.accuracy}: ±{Math.round(coords.accuracy ?? 0)} m
              {coords.altitude != null ? ` · ${s.altitude}: ${Math.round(coords.altitude)} m` : ''}
            </Text>
            <View style={{ flexDirection: 'row', gap: space.xs, alignItems: 'center' }}>
              <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color={t.primary} />
              <Text style={{ color: t.primary, fontWeight: '600' }}>{copied ? s.copied : s.copy}</Text>
            </View>
          </Pressable>
        ) : (
          <Body muted>{perm === 'granted' ? s.locationWaiting : '—'}</Body>
        )}
        <Body muted>{s.locationHint}</Body>
      </Card>

      <Card>
        <H2>{s.sos}</H2>
        <Body muted>{s.sosBody}</Body>
        <Button label={s.sosStart} icon="flashlight" variant="danger" onPress={() => router.push('/signal?mode=sos')} />
        <H2>{s.alpine}</H2>
        <Body muted>{s.alpineBody}</Body>
        <Button
          label={s.alpineStart}
          icon="flashlight-outline"
          variant="secondary"
          onPress={() => router.push('/signal?mode=alpine')}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space.lg, gap: space.md, paddingBottom: space.xl * 2 },
  compassWrap: { alignItems: 'center', paddingVertical: space.md, gap: space.sm },
  lubber: { width: 4, height: 18, borderRadius: 2 },
  rose: { width: 220, height: 220, borderRadius: 110, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  mark: { position: 'absolute', fontSize: 22, fontWeight: '800' },
  heading: { fontSize: 32, fontWeight: '800', fontVariant: ['tabular-nums'] },
  coords: { fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] },
});
