import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

import { useLang, useT } from '../../state/settings';
import { cardinal, formatDecimal, formatDMS, normalizeHeading } from '../../tools/geo';
import { useSensors } from '../../tools/useSensors';
import { Body, Breathe, KvRow, Note, Reveal, Screen, Slab, StatusStrip } from '../../ui/kit';
import { space, TAB_BAR_HEIGHT, type, useTheme } from '../../ui/theme';

const DIAL = 330;
const R = DIAL / 2;
const TICKS = Array.from({ length: 180 }, (_, i) => i * 2);

/** Instrument dial: ticks every 2°, numbers every 30°, cardinals; dial and needle rotate together
 *  so the index at the top reads the heading. Rotation is unwrapped for the spring. */
function CompassDial({ heading }: { heading: number | null }) {
  const t = useTheme();
  const lang = useLang();
  const cardinals = lang === 'de' ? ['N', 'O', 'S', 'W'] : ['N', 'E', 'S', 'W'];
  const rot = useSharedValue(heading == null ? 0 : -heading);
  const last = useRef(heading ?? 0);

  useEffect(() => {
    if (heading == null) return;
    let delta = heading - last.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    last.current = heading;
    rot.value = withSpring(rot.value - delta, { damping: 15, stiffness: 80, mass: 0.9 });
  }, [heading, rot]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  return (
    <View style={{ width: DIAL, height: DIAL, alignSelf: 'center' }}>
      <Svg width={DIAL} height={DIAL} viewBox={`0 0 ${DIAL} ${DIAL}`} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="dial" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={t.dialInner} />
            <Stop offset="1" stopColor={t.dialOuter} />
          </RadialGradient>
        </Defs>
        <Circle cx={R} cy={R} r={R - 5} fill="url(#dial)" stroke={t.line} />
        <Circle cx={R} cy={R} r={R - 47} stroke={t.lineSoft} fill="none" />
        <Path d={`M ${R} 0 L ${R + 6} 14 L ${R - 6} 14 Z`} fill={t.signal} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, style]}>
        <Svg width={DIAL} height={DIAL} viewBox={`0 0 ${DIAL} ${DIAL}`}>
          <G>
            {TICKS.map((d) => {
              const major = d % 30 === 0;
              const mid = d % 10 === 0;
              const len = major ? 14 : mid ? 9 : 4;
              return (
                <Line
                  key={d}
                  x1={R}
                  y1={13}
                  x2={R}
                  y2={13 + len}
                  stroke={d === 0 ? t.signal : major ? t.tickMajor : mid ? t.tickMid : t.tickMinor}
                  strokeWidth={major ? 2 : 1}
                  strokeLinecap="round"
                  rotation={d}
                  origin={`${R}, ${R}`}
                />
              );
            })}
          </G>
          {TICKS.filter((d) => d % 30 === 0 && d % 90 !== 0).map((d) => (
            <SvgText key={d} x={R} y={47} fontSize={13} fontFamily="BarlowCondensed_600SemiBold" fill={t.muted} textAnchor="middle" rotation={d} origin={`${R}, ${R}`}>
              {d}
            </SvgText>
          ))}
          {cardinals.map((c, i) => (
            <SvgText key={c} x={R} y={74} fontSize={24} fontFamily="BarlowCondensed_700Bold" fill={i === 0 ? t.signal : t.text} textAnchor="middle" rotation={i * 90} origin={`${R}, ${R}`}>
              {c}
            </SvgText>
          ))}
          <Path d={`M ${R} ${R - 105} L ${R + 11} ${R} L ${R - 11} ${R} Z`} fill={t.signal} />
          <Path d={`M ${R} ${R + 105} L ${R + 11} ${R} L ${R - 11} ${R} Z`} fill={t.needleTail} />
          <Circle cx={R} cy={R} r={9} fill={t.bg} stroke={t.text} strokeWidth={2} />
          <Circle cx={R} cy={R} r={3} fill={t.signal} />
        </Svg>
      </Animated.View>
    </View>
  );
}

export default function ToolsScreen() {
  const t = useTheme();
  const s = useT();
  const lang = useLang();
  const { perm, request, position, degrees, trueAvailable } = useSensors();
  const coords = position?.coords;
  const deg = degrees == null ? null : normalizeHeading(degrees);

  return (
    <Screen topo={false}>
      <StatusStrip
        left={coords ? `GPS · ±${Math.round(coords.accuracy ?? 0)} m` : perm === 'granted' ? s.locationWaiting : s.locationDenied}
        rightStrong={deg == null ? undefined : trueAvailable ? s.compassTrue.split(' ')[0] : s.compassMagnetic}
        right={deg == null ? undefined : trueAvailable ? s.compassTrue.split(' ').slice(1).join(' ') : undefined}
      />
      <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
        {perm !== 'granted' ? (
          <Reveal style={{ marginTop: space.lg, gap: space.md }}>
            <Body muted>{s.locationDenied}</Body>
            {perm === 'unknown' ? <Slab label={s.locationAllow} icon="pin" compact onPress={() => void request()} /> : null}
          </Reveal>
        ) : null}

        <Reveal>
          <View style={{ marginTop: space.sm }}>
            <CompassDial heading={deg} />
          </View>
          <View style={styles.readout}>
            <Text style={[type.number, { color: t.text }]}>
              {deg == null ? '—' : Math.round(deg)}
              <Text style={{ fontSize: 60 }}>°</Text>
              <Text style={{ color: t.signal, fontSize: 44, letterSpacing: 0 }}> {deg == null ? '' : cardinal(deg, lang)}</Text>
            </Text>
            <Text style={[type.labelSmall, { color: t.muted, marginTop: space.xs }]}>
              {s.hudHeading} · {trueAvailable ? s.compassTrue : s.compassMagnetic}
            </Text>
          </View>
        </Reveal>

        <Reveal index={1} style={[styles.rows, { borderTopColor: t.line }]}>
          {coords ? (
            <>
              <KvRow k={s.positionDecimal} v={formatDecimal(coords.latitude, coords.longitude)} icon="copy" onPress={() => void Clipboard.setStringAsync(formatDecimal(coords.latitude, coords.longitude))} />
              <KvRow k="DMS" v={formatDMS(coords.latitude, coords.longitude, lang)} icon="copy" onPress={() => void Clipboard.setStringAsync(formatDMS(coords.latitude, coords.longitude, lang))} />
              <KvRow k={s.altitude} v={coords.altitude != null ? `${Math.round(coords.altitude).toLocaleString(lang)} m` : '—'} note={`±${Math.round(coords.accuracy ?? 0)} m`} />
            </>
          ) : (
            <KvRow k="GPS" v={perm === 'granted' ? '…' : '—'} note={perm === 'granted' ? s.locationWaiting : undefined} />
          )}
        </Reveal>

        <Reveal index={2} style={{ marginTop: space.lg, gap: space.md }}>
          <Breathe min={0.82}>
            <Slab label={s.sos} sub={s.sosMorse} icon="flash" onPress={() => router.push('/signal?mode=sos')} accessibilityLabel={s.sosStart} />
          </Breathe>
          <Slab label={s.alpine} sub={s.alpineShort} icon="mountain" variant="ghost" compact onPress={() => router.push('/signal?mode=alpine')} accessibilityLabel={s.alpineStart} />
          <Note text={s.locationHint} icon="radio" />
        </Reveal>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.xl, paddingBottom: TAB_BAR_HEIGHT },
  readout: { alignItems: 'center', marginTop: space.md },
  rows: { marginTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth },
});
