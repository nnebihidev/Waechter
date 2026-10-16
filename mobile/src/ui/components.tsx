import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { radius, space, useTheme } from './theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const t = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }, style]}>{children}</View>
  );
}

export function H2({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={[styles.h2, { color: t.text }]}>{children}</Text>;
}

export function Body({ children, muted }: { children: ReactNode; muted?: boolean }) {
  const t = useTheme();
  return <Text style={[styles.body, { color: muted ? t.muted : t.text }]}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const t = useTheme();
  const bg = variant === 'primary' ? t.primary : variant === 'danger' ? t.danger : 'transparent';
  const fg = variant === 'primary' ? t.onPrimary : variant === 'danger' ? t.onDanger : t.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, borderColor: variant === 'secondary' ? t.primary : bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
      <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function EmergencyBanner({ text, onPress }: { text: string; onPress?: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      onPress={onPress}
      style={[styles.banner, { backgroundColor: t.dangerSoft, borderColor: t.danger }]}
    >
      <Ionicons name="call" size={20} color={t.danger} />
      <Text style={[styles.bannerText, { color: t.danger }]}>{text}</Text>
    </Pressable>
  );
}

export function Progress({ label, value }: { label: string; value?: number }) {
  const t = useTheme();
  return (
    <View style={styles.progress}>
      <ActivityIndicator color={t.primary} />
      <Text style={[styles.body, { color: t.muted, flex: 1 }]}>
        {label}
        {value !== undefined && value > 0 ? ` ${Math.round(value * 100)} %` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, padding: space.lg, gap: space.sm },
  h2: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 21 },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: space.md,
  },
  bannerText: { flex: 1, fontSize: 15, fontWeight: '700' },
  progress: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md },
});
