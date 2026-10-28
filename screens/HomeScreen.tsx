import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../lib/settings';
import { usePrayer } from '../lib/usePrayer';
import { formatCountdown, formatTime, hijriString, PRAYER_KEYS } from '../lib/prayer';
import { ArabicText, Card, FadeIn, IconBadge, PressScale, SectionTitle, Txt, ARABIC_BOLD } from '../components/ui';
import { PalestineFlag } from '../components/PalestineFlag';
import { RIWAYAT } from '../lib/riwayat';
import { SURAHS } from '../lib/data/surahs';

const OWNER = require('../assets/images/1792866791121_srjv0gq7m.jpg');

export default function HomeScreen() {
  const { s, t, theme, lang: _l } = useHome();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { now, dayDate, day, next, currentKey } = usePrayer();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 600); }, []);

  const loc = s.location;
  const remaining = next.time.getTime() - now.getTime();
  const hour = now.getHours();
  const azkarCat = hour < 12 ? 'morning' : hour < 21 ? 'evening' : 'sleep';
  const azkarLabel = azkarCat === 'morning' ? t('morning_azkar') : azkarCat === 'evening' ? t('evening_azkar') : t('sleep_azkar');
  const isFriday = now.getDay() === 5;
  const lastSurah = s.lastRead ? SURAHS[s.lastRead.surah - 1] : null;

  const actions: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[] = [
    { icon: azkarCat === 'sleep' ? 'moon' : azkarCat === 'morning' ? 'sunny' : 'partly-sunny', label: azkarLabel, onPress: () => nav.navigate('AzkarSession', { category: azkarCat }) },
    { icon: 'book', label: t('tab_quran'), onPress: () => nav.navigate('Tabs', { screen: 'Quran' }) },
    { icon: 'radio-button-on', label: t('tasbeeh'), onPress: () => nav.navigate('Tasbeeh') },
    { icon: 'compass', label: t('qibla'), onPress: () => nav.navigate('Qibla') },
    { icon: 'calculator', label: t('calculator'), onPress: () => nav.navigate('Calculator') },
    { icon: 'cash', label: t('zakat'), onPress: () => nav.navigate('Zakat') },
    { icon: 'chatbubbles', label: t('contact'), onPress: () => nav.navigate('Contact') },
    { icon: 'shield-checkmark', label: t('security'), onPress: () => nav.navigate('Security') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: owner + flag */}
        <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <PressScale onPress={() => nav.navigate('About')}>
            <View style={{ width: 52, height: 52, borderRadius: 26, overflow: 'hidden', borderWidth: 2, borderColor: theme.accent }}>
              <Image source={OWNER} style={{ width: '100%', height: '100%' }} contentFit="cover" contentPosition={{ top: 0, left: '50%' }} />
            </View>
          </PressScale>
          <View style={{ flex: 1 }}>
            <Txt v="caption" sub>{t('developed_by')}</Txt>
            <Txt v="h2" style={{ fontSize: 21, fontWeight: '900' }}>Ahmed Ayman</Txt>
          </View>
          <PalestineFlag width={64} radius={5} />
        </View>

        {/* Hero */}
        <FadeIn style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <LinearGradient colors={theme.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={[styles.circle, { width: 220, height: 220, right: -70, top: -80 }]} />
            <View style={[styles.circle, { width: 140, height: 140, left: -40, bottom: -50 }]} />
            <Text style={{ color: '#ffffffcc', fontSize: 13, fontWeight: '600', textAlign: 'center' }}>{t('salam')}</Text>
            <ArabicText color="#fff" size={22} style={{ marginTop: 2 }}>{hijriString(dayDate, s.lang)}</ArabicText>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: '#ffffffcc', fontSize: 13, fontWeight: '700' }}>{t('next_prayer')}</Text>
              <Text style={{ color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 2 }}>{t(next.key)}</Text>
              <Text style={{ color: theme.dark ? '#E0B84F' : '#FFE08A', fontSize: 22, fontWeight: '800' }}>{formatTime(next.time, loc.tz, s.lang, s.h24)}</Text>
              <View style={styles.countdown}>
                <Ionicons name="time-outline" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16, fontVariant: ['tabular-nums'] }}>
                  {t('in_time')} {formatCountdown(remaining)}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
              <Ionicons name="location" size={14} color="#ffffffcc" />
              <Text style={{ color: '#ffffffcc', fontSize: 12.5, fontWeight: '600' }}>{loc.name}</Text>
            </View>
          </LinearGradient>
        </FadeIn>

        {/* Today's strip */}
        <View style={{ paddingHorizontal: 16 }}>
          <Card style={{ marginTop: 14, paddingVertical: 12, paddingHorizontal: 8 }} onPress={() => nav.navigate('Tabs', { screen: 'Prayer' })}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {PRAYER_KEYS.map((k) => {
                const active = currentKey === k;
                return (
                  <View key={k} style={{ flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 12, backgroundColor: active ? theme.card2 : 'transparent' }}>
                    <Text style={{ color: active ? theme.primary : theme.sub, fontWeight: '700', fontSize: 11 }} numberOfLines={1}>{t(k)}</Text>
                    <Text style={{ color: theme.text, fontWeight: '800', fontSize: 12, marginTop: 4 }}>{formatTime(day[k], loc.tz, s.lang, s.h24)}</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Palestine banner */}
        <FadeIn delay={120} style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <View style={[styles.palBanner, { backgroundColor: theme.dark ? '#101a15' : '#fff', borderColor: theme.border }]}>
            <PalestineFlag width={118} radius={8} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontFamily: ARABIC_BOLD, fontSize: 38, lineHeight: 56, color: theme.dark ? '#fff' : '#0b0b0b' }}>فلسطين حرة</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 14, height: 3, backgroundColor: '#EE2A35', borderRadius: 2 }} />
                <Text style={{ color: '#009736', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 }}>Free Palestine</Text>
                <View style={{ width: 14, height: 3, backgroundColor: '#009736', borderRadius: 2 }} />
              </View>
            </View>
          </View>
        </FadeIn>

        {isFriday ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card onPress={() => nav.navigate('Surah', { surah: 18 })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconBadge name="book" bg={theme.accent + '33'} color={theme.accent} />
              <View style={{ flex: 1 }}>
                <Txt v="h2">{t('kahf_reminder')}</Txt>
                <Txt v="small" sub>{t('kahf_desc')}</Txt>
              </View>
              <Ionicons name="arrow-forward-circle" size={28} color={theme.primary} />
            </Card>
          </View>
        ) : null}

        {lastSurah ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card onPress={() => nav.navigate('Surah', { surah: lastSurah.n, ayah: s.lastRead?.ayah })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconBadge name="bookmark" />
              <View style={{ flex: 1 }}>
                <Txt v="caption" sub>{t('continue_reading')} · {t(RIWAYAT.find((r) => r.id === s.riwaya)!.label)}</Txt>
                <ArabicText size={24} center={false} style={{ lineHeight: 40 }}>{lastSurah.ar}</ArabicText>
                <Txt v="small" sub>{t('ayah')} {s.lastRead?.ayah}</Txt>
              </View>
              <Ionicons name="play-circle" size={32} color={theme.primary} />
            </Card>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 16 }}>
          <SectionTitle>{t('quick_actions')}</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {actions.map((a) => (
              <PressScale key={a.label} onPress={a.onPress} style={[styles.action, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <IconBadge name={a.icon} size={42} />
                <Text numberOfLines={2} style={{ color: theme.text, fontSize: 11.5, fontWeight: '700', textAlign: 'center', marginTop: 8 }}>{a.label}</Text>
              </PressScale>
            ))}
          </View>

          <PressScale onPress={() => nav.navigate('About')} style={{ marginTop: 22, alignItems: 'center', paddingVertical: 14 }}>
            <Text style={{ color: theme.sub, fontSize: 12, fontWeight: '600' }}>{t('developed_by')}</Text>
            <Text style={{ color: theme.primary, fontSize: 18, fontWeight: '900', marginTop: 2 }}>Ahmed Ayman</Text>
          </PressScale>
        </View>
      </ScrollView>
    </View>
  );
}

function useHome() {
  const a = useApp();
  return { ...a, lang: a.s.lang };
}

const styles = StyleSheet.create({
  hero: { borderRadius: 28, padding: 20, overflow: 'hidden' },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: '#ffffff14' },
  countdown: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 999, backgroundColor: '#00000033',
  },
  palBanner: {
    borderRadius: 24, borderWidth: 1, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  action: {
    width: '23%', flexGrow: 1, minWidth: 74, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6,
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth,
  },
});
