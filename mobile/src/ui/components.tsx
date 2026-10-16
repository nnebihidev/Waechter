import Ionicons from '@expo/vector-icons/Ionicons';
import { Children, type ComponentProps, type ReactNode } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { radius, space, type, useTheme } from './theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** Eight-point compass star — the Kompass mark. */
export function BrandMark({ size = 30, color }: { size?: number; color?: string }) {
  const t = useTheme();
  const c = color ?? t.primary;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityElementsHidden importantForAccessibility="no">
      <Path d="M16 1 L18.6 13.4 L31 16 L18.6 18.6 L16 31 L13.4 18.6 L1 16 L13.4 13.4 Z" fill={c} />
      <Path d="M16 7 L17.4 14.6 L25 16 L17.4 17.4 L16 25 L14.6 17.4 L7 16 L14.6 14.6 Z" fill={c} opacity={0.35} transform="rotate(45 16 16)" />
      <Circle cx={16} cy={16} r={2.2} fill={t.card} />
    </Svg>
  );
}

/** Large-title header with brand line, used at the top of every tab. */
export function ScreenHeader({ title, right }: { title: string; right?: ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + space.sm, backgroundColor: t.bg }]}>
      <View style={styles.brandRow}>
        <BrandMark size={26} />
        <Text style={[styles.brand, { color: t.primary }]}>Kompass</Text>
        <View style={{ flex: 1 }} />
        {right}
      </View>
      <Text accessibilityRole="header" style={[type.largeTitle, { color: t.text }]}>
        {title}
      </Text>
    </View>
  );
}

export function Card({ children, style, padded = true }: { children: ReactNode; style?: ViewStyle; padded?: boolean }) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.card, borderColor: t.border, shadowColor: t.shadow },
        padded && { padding: space.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function CardTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  const t = useTheme();
  return (
    <View style={styles.cardTitle}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.headline, { color: t.text }]}>{title}</Text>
        {subtitle ? <Text style={[type.footnote, { color: t.muted }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function H2({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={[type.headline, { color: t.text }]}>{children}</Text>;
}

export function Body({ children, muted, small }: { children: ReactNode; muted?: boolean; small?: boolean }) {
  const t = useTheme();
  return <Text style={[small ? type.footnote : type.callout, { color: muted ? t.muted : t.text }]}>{children}</Text>;
}

/** Coloured uppercase label with a hairline running to the right edge. */
export function SectionLabel({ label, tone = 'primary' }: { label: string; tone?: 'primary' | 'danger' }) {
  const t = useTheme();
  return (
    <View style={styles.sectionLabel}>
      <Text style={[type.overline, { color: tone === 'danger' ? t.danger : t.primary }]}>{label}</Text>
      <View style={[styles.sectionLine, { backgroundColor: t.divider }]} />
    </View>
  );
}

export function IconCircle({
  name,
  tone = 'soft',
  size = 44,
}: {
  name: IconName;
  tone?: 'soft' | 'solid' | 'danger' | 'dangerSoft';
  size?: number;
}) {
  const t = useTheme();
  const bg = { soft: t.primarySoft, solid: t.primary, danger: t.dangerFill, dangerSoft: t.dangerSoft }[tone];
  const fg = { soft: t.primary, solid: t.onPrimary, danger: t.onDanger, dangerSoft: t.danger }[tone];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={size * 0.48} color={fg} />
    </View>
  );
}

/** A card holding rows separated by hairlines. */
export function ListGroup({ children }: { children: ReactNode }) {
  const t = useTheme();
  const items = Children.toArray(children);
  return (
    <Card padded={false} style={{ gap: 0, overflow: 'hidden' }}>
      {items.map((child, i) => (
        <View key={i}>
          {i > 0 ? <View style={[styles.rowDivider, { backgroundColor: t.divider }]} /> : null}
          {child}
        </View>
      ))}
    </Card>
  );
}

export function ListRow({
  title,
  subtitle,
  left,
  right,
  onPress,
  accessibilityHint,
}: {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  accessibilityHint?: string;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityHint={accessibilityHint}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? t.primarySofter : 'transparent' }]}
    >
      {left}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.headline, { color: t.text, fontSize: 16 }]}>{title}</Text>
        {subtitle ? (
          <Text style={[type.footnote, { color: t.muted }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={t.faint} /> : null)}
    </Pressable>
  );
}

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'dangerOutline';

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled,
  accessibilityLabel,
  compact,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: ButtonVariant | 'secondary';
  disabled?: boolean;
  accessibilityLabel?: string;
  compact?: boolean;
  style?: ViewStyle;
}) {
  const t = useTheme();
  const v: ButtonVariant = variant === 'secondary' ? 'outline' : variant;
  const solid = v === 'primary' || v === 'danger';
  const tone = v === 'danger' || v === 'dangerOutline' ? t.danger : t.primary;
  const fg = solid ? (v === 'danger' ? t.onDanger : t.onPrimary) : tone;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        {
          backgroundColor: solid ? (v === 'danger' ? t.dangerFill : tone) : t.card,
          borderColor: v === 'danger' ? t.dangerFill : tone,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={compact ? 17 : 19} color={fg} /> : null}
      <Text style={[styles.buttonText, compact && { fontSize: 15 }, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon?: IconName }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, { borderColor: active ? t.primary : t.border, backgroundColor: active ? t.primary : t.card }]}
    >
      {icon ? <Ionicons name={icon} size={15} color={active ? t.onPrimary : t.primary} /> : null}
      <Text style={{ color: active ? t.onPrimary : t.text, fontWeight: '600', fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, tone = 'primary' }: { label: string; tone?: 'primary' | 'danger' | 'neutral' }) {
  const t = useTheme();
  const bg = tone === 'danger' ? t.dangerSoft : tone === 'neutral' ? t.divider : t.primarySoft;
  const fg = tone === 'danger' ? t.danger : tone === 'neutral' ? t.muted : t.accent;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={{ color: fg, fontSize: 13, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const t = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={[styles.track, { backgroundColor: t.divider }]}
    >
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: t.accent }]} />
    </View>
  );
}

