import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../lib/settings';
import { AZKAR, dateKey, type AzkarCategory } from '../lib/azkar';
import { Card, FadeIn, PressScale, ScreenHeader, Txt } from '../components/ui';

export function progressFor(azkar: { date: string; progress: Record<string, number> }, cat: AzkarCategory) {
  const today = dateKey();
  const map = azkar.date === today ? azkar.progress : {};
  const list = AZKAR[cat];
  const done = list.filter((z) => (map[`${cat}:${z.id}`] ?? 0) >= z.count).length;
  return { done, total: list.length, map };
}

const META: Record<AzkarCategory, { icon: keyof typeof Ionicons.glyphMap; grad: [string, string]; label: 'morning_azkar' | 'evening_azkar' | 'sleep_azkar' }> = {
  morning: { icon: 'sunny', grad: ['#F59E0B', '#EA580C'], label: 'morning_azkar' },
  evening: { icon: 'partly-sunny', grad: ['#8B5CF6', '#4338CA'], label: 'evening_azkar' },
  sleep: { icon: 'moon', grad: ['#1E3A8A', '#0F172A'], label: 'sleep_azkar' },
};

export default function AzkarScreen() {
  const { s, t, theme } = useApp();
  const nav = useNavigation<any>();
  const cats: AzkarCategory[] = ['morning', 'evening', 'sleep'];
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title={t('azkar_title')} subtitle={t('azkar_sub')} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30, gap: 14 }} showsVerticalScrollIndicator={false}>
        {cats.map((c, i) => {
          const p = progressFor(s.azkar, c);
          const pct = p.total ? p.done / p.total : 0;
          const m = META[c];
          return (
            <FadeIn key={c} delay={i * 90}>
              <PressScale onPress={() => nav.navigate('AzkarSession', { category: c })}>
                <LinearGradient colors={m.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 26, padding: 20, overflow: 'hidden' }}>
                  <View style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: '#ffffff18' }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: '#ffffff2a', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={m.icon} size={30} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Txt v="h2" color="#fff" style={{ fontSize: 20 }}>{t(m.label)}</Txt>
                      <Txt v="small" color="#ffffffcc">{p.done}/{p.total} {t('completed')}</Txt>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>{Math.round(pct * 100)}%</Text>
                  </View>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: '#00000033', marginTop: 16, overflow: 'hidden' }}>
                    <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: '#fff', borderRadius: 4 }} />
                  </View>
                </LinearGradient>
              </PressScale>
            </FadeIn>
          );
        })}
        <FadeIn delay={300}>
          <Card onPress={() => nav.navigate('Surah', { surah: 18 })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: theme.accent + '33', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="book" size={24} color={theme.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="h2">{t('kahf_reminder')}</Txt>
              <Txt v="small" sub>{t('kahf_desc')}</Txt>
            </View>
          </Card>
        </FadeIn>
        <FadeIn delay={380}>
          <Card onPress={() => nav.navigate('Tasbeeh')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="radio-button-on" size={24} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="h2">{t('tasbeeh')}</Txt>
              <Txt v="small" sub>{t('tap_to_count')}</Txt>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.sub} />
          </Card>
        </FadeIn>
      </ScrollView>
    </View>
  );
}
