import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../lib/settings';
import { usePrayer } from '../lib/usePrayer';
import { addDays, computeDay, formatCountdown, formatTime, hijriString, METHODS, PRAYER_KEYS, type PrayerKey } from '../lib/prayer';
import { Card, FadeIn, IconBadge, PressScale, ScreenHeader, Toggle, Txt } from '../components/ui';
import { notificationsSupported, ensurePermission } from '../lib/notifications';

const ICONS: Record<PrayerKey, keyof typeof Ionicons.glyphMap> = {
  fajr: 'cloudy-night', sunrise: 'sunny', dhuhr: 'sunny-outline', asr: 'partly-sunny', maghrib: 'moon-outline', isha: 'moon',
};

export default function PrayerScreen() {
  const { s, t, theme, updateNotif, isRTL } = useApp();
  const nav = useNavigation<any>();
  const { now, dayDate, next, currentKey } = usePrayer();
  const [offset, setOffset] = useState(0);
  const [warn, setWarn] = useState(false);
  const viewDate = useMemo(() => addDays(dayDate, offset), [dayDate, offset]);
  const day = useMemo(() => computeDay(s.location, s.method, s.madhab, viewDate), [s.location, s.method, s.madhab, viewDate]);
  const method = METHODS.find((m) => m.id === s.method);
  const loc = s.location;

  useEffect(() => { setWarn(false); }, [s.notif.adhan]);

  const dateLabel = new Intl.DateTimeFormat(s.lang === 'ar' ? 'ar-EG' : s.lang === 'ur' ? 'ur-PK' : s.lang, {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(viewDate);

  const toggle = async (k: PrayerKey, v: boolean) => {
    if (k === 'sunrise') return;
    if (v && notificationsSupported) {
      const ok = await ensurePermission(true);
      setWarn(!ok);
    }
    updateNotif({ prayers: { ...s.notif.prayers, [k]: v } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title={t('prayer_times')} subtitle={`${loc.name} · ${hijriString(viewDate, s.lang)}`} />
      <FlatList
        data={PRAYER_KEYS}
        keyExtractor={(k) => k}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable onPress={() => setOffset((o) => o - 1)} accessibilityLabel={t('prev_day')} style={{ padding: 8 }}>
                <Ionicons name={isRTL ? 'chevron-forward-circle' : 'chevron-back-circle'} size={32} color={theme.primary} />
              </Pressable>
              <Pressable onPress={() => setOffset(0)} style={{ alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16 }}>{offset === 0 ? t('today') : dateLabel}</Text>
                {offset === 0 ? <Text style={{ color: theme.sub, fontSize: 12.5 }}>{dateLabel}</Text> : null}
              </Pressable>
              <Pressable onPress={() => setOffset((o) => o + 1)} accessibilityLabel={t('next_day')} style={{ padding: 8 }}>
                <Ionicons name={isRTL ? 'chevron-back-circle' : 'chevron-forward-circle'} size={32} color={theme.primary} />
              </Pressable>
            </View>
            <Card onPress={() => nav.navigate('Location')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconBadge name="location" />
              <View style={{ flex: 1 }}>
                <Txt v="h2">{loc.name}</Txt>
                <Txt v="small" sub numberOfLines={1}>{method ? (s.lang === 'ar' ? method.ar : method.en) : s.method} · {s.madhab === 'hanafi' ? t('hanafi') : t('shafi').split(' (')[0]}</Txt>
              </View>
              <Ionicons name="swap-horizontal" size={22} color={theme.sub} />
            </Card>
            {warn ? <Txt v="small" color={theme.danger}>{t('notif_denied')}</Txt> : null}
            {!notificationsSupported ? <Txt v="caption" sub>{t('notif_web_note')}</Txt> : null}
          </View>
        }
        renderItem={({ item: k, index }) => {
          const isNext = offset === 0 && next.key === k;
          const isCurrent = offset === 0 && currentKey === k && !isNext;
          const notifOn = k !== 'sunrise' ? s.notif.prayers[k as Exclude<PrayerKey, 'sunrise'>] : false;
          return (
            <FadeIn delay={index * 50}>
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20,
                backgroundColor: isNext ? theme.primary : theme.card,
                borderWidth: isCurrent ? 2 : 1, borderColor: isCurrent ? theme.primary : theme.border,
              }}>
                <View style={{ width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: isNext ? '#ffffff2a' : theme.card2 }}>
                  <Ionicons name={ICONS[k]} size={22} color={isNext ? '#fff' : theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: isNext ? theme.onPrimary : theme.text, fontWeight: '800', fontSize: 17, textAlign: s.lang === 'ar' || s.lang === 'ur' ? 'right' : 'left' }}>{t(k)}</Text>
                  {isNext ? (
                    <Text style={{ color: theme.onPrimary + 'dd', fontSize: 12.5, fontWeight: '600', textAlign: s.lang === 'ar' || s.lang === 'ur' ? 'right' : 'left' }}>
                      {t('in_time')} {formatCountdown(next.time.getTime() - now.getTime())}
                    </Text>
                  ) : null}
                </View>
                <Text style={{ color: isNext ? theme.onPrimary : theme.text, fontWeight: '900', fontSize: 20 }}>{formatTime(day[k], loc.tz, s.lang, s.h24)}</Text>
                {k !== 'sunrise' ? (
                  <Pressable onPress={() => toggle(k, !notifOn)} hitSlop={8} accessibilityLabel={t('enable_adhan')}>
                    <Ionicons name={notifOn ? 'notifications' : 'notifications-off-outline'} size={24} color={isNext ? theme.onPrimary : notifOn ? theme.primary : theme.sub} />
                  </Pressable>
                ) : <View style={{ width: 24 }} />}
              </View>
            </FadeIn>
          );
        }}
        ListFooterComponent={
          <View style={{ gap: 10, marginTop: 6 }}>
            <Card style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Txt v="caption" sub center>{t('midnight')}</Txt>
                <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16, marginTop: 4 }}>{formatTime(day.midnight, loc.tz, s.lang, s.h24)}</Text>
              </View>
              <View style={{ width: 1, backgroundColor: theme.border }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Txt v="caption" sub center>{t('night_third')}</Txt>
                <Text style={{ color: theme.text, fontWeight: '800', fontSize: 16, marginTop: 4 }}>{formatTime(day.lastThird, loc.tz, s.lang, s.h24)}</Text>
              </View>
            </Card>
            <Card onPress={() => nav.navigate('Settings')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconBadge name="options" />
              <View style={{ flex: 1 }}>
                <Txt v="h2">{t('notifications')}</Txt>
                <Txt v="small" sub>{t('calc_method')} · {t('before_prayer')}</Txt>
              </View>
              <Toggle value={s.notif.adhan} onChange={(v) => updateNotif({ adhan: v })} />
            </Card>
          </View>
        }
      />
    </View>
  );
}
