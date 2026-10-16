import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { useLang, useT } from '../../state/settings';
import { cardinal, formatDecimal, formatDMS, normalizeHeading } from '../../tools/geo';
import { Body, Button, Card, CardTitle, InfoNote, ScreenHeader } from '../../ui/components';
import { space, type, useTheme } from '../../ui/theme';

type Perm = 'unknown' | 'granted' | 'denied';

function useSensors() {
  const [perm, setPerm] = useState<Perm>('unknown');
  const [heading, setHeading] = useState<Location.LocationHeadingObject | null>(null);
  const [position, setPosition] = useState<Location.LocationObject | null>(null);

  const request = useCallback(async () => {
    const res = await Location.requestForegroundPermissionsAsync();
    setPerm(res.granted ? 'granted' : 'denied');
  }, []);

  useFocusEffect(
    useCallback(() => {
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
    }, [perm]),
  );

  return { perm, request, heading, position };
}

const DIAL = 240;
const R = DIAL / 2;

/** Rotating compass dial; the red index at the top marks the direction the phone points. */
function CompassDial({ heading }: { heading: number }) {
  const t = useTheme();
  const lang = useLang();
  const labels = lang === 'de' ? ['N', 'O', 'S', 'W'] : ['N', 'E', 'S', 'W'];
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <Svg width={DIAL} height={DIAL + 14} viewBox={`0 -14 ${DIAL} ${DIAL + 14}`}>
      <Path d={`M ${R - 9} -12 L ${R + 9} -12 L ${R} 6 Z`} fill={t.danger} />
      <G rotation={-heading} origin={`${R}, ${R}`}>
        <Circle cx={R} cy={R} r={R - 2} fill={t.card} stroke={t.border} strokeWidth={2} />
        {ticks.map((deg) => {
          const major = deg % 30 === 0;
          const len = deg % 90 === 0 ? 16 : major ? 11 : 6;
          return (
            <Line
              key={deg}
              x1={R}
              y1={8}
              x2={R}
              y2={8 + len}
              stroke={deg === 0 ? t.danger : major ? t.text : t.faint}
              strokeWidth={major ? 2 : 1}
              rotation={deg}
              origin={`${R}, ${R}`}
            />
          );
        })}
        {labels.map((label, i) => (
          <SvgText
            key={label}
            x={R}
            y={52}
            fontSize={22}
            fontWeight="800"
            textAnchor="middle"
            fill={i === 0 ? t.danger : t.text}
            rotation={i * 90}
            origin={`${R}, ${R}`}
          >
            {label}
          </SvgText>
        ))}
        {/* North-pointing needle drawn on the dial. */}
        <Path d={`M ${R} ${R - 62} L ${R + 11} ${R} L ${R - 11} ${R} Z`} fill={t.danger} />
        <Path d={`M ${R} ${R + 62} L ${R + 11} ${R} L ${R - 11} ${R} Z`} fill={t.faint} />
        <Circle cx={R} cy={R} r={7} fill={t.card} stroke={t.text} strokeWidth={2} />
      </G>
    </Svg>
  );
}

function CopyRow({ label, value, copyLabel }: { label: string; value: string; copyLabel: string }) {
  const t = useTheme();
  const [copied, setCopied] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}. ${copyLabel}`}
      onPress={async () => {
        await Clipboard.setStringAsync(value);
        setCopied(true);
      }}
      style={styles.kv}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.footnote, { color: t.muted }]}>{label}</Text>
        <Text selectable style={[styles.kvValue, { color: t.text }]}>
          {value}
        </Text>
      </View>
      <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={20} color={t.primary} />
    </Pressable>
  );
}

export default function ToolsScreen() {
  const t = useTheme();
  const s = useT();
  const lang = useLang();
  const { perm, request, heading, position } = useSensors();

  const trueAvailable = heading !== null && heading.trueHeading >= 0;
  const deg = heading ? normalizeHeading(trueAvailable ? heading.trueHeading : heading.magHeading) : 0;
  const coords = position?.coords;
  const divider = <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.divider }} />;

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader title={s.tabTools} />
      <ScrollView contentContainerStyle={styles.wrap}>
        {perm !== 'granted' ? (
          <Card>
            <Body muted>{s.locationDenied}</Body>
            {perm === 'unknown' ? <Button label={s.locationAllow} icon="location-outline" onPress={() => void request()} /> : null}
          </Card>
        ) : null}

        <Card>
          <CardTitle
            title={s.compass}
            right={
              heading ? (
                <View style={styles.inline}>
                  <Ionicons name="navigate-outline" size={16} color={t.muted} />
                  <Text style={[type.footnote, { color: t.muted }]}>{trueAvailable ? s.compassTrue : s.compassMagnetic}</Text>
                </View>
              ) : null
            }
          />
          <View style={styles.compass}>
            <CompassDial heading={deg} />
            <Text style={[styles.heading, { color: t.text }]}>
              {heading ? `${Math.round(deg)}°` : '—'}{' '}
              <Text style={{ color: t.faint }}>{heading ? cardinal(deg, lang) : ''}</Text>
            </Text>
          </View>
          {heading && heading.accuracy !== undefined && heading.accuracy <= 1 ? (
            <InfoNote text={s.compassCalibrate} icon="sync-outline" />
          ) : null}
        </Card>

        <Card>
          <CardTitle title={s.location} right={<Ionicons name="location-outline" size={20} color={t.muted} />} />
          {coords ? (
            <View>
              <CopyRow label={s.positionDecimal} value={formatDecimal(coords.latitude, coords.longitude)} copyLabel={s.copy} />
              {divider}
              <CopyRow label={s.positionDms} value={formatDMS(coords.latitude, coords.longitude, lang)} copyLabel={s.copy} />
              {divider}
              <View style={styles.kv}>
                <Text style={[type.callout, { color: t.muted, flex: 1 }]}>{s.accuracy}</Text>
                <Text style={[type.callout, { color: t.text, fontWeight: '700' }]}>± {Math.round(coords.accuracy ?? 0)} m</Text>
              </View>
              {coords.altitude != null ? (
                <>
                  {divider}
                  <View style={styles.kv}>
                    <Text style={[type.callout, { color: t.muted, flex: 1 }]}>{s.altitude}</Text>
                    <Text style={[type.callout, { color: t.text, fontWeight: '700' }]}>{Math.round(coords.altitude)} m</Text>
                  </View>
                </>
              ) : null}
            </View>
          ) : (
            <Body muted>{perm === 'granted' ? s.locationWaiting : '—'}</Body>
          )}
          <InfoNote text={s.locationHint} icon="radio-outline" />
        </Card>

        <Card>
          <CardTitle title={s.sos} subtitle={s.sosBody} />
          <Button label={s.sosStart} icon="flash" variant="danger" onPress={() => router.push('/signal?mode=sos')} />
          <Button
            label={s.alpineStart}
            icon="triangle-outline"
            variant="dangerOutline"
            onPress={() => router.push('/signal?mode=alpine')}
          />
          <InfoNote text={`${s.alpineBody} ${s.sosHint}`} icon="sunny-outline" />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.md },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  compass: { alignItems: 'center', gap: space.sm },
  heading: { fontSize: 40, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: -0.5 },
  kv: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  kvValue: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
