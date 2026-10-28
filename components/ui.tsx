import React, { useRef } from 'react';
import {
  Animated, Pressable, StyleSheet, Switch, Text, View, type StyleProp, type TextStyle, type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/settings';
import { PalestineFlag } from './PalestineFlag';

export const ARABIC_FONT = 'Amiri_400Regular';
export const ARABIC_BOLD = 'Amiri_700Bold';

type Variant = 'hero' | 'title' | 'h2' | 'body' | 'small' | 'caption';
const SIZES: Record<Variant, { fontSize: number; fontWeight: TextStyle['fontWeight']; lineHeight: number }> = {
  hero: { fontSize: 34, fontWeight: '800', lineHeight: 42 },
  title: { fontSize: 24, fontWeight: '800', lineHeight: 32 },
  h2: { fontSize: 18, fontWeight: '700', lineHeight: 26 },
  body: { fontSize: 15, fontWeight: '500', lineHeight: 23 },
  small: { fontSize: 13, fontWeight: '500', lineHeight: 19 },
  caption: { fontSize: 11.5, fontWeight: '600', lineHeight: 16 },
};

export function Txt({
  v = 'body', color, center, style, children, numberOfLines, sub,
}: {
  v?: Variant; color?: string; center?: boolean; style?: StyleProp<TextStyle>;
  children?: React.ReactNode; numberOfLines?: number; sub?: boolean;
}) {
  const { theme, align } = useApp();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        SIZES[v],
        { color: color ?? (sub ? theme.sub : theme.text), textAlign: center ? 'center' : align },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function ArabicText({ children, size = 26, color, style, center = true }: {
  children: React.ReactNode; size?: number; color?: string; style?: StyleProp<TextStyle>; center?: boolean;
}) {
  const { theme } = useApp();
  return (
    <Text
      style={[
        { fontFamily: ARABIC_FONT, fontSize: size, lineHeight: size * 1.9, color: color ?? theme.text,
          textAlign: center ? 'center' : 'right', writingDirection: 'rtl' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const { theme } = useApp();
  const base: ViewStyle = {
    backgroundColor: theme.card, borderRadius: 20, padding: 16, borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border, shadowColor: '#000', shadowOpacity: theme.dark ? 0.35 : 0.07,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  };
  if (onPress) return <PressScale onPress={onPress} style={[base, style]}>{children}</PressScale>;
  return <View style={[base, style]}>{children}</View>;
}

export function PressScale({ children, onPress, style, disabled, onLongPress, hitSlop }: {
  children: React.ReactNode; onPress?: () => void; onLongPress?: () => void; style?: StyleProp<ViewStyle>;
  disabled?: boolean; hitSlop?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  return (
    <Pressable
      onPress={onPress} onLongPress={onLongPress} disabled={disabled} hitSlop={hitSlop}
      onPressIn={() => to(0.96)} onPressOut={() => to(1)}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export function FadeIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const v = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 420, delay, useNativeDriver: true }).start();
  }, [v, delay]);
  return (
    <Animated.View style={[{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }, style]}>
      {children}
    </Animated.View>
  );
}

export function Button({ label, onPress, icon, kind = 'primary', color, disabled, style }: {
  label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; kind?: 'primary' | 'soft' | 'outline' | 'danger';
  color?: string; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useApp();
  const bg = kind === 'primary' ? (color ?? theme.primary) : kind === 'danger' ? theme.danger : kind === 'soft' ? theme.card2 : 'transparent';
  const fg = kind === 'primary' || kind === 'danger' ? (color ? '#fff' : theme.onPrimary) : theme.primary;
  return (
    <PressScale onPress={onPress} disabled={disabled} style={[
      { backgroundColor: bg, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center', gap: 8, opacity: disabled ? 0.5 : 1 },
      kind === 'outline' && { borderWidth: 1.5, borderColor: theme.primary },
      style,
    ]}>
      {icon ? <Ionicons name={icon} size={20} color={fg} /> : null}
      <Text style={{ color: fg, fontWeight: '700', fontSize: 15 }}>{label}</Text>
    </PressScale>
  );
}

export function Chip({ label, active, onPress, icon }: { label: string; active?: boolean; onPress?: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  const { theme } = useApp();
  return (
    <PressScale onPress={onPress} style={{
      paddingVertical: 9, paddingHorizontal: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: active ? theme.primary : theme.card2,
      borderWidth: 1, borderColor: active ? theme.primary : theme.border,
    }}>
      {icon ? <Ionicons name={icon} size={16} color={active ? theme.onPrimary : theme.sub} /> : null}
      <Text style={{ color: active ? theme.onPrimary : theme.text, fontWeight: '600', fontSize: 13.5 }}>{label}</Text>
    </PressScale>
  );
}

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  const { theme } = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 }}>
      <Txt v="h2" color={theme.text}>{children}</Txt>
      {right}
    </View>
  );
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { theme } = useApp();
  return (
    <Switch
      value={value} onValueChange={onChange}
      trackColor={{ false: theme.border, true: theme.primary }}
      thumbColor="#fff"
    />
  );
}

export function IconBadge({ name, color, size = 44, bg }: { name: keyof typeof Ionicons.glyphMap; color?: string; size?: number; bg?: string }) {
  const { theme } = useApp();
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.34, backgroundColor: bg ?? theme.card2, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={size * 0.5} color={color ?? theme.primary} />
    </View>
  );
}

export function FreePalestineChip({ compact }: { compact?: boolean }) {
  const { t, theme } = useApp();
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5, paddingHorizontal: 10,
      borderRadius: 999, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
    }}>
      <PalestineFlag width={compact ? 26 : 32} radius={3} />
      <Text style={{ color: theme.text, fontWeight: '800', fontSize: 12.5 }}>{t('free_palestine')}</Text>
    </View>
  );
}

