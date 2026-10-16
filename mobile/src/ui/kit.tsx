import { Children, type ReactNode } from 'react';
import { Linking, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Icon, type IconName } from './icons';
import { Press } from './motion';
import { radius, space, type, useTheme } from './theme';

export { Icon, type IconName } from './icons';
export { Breathe, Caret, Press, Reveal } from './motion';

/** Faint contour lines — the app's texture. Sits at the top of a screen. */
export function Topo({ height = 300, flip }: { height?: number; flip?: boolean }) {
  const t = useTheme();
  return (
    <Svg
      pointerEvents="none"
      width="100%"
      height={height}
      viewBox="0 0 393 300"
      preserveAspectRatio="xMidYMin slice"
      style={[StyleSheet.absoluteFill, flip ? { transform: [{ scaleY: -1 }] } : null]}
    >
      <Path d="M-40 120c80-60 160-40 230 10s150 60 240 0" stroke={t.topo} fill="none" />
      <Path d="M-40 160c80-60 170-40 240 20s150 70 240 0" stroke={t.topo} fill="none" />
      <Path d="M-40 200c90-60 180-30 250 30s150 70 240 0" stroke={t.topo} fill="none" />
      <Path d="M-40 240c90-50 190-20 260 40s140 60 230-10" stroke={t.topo} fill="none" />
      <Path d="M-40 280c100-40 200-10 270 50s130 50 220-20" stroke={t.topo} fill="none" />
      <Path d="M60 40c40 30 100 30 150-10s110-30 170 20" stroke={t.topo} fill="none" />
      <Path d="M80 0c40 40 100 40 150 0s110-30 170 30" stroke={t.topo} fill="none" />
    </Svg>
  );
}

/** Opaque screen root with optional contour texture. */
export function Screen({ children, topo = true, style }: { children: ReactNode; topo?: boolean; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={[{ flex: 1, backgroundColor: t.bg }, style]}>
      {topo ? <Topo /> : null}
      {children}
    </View>
  );
}

/** Thin instrument strip under the status bar: "● OFFLINE · KI BEREIT   47.42° N 10.98° O". */
export function StatusStrip({ left, right, rightStrong }: { left: string; right?: string; rightStrong?: string }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.strip, { paddingTop: insets.top + 6 }]}>
      <View style={styles.stripLeft}>
        <View style={[styles.dot, { backgroundColor: t.signal, shadowColor: t.signal }]} />
        <Text style={[type.labelSmall, { color: t.muted }]}>{left}</Text>
      </View>
      {right || rightStrong ? (
        <Text style={[type.labelSmall, { color: t.muted }]}>
          {rightStrong ? <Text style={{ color: t.signal }}>{rightStrong} </Text> : null}
          {right}
        </Text>
      ) : null}
    </View>
  );
}

export function Hero({ lines, accent, style }: { lines: string[]; accent?: number; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={style}>
      {lines.map((l, i) => (
        <Text key={i} accessibilityRole={i === 0 ? 'header' : undefined} style={[type.hero, { color: i === accent ? t.signal : t.text }]}>
          {l}
        </Text>
      ))}
    </View>
  );
}

