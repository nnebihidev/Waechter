import { LinearGradient } from 'expo-linear-gradient';
import { Children, useEffect, type ReactNode } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass, Press } from './glass';
import { BrandMark, Icon, type IconName } from './icons';
import { font, radius, space, type, useTheme } from './theme';

export { BrandMark, Icon, type IconName } from './icons';
export { Glass, Press, Reveal, Screen } from './glass';

/** Large-title header with the brand line; sits on the backdrop (no bar). */
export function ScreenHeader({ title, eyebrow, right }: { title: string; eyebrow?: string; right?: ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + space.md }]}>
      <View style={styles.brandRow}>
        <BrandMark size={24} />
        <Text style={[type.caption, { color: t.primary, letterSpacing: 2, textTransform: 'uppercase' }]}>Kompass</Text>
        <View style={{ flex: 1 }} />
        {right}
      </View>
      {eyebrow ? <Text style={[type.footnote, { color: t.muted }]}>{eyebrow}</Text> : null}
      <Text accessibilityRole="header" style={[type.display, { color: t.text }]}>
        {title}
      </Text>
    </View>
  );
}

export function Card({
  children,
  style,
  contentStyle,
  padded = true,
  strong,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padded?: boolean;
  strong?: boolean;
}) {
  return (
    <Glass style={style} padded={padded} strong={strong} radiusSize="lg">
      <View style={[{ gap: space.md }, contentStyle]}>{children}</View>
    </Glass>
  );
}

export function CardTitle({ title, subtitle, right, icon }: { title: string; subtitle?: string; right?: ReactNode; icon?: IconName }) {
  const t = useTheme();
  return (
    <View style={styles.cardTitle}>
      {icon ? <IconBadge name={icon} size={38} /> : null}
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

export function SectionLabel({ label, tone = 'primary' }: { label: string; tone?: 'primary' | 'danger' }) {
  const t = useTheme();
  const c = tone === 'danger' ? t.danger : t.primary;
  return (
    <View style={styles.sectionLabel}>
      <View style={[styles.sectionDot, { backgroundColor: c }]} />
      <Text style={[type.overline, { color: c }]}>{label}</Text>
    </View>
  );
}

type BadgeTone = 'soft' | 'solid' | 'danger' | 'dangerSoft' | 'amber';

/** Icon on a tinted circle with a faint gradient — the app's row/feature marker. */
export function IconBadge({ name, tone = 'soft', size = 44 }: { name: IconName | string; tone?: BadgeTone; size?: number }) {
  const t = useTheme();
  const dark = t.scheme === 'dark';
  const map: Record<BadgeTone, { bg: [string, string]; fg: string }> = {
    soft: { bg: dark ? ['rgba(79,227,163,0.28)', 'rgba(79,227,163,0.08)'] : ['rgba(22,122,83,0.2)', 'rgba(22,122,83,0.06)'], fg: t.primary },
    solid: { bg: dark ? ['#4FE3A3', '#1FB07A'] : ['#1E8C60', '#126244'], fg: t.onPrimary },
    danger: { bg: ['#E8483A', '#C22D22'], fg: '#FFFFFF' },
    dangerSoft: { bg: ['rgba(217,59,46,0.26)', 'rgba(217,59,46,0.08)'], fg: t.danger },
    amber: { bg: dark ? ['rgba(242,185,80,0.3)', 'rgba(242,185,80,0.08)'] : ['rgba(230,162,50,0.28)', 'rgba(230,162,50,0.08)'], fg: t.amber },
  };
  const { bg, fg } = map[tone];
  return (
    <LinearGradient colors={bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} size={size * 0.5} color={fg} strokeWidth={1.9} />
    </LinearGradient>
  );
}

export function ListGroup({ children }: { children: ReactNode }) {
  const t = useTheme();
  const items = Children.toArray(children);
  return (
    <Glass radiusSize="lg">
      {items.map((child, i) => (
        <View key={i}>
          {i > 0 ? <View style={[styles.rowDivider, { backgroundColor: t.divider }]} /> : null}
          {child}
        </View>
      ))}
    </Glass>
  );
}

export function ListRow({
  title,
  subtitle,
  left,
  right,
  onPress,
}: {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
}) {
  const t = useTheme();
  return (
    <Press accessibilityRole={onPress ? 'button' : undefined} disabled={!onPress} onPress={onPress} scaleTo={0.985} style={styles.row}>
      {left}
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[type.headline, { color: t.text, fontSize: 16 }]}>{title}</Text>
        {subtitle ? (
          <Text style={[type.footnote, { color: t.muted }]} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <Icon name="chevronRight" size={18} color={t.faint} /> : null)}
    </Press>
  );
}

type ButtonVariant = 'primary' | 'glass' | 'danger' | 'dangerGlass';

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
  variant?: ButtonVariant;
  disabled?: boolean;
  accessibilityLabel?: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const solid = variant === 'primary' || variant === 'danger';
  const danger = variant === 'danger' || variant === 'dangerGlass';
  const fg = solid ? (danger ? t.onDanger : t.onPrimary) : danger ? t.danger : t.primary;
  const gradient: [string, string] = danger ? ['#E8483A', '#C22D22'] : t.scheme === 'dark' ? ['#5CE9AE', '#22B57E'] : ['#1F8F62', '#126244'];
  const inner = (
    <View style={[styles.buttonInner, compact && styles.buttonCompact]}>
      {icon ? <Icon name={icon} size={compact ? 17 : 20} color={fg} strokeWidth={2} /> : null}
      <Text style={[styles.buttonText, compact && { fontSize: 15 }, { color: fg }]}>{label}</Text>
    </View>
  );
  return (
    <Press
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[{ opacity: disabled ? 0.45 : 1 }, style]}
    >
      {solid ? (
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, { shadowColor: gradient[1] }]}>
          {inner}
        </LinearGradient>
      ) : (
        <Glass radiusSize="md" strong style={danger ? { borderColor: t.dangerBorder } : undefined}>
          {inner}
        </Glass>
      )}
    </Press>
  );
}

