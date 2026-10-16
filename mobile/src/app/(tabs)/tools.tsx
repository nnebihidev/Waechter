import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Line, LinearGradient as SvgGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

import { useLang, useT } from '../../state/settings';
import { cardinal, formatDecimal, formatDMS, normalizeHeading } from '../../tools/geo';
import { Body, Button, Card, CardTitle, Icon, InfoNote, Press, Reveal, ScreenHeader, Screen } from '../../ui/components';
import { Pulse } from '../../ui/glass';
import { font, space, TAB_BAR_SPACE, type, useTheme } from '../../ui/theme';

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
          await Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 2000, distanceInterval: 1 }, setPosition),
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

const DIAL = 250;
const R = DIAL / 2;

/** Spring-damped dial. The rotation is unwrapped so 359° → 1° turns 2°, not −358°. */
function CompassDial({ heading }: { heading: number }) {
  const t = useTheme();
  const lang = useLang();
  const labels = lang === 'de' ? ['N', 'O', 'S', 'W'] : ['N', 'E', 'S', 'W'];
  const rot = useSharedValue(-heading);
  const last = useRef(heading);

  useEffect(() => {
    let delta = heading - last.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    last.current = heading;
    rot.value = withSpring(rot.value - delta, { damping: 16, stiffness: 90, mass: 0.8 });
  }, [heading, rot]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const dark = t.scheme === 'dark';

  return (
    <View style={{ width: DIAL, height: DIAL + 16, alignItems: 'center' }}>
      <Svg width={DIAL} height={16} viewBox={`0 0 ${DIAL} 16`} style={{ position: 'absolute', top: 0, zIndex: 2 }}>
        <Path d={`M ${R - 9} 0 L ${R + 9} 0 L ${R} 15 Z`} fill={t.danger} />
      </Svg>
      <Animated.View style={[{ marginTop: 14 }, style]}>
        <Svg width={DIAL} height={DIAL} viewBox={`0 0 ${DIAL} ${DIAL}`}>
          <Defs>
            <SvgGradient id="dial" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={dark ? '#1C2E24' : '#FFFFFF'} />
              <Stop offset="1" stopColor={dark ? '#0F1A14' : '#E8EFE9'} />
            </SvgGradient>
            <SvgGradient id="needle" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FF7A6B" />
              <Stop offset="1" stopColor="#C62828" />
            </SvgGradient>
          </Defs>
          <Circle cx={R} cy={R} r={R - 2} fill="url(#dial)" stroke={t.glassBorder} strokeWidth={1.5} />
          <Circle cx={R} cy={R} r={R - 30} stroke={t.divider} strokeWidth={1} fill="none" />
          <G>
            {ticks.map((deg) => {
              const major = deg % 30 === 0;
              const len = deg % 90 === 0 ? 16 : major ? 11 : 5;
              return (
                <Line
                  key={deg}
                  x1={R}
                  y1={8}
                  x2={R}
                  y2={8 + len}
                  stroke={deg === 0 ? t.danger : major ? t.text : t.faint}
                  strokeWidth={major ? 2 : 1}
                  strokeLinecap="round"
                  opacity={major ? 1 : 0.6}
                  rotation={deg}
                  origin={`${R}, ${R}`}
                />
              );
            })}
          </G>
          {labels.map((label, i) => (
            <SvgText
              key={label}
              x={R}
              y={54}
              fontSize={20}
              fontFamily="Manrope_800ExtraBold"
              fontWeight="800"
              textAnchor="middle"
              fill={i === 0 ? t.danger : t.text}
              rotation={i * 90}
              origin={`${R}, ${R}`}
            >
              {label}
            </SvgText>
          ))}
          <Path d={`M ${R} ${R - 66} L ${R + 12} ${R} L ${R - 12} ${R} Z`} fill="url(#needle)" />
          <Path d={`M ${R} ${R + 66} L ${R + 12} ${R} L ${R - 12} ${R} Z`} fill={t.faint} opacity={0.8} />
          <Circle cx={R} cy={R} r={9} fill={dark ? '#0F1A14' : '#FFFFFF'} stroke={t.text} strokeWidth={2} />
          <Circle cx={R} cy={R} r={3} fill={t.danger} />
        </Svg>
      </Animated.View>
    </View>
  );
}

function CopyRow({ label, value, copyLabel }: { label: string; value: string; copyLabel: string }) {
  const t = useTheme();
  const [copied, setCopied] = useState(false);
  return (
    <Press
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}. ${copyLabel}`}
      onPress={async () => {
        await Clipboard.setStringAsync(value);
        setCopied(true);
      }}
      scaleTo={0.985}
      style={styles.kv}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.caption, { color: t.muted, letterSpacing: 0.8, textTransform: 'uppercase' }]}>{label}</Text>
        <Text selectable style={[styles.kvValue, { color: t.text }]}>
          {value}
        </Text>
      </View>
      <Icon name={copied ? 'check' : 'copy'} size={20} color={t.primary} strokeWidth={2} />
    </Press>
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
    <Screen>
      <ScreenHeader title={s.tabTools} />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
        {perm !== 'granted' ? (
          <Reveal>
            <Card strong>
              <Body muted>{s.locationDenied}</Body>
              {perm === 'unknown' ? <Button label={s.locationAllow} icon="pin" onPress={() => void request()} /> : null}
            </Card>
          </Reveal>
        ) : null}

        <Reveal>
          <Card>
            <CardTitle
              title={s.compass}
              right={
                heading ? (
                  <View style={styles.inline}>
                    <Icon name="navigate" size={15} color={t.muted} />
                    <Text style={[type.footnote, { color: t.muted }]}>{trueAvailable ? s.compassTrue : s.compassMagnetic}</Text>
                  </View>
                ) : null
              }
            />
            <View style={styles.compass}>
              <CompassDial heading={deg} />
              <Text style={[styles.heading, { color: t.text }]}>
                {heading ? `${Math.round(deg)}°` : '—'} <Text style={{ color: t.primary }}>{heading ? cardinal(deg, lang) : ''}</Text>
              </Text>
            </View>
            {heading && heading.accuracy !== undefined && heading.accuracy <= 1 ? <InfoNote text={s.compassCalibrate} icon="infinity" /> : null}
          </Card>
        </Reveal>

        <Reveal index={1}>
          <Card>
            <CardTitle title={s.location} icon="pin" />
            {coords ? (
              <View>
                <CopyRow label={s.positionDecimal} value={formatDecimal(coords.latitude, coords.longitude)} copyLabel={s.copy} />
                {divider}
                <CopyRow label={s.positionDms} value={formatDMS(coords.latitude, coords.longitude, lang)} copyLabel={s.copy} />
                {divider}
                <View style={styles.kvRow}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[type.caption, { color: t.muted, letterSpacing: 0.8, textTransform: 'uppercase' }]}>{s.accuracy}</Text>
                    <Text style={[styles.kvValue, { color: t.text }]}>± {Math.round(coords.accuracy ?? 0)} m</Text>
                  </View>
                  {coords.altitude != null ? (
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[type.caption, { color: t.muted, letterSpacing: 0.8, textTransform: 'uppercase' }]}>{s.altitude}</Text>
                      <Text style={[styles.kvValue, { color: t.text }]}>{Math.round(coords.altitude)} m</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : (
              <Body muted>{perm === 'granted' ? s.locationWaiting : '—'}</Body>
            )}
            <InfoNote text={s.locationHint} icon="radio" />
          </Card>
        </Reveal>

        <Reveal index={2}>
          <Card>
            <CardTitle title={s.sos} subtitle={s.sosBody} icon="flash" />
            <Pulse color={t.danger} size={300}>
              <Button label={s.sosStart} icon="flash" variant="danger" onPress={() => router.push('/signal?mode=sos')} style={{ alignSelf: 'stretch' }} />
            </Pulse>
            <Button label={s.alpineStart} icon="mountain" variant="dangerGlass" onPress={() => router.push('/signal?mode=alpine')} />
            <InfoNote text={`${s.alpineBody} ${s.sosHint}`} icon="sun" />
          </Card>
        </Reveal>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingBottom: TAB_BAR_SPACE, gap: space.md },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  compass: { alignItems: 'center', gap: space.sm },
  heading: { ...font.extrabold, fontSize: 42, letterSpacing: -1, fontVariant: ['tabular-nums'] },
  kv: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  kvRow: { flexDirection: 'row', gap: space.md, paddingVertical: space.md },
  kvValue: { ...font.bold, fontSize: 18, fontVariant: ['tabular-nums'] },
});