export function Display({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  return (
    <Text accessibilityRole="header" style={[type.display, { color: t.text }, style]}>
      {children}
    </Text>
  );
}

export function Body({ children, muted, small, style }: { children: ReactNode; muted?: boolean; small?: boolean; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  return <Text style={[small ? type.footnote : type.body, { color: muted ? t.muted : t.text }, style]}>{children}</Text>;
}

/** Uppercase label with a rule running to the right edge. */
export function SectionLabel({ label, tone = 'muted', style }: { label: string; tone?: 'muted' | 'signal'; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={[styles.section, style]}>
      <Text style={[type.label, { color: tone === 'signal' ? t.signal : t.muted }]}>{label}</Text>
      <View style={[styles.rule, { backgroundColor: t.line }]} />
    </View>
  );
}

/** Three-cell instrument readout. */
export function Hud({ cells }: { cells: Array<{ value: string; unit?: string; label: string }> }) {
  const t = useTheme();
  return (
    <View style={[styles.hud, { borderColor: t.line }]}>
      {cells.map((c, i) => (
        <View key={c.label} style={[styles.hudCell, i < cells.length - 1 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: t.line }, i > 0 && { paddingLeft: 14 }]}>
          <Text style={[type.numberSmall, { color: t.text }]} numberOfLines={1}>
            {c.value}
            {c.unit ? <Text style={{ color: t.signal, fontSize: 17 }}> {c.unit}</Text> : null}
          </Text>
          <Text style={[type.labelSmall, { color: t.dim, marginTop: 6 }]}>{c.label}</Text>
        </View>
      ))}
    </View>
  );
}

/** Bordered slab button: signal (filled orange), ghost (orange outline), neutral (line outline). */
export function Slab({
  label,
  sub,
  icon,
  onPress,
  variant = 'signal',
  disabled,
  accessibilityLabel,
  compact,
  style,
}: {
  label: string;
  sub?: string;
  icon?: IconName;
  onPress: () => void;
  variant?: 'signal' | 'ghost' | 'neutral';
  disabled?: boolean;
  accessibilityLabel?: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const filled = variant === 'signal';
  const fg = filled ? t.onSignal : variant === 'ghost' ? t.signal : t.text;
  return (
    <Press
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.slab,
        compact && styles.slabCompact,
        {
          backgroundColor: filled ? t.signal : 'transparent',
          borderColor: variant === 'neutral' ? t.line : t.signal,
          opacity: disabled ? 0.4 : 1,
          shadowColor: t.signal,
          shadowOpacity: filled ? 0.3 : 0,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={compact ? 18 : 22} color={fg} strokeWidth={2} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={[type.title, compact && { fontSize: 18, lineHeight: 20 }, { color: fg }]}>{label}</Text>
        {sub ? <Text style={[type.labelSmall, { color: fg, opacity: 0.75, marginTop: 3, lineHeight: 16 }]}>{sub}</Text> : null}
      </View>
    </Press>
  );
}

/** Scenario tile: small caption, big condensed word, icon top-right. */
export function Tile({
  title,
  caption,
  icon,
  onPress,
  signal,
}: {
  title: string;
  caption: string;
  icon: IconName;
  onPress: () => void;
  signal?: boolean;
}) {
  const t = useTheme();
  const fg = signal ? t.onSignal : t.text;
  return (
    <Press accessibilityRole="button" accessibilityLabel={`${title}. ${caption}`} onPress={onPress} style={[styles.tile, { backgroundColor: signal ? t.signal : t.surface, borderColor: signal ? t.signal : t.line }]}>
      {signal ? <View style={styles.tileRing} /> : null}
      <View style={styles.tileIcon}>
        <Icon name={icon} size={22} color={signal ? t.onSignal : t.muted} />
      </View>
      <Text style={[type.footnote, { color: fg, opacity: signal ? 0.8 : 0.7 }]} numberOfLines={1}>
        {caption}
      </Text>
      <Text style={[type.title, { color: fg, marginTop: 2, fontSize: 23, lineHeight: 25 }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
        {title}
      </Text>
    </Press>
  );
}

/** Key/value row for instrument readouts; optional trailing action. */
export function KvRow({ k, v, note, onPress, icon }: { k: string; v: string; note?: string; onPress?: () => void; icon?: IconName }) {
  const t = useTheme();
  const inner = (
    <>
      <Text style={[type.labelSmall, { color: t.dim, width: 84 }]}>{k}</Text>
      <Text style={[type.numberSmall, { color: t.text, flex: 1, fontSize: 19, lineHeight: 24 }]} numberOfLines={1} selectable>
        {v}
        {note ? <Text style={[type.labelSmall, { color: t.dim }]}>  · {note}</Text> : null}
      </Text>
      {icon ? <Icon name={icon} size={18} color={t.signal} strokeWidth={2} /> : null}
    </>
  );
  return onPress ? (
    <Press accessibilityRole="button" accessibilityLabel={`${k}: ${v}`} onPress={onPress} scaleTo={0.99} style={[styles.kv, { borderBottomColor: t.line }]}>
      {inner}
    </Press>
  ) : (
    <View style={[styles.kv, { borderBottomColor: t.line }]}>{inner}</View>
  );
}

/** Icon in a thin square frame — list marker. */
export function IconFrame({ name, signal, size = 40 }: { name: IconName | string; signal?: boolean; size?: number }) {
  const t = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: radius.sm, borderWidth: 1, borderColor: signal ? t.signal : t.line, backgroundColor: signal ? t.signalSoft : t.surface, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={size * 0.5} color={signal ? t.signal : t.text} />
    </View>
  );
}

export function ListRow({ title, subtitle, left, right, onPress }: { title: string; subtitle?: string; left?: ReactNode; right?: ReactNode; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Press accessibilityRole={onPress ? 'button' : undefined} disabled={!onPress} onPress={onPress} scaleTo={0.99} style={[styles.row, { borderBottomColor: t.line }]}>
      {left}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.headline, { color: t.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[type.footnote, { color: t.muted }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <Icon name="chevronRight" size={18} color={t.dim} /> : null)}
    </Press>
  );
}

export function List({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.line }}>{Children.toArray(children)}</View>;
}

/** Outlined caps chip; active = filled signal. */
export function Chip({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon?: IconName }) {
  const t = useTheme();
  return (
    <Press accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} scaleTo={0.95} style={[styles.chip, { backgroundColor: active ? t.signal : t.surface, borderColor: active ? t.signal : t.line }]}>
      {icon ? <Icon name={icon} size={14} color={active ? t.onSignal : t.signal} strokeWidth={2} /> : null}
      <Text style={[type.label, { color: active ? t.onSignal : t.text, letterSpacing: 1.2 }]}>{label}</Text>
    </Press>
  );
}

/** Square checkbox with label; the whole row toggles. */
export function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  const t = useTheme();
  return (
    <Press accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={label} onPress={onToggle} scaleTo={0.99} style={styles.checkRow}>
      <View style={[styles.checkBox, { borderColor: checked ? t.signal : t.line, backgroundColor: checked ? t.signal : t.surface }]}>
        {checked ? <Icon name="check" size={16} color={t.onSignal} strokeWidth={2.6} /> : null}
      </View>
      <Text style={[type.callout, { color: t.text, flex: 1 }]}>{label}</Text>
    </Press>
  );
}

export function Badge({ label, tone = 'signal' }: { label: string; tone?: 'signal' | 'neutral' }) {
  const t = useTheme();
  return (
    <View style={[styles.badge, { borderColor: tone === 'signal' ? t.signal : t.line }]}>
      <Text style={[type.labelSmall, { color: tone === 'signal' ? t.signal : t.muted }]}>{label}</Text>
    </View>
  );
}

export function Note({ text, icon = 'info' }: { text: string; icon?: IconName }) {
  const t = useTheme();
  return (
    <View style={[styles.note, { borderLeftColor: t.signal }]}>
      <Icon name={icon} size={16} color={t.signal} />
      <Text style={[type.footnote, { color: t.muted, flex: 1 }]}>{text}</Text>
    </View>
  );
}

export function callEmergency(number = '112') {
  void Linking.openURL(`tel:${number}`).catch(() => undefined);
}

/** Orange alert bar — tap to call. */
export function AlertBar({ text, onPress, style }: { text: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <Press accessibilityRole="button" accessibilityLabel={text} onPress={onPress ?? (() => callEmergency())} style={[styles.alert, { backgroundColor: t.signal }, style]}>
      <Icon name="warning" size={18} color={t.onSignal} strokeWidth={2.2} />
      <Text numberOfLines={1} style={[type.label, { color: t.onSignal, flex: 1, letterSpacing: 1.2 }]}>
        {text}
      </Text>
      <Icon name="phone" size={18} color={t.onSignal} strokeWidth={2.2} />
    </Press>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xl, paddingBottom: 6, minHeight: 20 },
  stripLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 6, height: 6, borderRadius: 3, shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  section: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rule: { flex: 1, height: StyleSheet.hairlineWidth },
  hud: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  hudCell: { flex: 1, paddingVertical: 12, paddingRight: 10 },
  slab: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  slabCompact: { minHeight: 48, paddingHorizontal: 14, paddingVertical: 8, gap: 10 },
  tile: { height: 110, flexBasis: '47%', flexGrow: 1, borderWidth: 1, borderRadius: radius.sm, padding: 14, justifyContent: 'flex-end', overflow: 'hidden' },
  tileRing: { position: 'absolute', right: -30, bottom: -40, width: 120, height: 120, borderRadius: 60, borderWidth: 14, borderColor: 'rgba(0,0,0,0.12)' },
  tileIcon: { position: 'absolute', right: 12, top: 12 },
  kv: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, minHeight: 66 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, minHeight: 36 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  checkBox: { width: 26, height: 26, borderWidth: 1.5, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  badge: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  note: { flexDirection: 'row', gap: 10, alignItems: 'center', borderLeftWidth: 2, paddingLeft: 12, paddingVertical: 4 },
  alert: { height: 40, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
});