export function Chip({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon?: IconName }) {
  const t = useTheme();
  return (
    <Press accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} scaleTo={0.94}>
      {active ? (
        <LinearGradient colors={t.scheme === 'dark' ? ['#5CE9AE', '#22B57E'] : ['#1F8F62', '#126244']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.chip}>
          {icon ? <Icon name={icon} size={15} color={t.onPrimary} strokeWidth={2} /> : null}
          <Text style={[font.bold, { color: t.onPrimary, fontSize: 15 }]}>{label}</Text>
        </LinearGradient>
      ) : (
        <Glass radiusSize="pill">
          <View style={styles.chip}>
            {icon ? <Icon name={icon} size={15} color={t.primary} strokeWidth={2} /> : null}
            <Text style={[font.semibold, { color: t.text, fontSize: 15 }]}>{label}</Text>
          </View>
        </Glass>
      )}
    </Press>
  );
}

export function Badge({ label, tone = 'primary' }: { label: string; tone?: 'primary' | 'danger' | 'neutral' }) {
  const t = useTheme();
  const bg = tone === 'danger' ? t.dangerSoft : tone === 'neutral' ? t.divider : t.userBubble;
  const fg = tone === 'danger' ? t.danger : tone === 'neutral' ? t.muted : t.primary;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[font.bold, { color: fg, fontSize: 12 }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const t = useTheme();
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withSpring(Math.max(0, Math.min(1, value)), { damping: 20, stiffness: 120 });
  }, [value, w]);
  const fill = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }} style={[styles.track, { backgroundColor: t.divider }]}>
      <Animated.View style={[styles.fill, fill]}>
        <LinearGradient colors={[t.accent, t.amber]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

export function InfoNote({ text, icon = 'info' }: { text: string; icon?: IconName }) {
  const t = useTheme();
  return (
    <View style={[styles.note, { backgroundColor: t.userBubble }]}>
      <Icon name={icon} size={18} color={t.primary} />
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
    <Press accessibilityRole={onPress ? 'button' : 'text'} onPress={onPress} style={[styles.banner, { backgroundColor: t.dangerSoft, borderColor: t.dangerBorder }]}>
      <Icon name="warning" size={20} color={t.danger} strokeWidth={2} />
      <Text style={[font.bold, { color: t.danger, fontSize: 15, flex: 1 }]}>{text}</Text>
    </Press>
  );
}

/** Prominent "call 112" card with a tap-to-call action. */
export function EmergencyCallCard({ title, subtitle, callLabel }: { title: string; subtitle: string; callLabel: string }) {
  const t = useTheme();
  return (
    <Glass radiusSize="lg" strong style={{ borderColor: t.dangerBorder }}>
      <View style={styles.callCard}>
        <IconBadge name="phone" tone="danger" size={46} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[font.extrabold, { color: t.danger, fontSize: 19 }]}>{title}</Text>
          <Text style={[type.footnote, { color: t.danger }]}>{subtitle}</Text>
        </View>
        <Press accessibilityRole="button" accessibilityLabel={callLabel} onPress={() => callEmergency()} scaleTo={0.92}>
          <LinearGradient colors={['#E8483A', '#C22D22']} style={styles.callButton}>
            <Icon name="phone" size={16} color="#fff" strokeWidth={2.2} />
            <Text style={[font.extrabold, { color: '#fff', fontSize: 16 }]}>112</Text>
          </LinearGradient>
        </Press>
      </View>
    </Glass>
  );
}

export function Progress({ label, value }: { label: string; value?: number }) {
  const t = useTheme();
  return (
    <View style={{ gap: space.sm }}>
      <View style={styles.progressRow}>
        <ActivityIndicator color={t.accent} />
        <Text style={[type.callout, { color: t.muted, flex: 1 }]}>{label}</Text>
        {value !== undefined && value > 0 ? <Text style={[type.callout, type.mono, { color: t.muted }]}>{Math.round(value * 100)} %</Text> : null}
      </View>
      {value !== undefined && value > 0 ? <ProgressBar value={value} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: space.xl, paddingBottom: space.lg, gap: space.xs },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 40, marginBottom: space.xs },
  cardTitle: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.sm, paddingHorizontal: space.xs },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  rowDivider: { height: StyleSheet.hairlineWidth, marginLeft: 76 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: 14, minHeight: 68 },
  button: { borderRadius: radius.md, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  buttonInner: { minHeight: 52, paddingHorizontal: space.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm },
  buttonCompact: { minHeight: 42, paddingHorizontal: space.md },
  buttonText: { ...font.bold, fontSize: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.lg, minHeight: 40, borderRadius: radius.pill },
  badge: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, overflow: 'hidden' },
  note: { flexDirection: 'row', gap: space.sm, alignItems: 'center', borderRadius: radius.sm, padding: space.md },
  banner: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderWidth: 1, borderRadius: radius.md, padding: space.md },
  callCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: 14 },
  callButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: 18, minHeight: 46 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
