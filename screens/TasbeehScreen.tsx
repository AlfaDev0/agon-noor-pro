import React, { useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../lib/settings';
import { TASBEEH_PRESETS } from '../lib/azkar';
import { ArabicText, Chip, ScreenHeader, Txt, Card } from '../components/ui';

const SIZE = 270;
const DOTS = 48;
const TARGETS = [33, 99, 100, 500, 1000];

export function ProgressDots({ ratio, color, off }: { ratio: number; color: string; off: string }) {
  const lit = Math.round(ratio * DOTS);
  const r = SIZE / 2 - 8;
  return (
    <>
      {Array.from({ length: DOTS }).map((_, i) => {
        const a = (i / DOTS) * Math.PI * 2 - Math.PI / 2;
        return (
          <View
            key={i}
            style={{
              position: 'absolute', width: 9, height: 9, borderRadius: 5,
              left: SIZE / 2 + Math.cos(a) * r - 4.5, top: SIZE / 2 + Math.sin(a) * r - 4.5,
              backgroundColor: i < lit ? color : off,
            }}
          />
        );
      })}
    </>
  );
}

export default function TasbeehScreen() {
  const { s, t, theme, update } = useApp();
  const tb = s.tasbeeh;
  const preset = TASBEEH_PRESETS.find((p) => p.id === tb.preset) ?? TASBEEH_PRESETS[0];
  const scale = useRef(new Animated.Value(1)).current;

  const tap = () => {
    const n = tb.count + 1;
    const hit = n >= tb.target;
    update({ tasbeeh: { ...tb, count: hit ? 0 : n, cycles: tb.cycles + (hit ? 1 : 0), total: tb.total + 1 } });
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 60, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
    ]).start();
    if (hit) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader back title={t('tasbeeh')} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', gap: 16, paddingBottom: 40 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ alignSelf: 'stretch', flexGrow: 0 }}>
          {TASBEEH_PRESETS.map((p) => (
            <Chip key={p.id} label={p.en} active={p.id === tb.preset}
              onPress={() => update({ tasbeeh: { ...tb, preset: p.id, target: p.target, count: 0 } })} />
          ))}
        </ScrollView>
        <ArabicText size={34} color={theme.primary}>{preset.ar}</ArabicText>

        <View style={{ width: SIZE, height: SIZE }}>
          <ProgressDots ratio={tb.count / tb.target} color={theme.primary} off={theme.card2} />
          <Animated.View style={{ position: 'absolute', left: 28, top: 28, right: 28, bottom: 28, transform: [{ scale }] }}>
            <Pressable onPress={tap} accessibilityLabel={t('tap_to_count')} style={{
              flex: 1, borderRadius: 999, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center',
              shadowColor: theme.primary, shadowOpacity: 0.45, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10,
            }}>
              <Text style={{ color: theme.onPrimary, fontSize: 72, fontWeight: '900', lineHeight: 80 }}>{tb.count}</Text>
              <Text style={{ color: theme.onPrimary + 'cc', fontSize: 14, fontWeight: '700' }}>/ {tb.target}</Text>
              <Text style={{ color: theme.onPrimary + '99', fontSize: 12, marginTop: 6 }}>{t('tap_to_count')}</Text>
            </Pressable>
          </Animated.View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'stretch' }}>
          <Card style={{ flex: 1, alignItems: 'center', padding: 12 }}>
            <Txt v="caption" sub center>{t('cycles')}</Txt>
            <Text style={{ color: theme.text, fontWeight: '900', fontSize: 24 }}>{tb.cycles}</Text>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center', padding: 12 }}>
            <Txt v="caption" sub center>{t('total')}</Txt>
            <Text style={{ color: theme.text, fontWeight: '900', fontSize: 24 }}>{tb.total}</Text>
          </Card>
          <Pressable
            onPress={() => update({ tasbeeh: { ...tb, count: 0, cycles: 0, total: 0 } })}
            style={{ flex: 1, borderRadius: 20, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center', gap: 4 }}
          >
            <Ionicons name="refresh" size={22} color={theme.danger} />
            <Text style={{ color: theme.danger, fontWeight: '700', fontSize: 12 }}>{t('reset')}</Text>
          </Pressable>
        </View>

        <View style={{ alignSelf: 'stretch' }}>
          <Txt v="caption" sub style={{ marginBottom: 8 }}>{t('target')}</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {TARGETS.map((n) => (
              <Chip key={n} label={String(n)} active={tb.target === n} onPress={() => update({ tasbeeh: { ...tb, target: n, count: 0 } })} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