/** Header used on every screen. Flag is always visible at the top. */
export function ScreenHeader({ title, subtitle, back, right }: { title: string; subtitle?: string; back?: boolean; right?: React.ReactNode }) {
  const { theme, isRTL } = useApp();
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  return (
    <View style={{
      paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 16, backgroundColor: theme.bg,
      flexDirection: 'row', alignItems: 'center', gap: 12,
    }}>
      {back ? (
        <PressScale onPress={() => nav.goBack()} style={{
          width: 40, height: 40, borderRadius: 14, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center',
          borderWidth: StyleSheet.hairlineWidth, borderColor: theme.border,
        }}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={22} color={theme.text} />
        </PressScale>
      ) : null}
      <View style={{ flex: 1 }}>
        <Txt v="title" numberOfLines={1}>{title}</Txt>
        {subtitle ? <Txt v="small" sub numberOfLines={1}>{subtitle}</Txt> : null}
      </View>
      {right}
      <PalestineFlag width={46} radius={4} />
    </View>
  );
}

export function TimeStepper({ value, onChange, h24 }: { value: { h: number; m: number }; onChange: (v: { h: number; m: number }) => void; h24: boolean }) {
  const { theme } = useApp();
  const total = value.h * 60 + value.m;
  const step = (d: number) => {
    const n = (total + d + 1440) % 1440;
    onChange({ h: Math.floor(n / 60), m: n % 60 });
  };
  const pad = (n: number) => String(n).padStart(2, '0');
  const h12 = value.h % 12 === 0 ? 12 : value.h % 12;
  const label = h24 ? `${pad(value.h)}:${pad(value.m)}` : `${h12}:${pad(value.m)} ${value.h >= 12 ? 'PM' : 'AM'}`;
  const btn = (name: keyof typeof Ionicons.glyphMap, d: number) => (
    <Pressable onPress={() => step(d)} hitSlop={6} style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={16} color={theme.primary} />
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessibilityRole="adjustable">
      {btn('remove', -15)}
      <Text style={{ color: theme.text, fontWeight: '700', minWidth: 74, textAlign: 'center', fontSize: 14 }}>{label}</Text>
      {btn('add', 15)}
    </View>
  );
}