/** Small tinted note with an info icon. */
export function InfoNote({ text, icon = 'information-circle-outline' }: { text: string; icon?: IconName }) {
  const t = useTheme();
  return (
    <View style={[styles.note, { backgroundColor: t.primarySofter }]}>
      <Ionicons name={icon} size={18} color={t.accent} />
      <Text style={[type.footnote, { color: t.muted, flex: 1 }]}>{text}</Text>
    </View>
  );
}

export function callEmergency(number = '112') {
  void Linking.openURL(`tel:${number}`).catch(() => undefined);
}

/** Thin red strip, e.g. on top of urgent guides. */
export function EmergencyBanner({ text, onPress }: { text: string; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      onPress={onPress}
      style={[styles.banner, { backgroundColor: t.dangerSoft, borderColor: t.dangerBorder }]}
    >
      <Ionicons name="warning" size={20} color={t.danger} />
      <Text style={[styles.bannerText, { color: t.danger }]}>{text}</Text>
    </Pressable>
  );
}

/** Prominent "call 112" card with a tap-to-call action. */
export function EmergencyCallCard({ title, subtitle, callLabel }: { title: string; subtitle: string; callLabel: string }) {
  const t = useTheme();
  return (
    <View style={[styles.callCard, { backgroundColor: t.dangerSoft, borderColor: t.dangerBorder }]}>
      <View style={[styles.callIcon, { backgroundColor: t.dangerFill }]}>
        <Ionicons name="call" size={22} color={t.onDanger} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: t.danger, fontSize: 20, fontWeight: '800' }}>{title}</Text>
        <Text style={[type.footnote, { color: t.danger }]}>{subtitle}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={callLabel}
        onPress={() => callEmergency()}
        style={({ pressed }) => [styles.callButton, { backgroundColor: t.dangerFill, opacity: pressed ? 0.85 : 1 }]}
      >
        <Ionicons name="call" size={16} color={t.onDanger} />
        <Text style={{ color: t.onDanger, fontWeight: '800', fontSize: 16 }}>112</Text>
      </Pressable>
    </View>
  );
}

export function Progress({ label, value }: { label: string; value?: number }) {
  const t = useTheme();
  return (
    <View style={{ gap: space.sm }}>
      <View style={styles.progressRow}>
        <ActivityIndicator color={t.accent} />
        <Text style={[type.callout, { color: t.muted, flex: 1 }]}>{label}</Text>
        {value !== undefined && value > 0 ? (
          <Text style={[type.callout, { color: t.muted, fontVariant: ['tabular-nums'] }]}>{Math.round(value * 100)} %</Text>
        ) : null}
      </View>
      {value !== undefined && value > 0 ? <ProgressBar value={value} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: space.lg, paddingBottom: space.md, gap: space.xs },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 36 },
  brand: { fontSize: 20, fontWeight: '800', letterSpacing: -0.2 },
  card: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: space.md,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.sm },
  sectionLine: { flex: 1, height: StyleSheet.hairlineWidth },
  rowDivider: { height: StyleSheet.hairlineWidth, marginLeft: 72 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md, minHeight: 64 },
  button: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  buttonCompact: { minHeight: 42, paddingHorizontal: space.md },
  buttonText: { fontSize: 17, fontWeight: '700' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    minHeight: 40,
  },
  badge: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  note: { flexDirection: 'row', gap: space.sm, alignItems: 'center', borderRadius: radius.sm, padding: space.md },
  banner: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderWidth: 1, borderRadius: radius.md, padding: space.md },
  bannerText: { flex: 1, fontSize: 15, fontWeight: '700' },
  callCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderWidth: 1, borderRadius: radius.md, padding: space.md },
  callIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  callButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: space.lg, minHeight: 44 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
