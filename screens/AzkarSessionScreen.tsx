import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../lib/settings';
import { AZKAR, dateKey, type AzkarCategory } from '../lib/azkar';
import { ArabicText, Button, Card, ScreenHeader, Txt } from '../components/ui';
import { progressFor } from './AzkarScreen';

export default function AzkarSessionScreen({ route }: any) {
  const { s, t, theme, update, isRTL } = useApp();
  const cat: AzkarCategory = route.params?.category ?? 'morning';
  const list = AZKAR[cat];
  const titleKey = cat === 'morning' ? 'morning_azkar' : cat === 'evening' ? 'evening_azkar' : 'sleep_azkar';
  const { done, map } = progressFor(s.azkar, cat);
  const firstOpen = list.findIndex((z) => (map[`${cat}:${z.id}`] ?? 0) < z.count);
  const [idx, setIdx] = useState(firstOpen === -1 ? 0 : firstOpen);
  const pulse = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (pending.current) clearTimeout(pending.current); }, []);

  const z = list[idx];
  const key = `${cat}:${z.id}`;
  const current = Math.min(map[key] ?? 0, z.count);
  const complete = current >= z.count;
  const allDone = done === list.length;
  const pct = done / list.length;

  const write = (k: string, v: number) => {
    const today = dateKey();
    const base = s.azkar.date === today ? s.azkar.progress : {};
    update({ azkar: { date: today, progress: { ...base, [k]: v } } });
  };

  const goto = (i: number) => {
    setIdx(i);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const tap = () => {
    if (complete) return;
    const n = current + 1;
    write(key, n);
    Animated.sequence([
      Animated.timing(pulse, { toValue: 0.93, duration: 70, useNativeDriver: true }),
      Animated.spring(pulse, { toValue: 1, useNativeDriver: true, bounciness: 12 }),
    ]).start();
    Haptics.impactAsync(n >= z.count ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (n >= z.count) {
      const isOpen = (i: number) => (map[`${cat}:${list[i].id}`] ?? 0) < list[i].count;
      let nextOpen = -1;
      for (let step = 1; step < list.length; step++) {
        const i = (idx + step) % list.length;
        if (isOpen(i)) { nextOpen = i; break; }
      }
      if (nextOpen !== -1) {
        if (pending.current) clearTimeout(pending.current);
        pending.current = setTimeout(() => goto(nextOpen), 450);
      }
    }
  };

  const resetAll = () => {
    const today = dateKey();
    const base = s.azkar.date === today ? { ...s.azkar.progress } : {};
    list.forEach((it) => { delete base[`${cat}:${it.id}`]; });
    update({ azkar: { date: today, progress: base } });
    goto(0);
  };

  const dots = useMemo(() => list.map((it, i) => ({ i, ok: (map[`${cat}:${it.id}`] ?? 0) >= it.count })), [list, map, cat]);
  const ratio = z.count ? current / z.count : 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader back title={t(titleKey)} subtitle={`${done}/${list.length} ${t('completed')}`} />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ height: 10, borderRadius: 5, backgroundColor: theme.card2, overflow: 'hidden' }}>
          <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: theme.primary, borderRadius: 5 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 12 }}>
          {dots.map((d) => (
            <Pressable key={d.i} onPress={() => goto(d.i)} style={{
              width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
              backgroundColor: d.i === idx ? theme.primary : d.ok ? theme.success + '33' : theme.card2,
              borderWidth: 1, borderColor: d.i === idx ? theme.primary : theme.border,
            }}>
              {d.ok && d.i !== idx ? <Ionicons name="checkmark" size={16} color={theme.success} />
                : <Text style={{ color: d.i === idx ? theme.onPrimary : theme.sub, fontWeight: '700', fontSize: 12 }}>{d.i + 1}</Text>}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 14 }}>
        {allDone ? (
          <Card style={{ alignItems: 'center', gap: 10, backgroundColor: theme.success + '22', borderColor: theme.success }}>
            <Ionicons name="checkmark-circle" size={44} color={theme.success} />
            <Txt center v="h2">{t('all_done')}</Txt>
            <Button kind="outline" icon="refresh" label={t('restart')} onPress={resetAll} />
          </Card>
        ) : null}
        <Card style={{ paddingVertical: 20 }}>
          <ArabicText size={z.ar.length > 400 ? 24 : 28}>{z.ar}</ArabicText>
          <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 14 }} />
          <Txt v="caption" sub style={{ marginBottom: 4 }}>{t('translation')}</Txt>
          <Txt v="body" style={{ textAlign: 'left', writingDirection: 'ltr' }}>{z.en}</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <Ionicons name="library-outline" size={14} color={theme.accent} />
            <Text style={{ color: theme.accent, fontSize: 12, fontWeight: '700' }}>{z.source}</Text>
            <View style={{ flex: 1 }} />
            <Txt v="caption" sub>{t('repeat_n', { n: z.count })}</Txt>
          </View>
        </Card>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => goto(Math.max(0, idx - 1))} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1, padding: 10 }} accessibilityLabel={t('prev')}>
          <Ionicons name={isRTL ? 'chevron-forward-circle' : 'chevron-back-circle'} size={44} color={theme.primary} />
        </Pressable>
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <Pressable onPress={tap} accessibilityLabel={t('tap_to_count')} style={{
            width: 132, height: 132, borderRadius: 66, alignItems: 'center', justifyContent: 'center',
            backgroundColor: complete ? theme.success : theme.primary,
            borderWidth: 6, borderColor: (complete ? theme.success : theme.primary) + '44',
            shadowColor: theme.primary, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8,
          }}>
            {complete ? <Ionicons name="checkmark" size={56} color="#fff" /> : (
              <>
                <Text style={{ color: theme.onPrimary, fontSize: 44, fontWeight: '900', lineHeight: 50 }}>{current}</Text>
                <Text style={{ color: theme.onPrimary + 'cc', fontSize: 14, fontWeight: '700' }}>/ {z.count}</Text>
              </>
            )}
          </Pressable>
        </Animated.View>
        <Pressable onPress={() => goto(Math.min(list.length - 1, idx + 1))} disabled={idx === list.length - 1} style={{ opacity: idx === list.length - 1 ? 0.3 : 1, padding: 10 }} accessibilityLabel={t('next')}>
          <Ionicons name={isRTL ? 'chevron-back-circle' : 'chevron-forward-circle'} size={44} color={theme.primary} />
        </Pressable>
      </View>
      <View style={{ height: 4, marginHorizontal: 60, marginBottom: 14, borderRadius: 2, backgroundColor: theme.card2, overflow: 'hidden' }}>
        <View style={{ width: `${ratio * 100}%`, height: '100%', backgroundColor: theme.accent }} />
      </View>
    </View>
  );
}
