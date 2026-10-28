import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../lib/settings';
import { LANGS } from '../lib/i18n';
import { THEMES, THEME_ORDER } from '../lib/theme';
import { METHODS } from '../lib/prayer';
import { RIWAYAT } from '../lib/riwayat';
import { Card, Chip, IconBadge, PressScale, ScreenHeader, SectionTitle, TimeStepper, Toggle, Txt } from '../components/ui';
import { ensurePermission, notificationsSupported } from '../lib/notifications';

export default function SettingsScreen() {
  const { s, t, theme, update, updateNotif, isRTL } = useApp();
  const nav = useNavigation<any>();
  const [denied, setDenied] = useState(false);
  const n = s.notif;

  const guard = async (patch: Partial<typeof n>) => {
    const turningOn = Object.values(patch).some((v) => v === true);
    if (turningOn && notificationsSupported) setDenied(!(await ensurePermission(true)));
    updateNotif(patch);
  };

  const row = (label: string, right: React.ReactNode, sub?: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 }}>
      <View style={{ flex: 1 }}>
        <Txt v="body" style={{ fontWeight: '700' }}>{label}</Txt>
        {sub ? <Txt v="caption" sub>{sub}</Txt> : null}
      </View>
      {right}
    </View>
  );

  const reminder = (label: string, on: boolean, time: { h: number; m: number }, kOn: 'morning' | 'evening' | 'sleep' | 'kahf', kTime: 'morningTime' | 'eveningTime' | 'sleepTime' | 'kahfTime') => (
    <View key={kOn} style={{ paddingVertical: 8, gap: 8 }}>
      {row(label, <Toggle value={on} onChange={(v) => guard({ [kOn]: v })} />)}
      {on ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.card2, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 12 }}>
          <Txt v="small" sub>{t('reminder_time')}</Txt>
          <TimeStepper value={time} h24={s.h24} onChange={(v) => updateNotif({ [kTime]: v })} />
        </View>
      ) : null}
    </View>
  );

  const wrap = { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } as const;
  const themeName = { green: 'theme_green', blue: 'theme_blue', gold: 'theme_gold', dark: 'theme_dark', light: 'theme_light' } as const;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader back title={t('settings')} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
        <SectionTitle>{t('language')}</SectionTitle>
        <View style={wrap}>
          {LANGS.map((l) => <Chip key={l.id} label={l.native} active={s.lang === l.id} onPress={() => update({ lang: l.id })} />)}
        </View>

        <SectionTitle>{t('theme')}</SectionTitle>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {THEME_ORDER.map((id) => {
            const th = THEMES[id];
            const active = s.theme === id;
            return (
              <PressScale key={id} onPress={() => update({ theme: id })} style={{
                width: 104, alignItems: 'center', gap: 8, padding: 10, borderRadius: 18, backgroundColor: theme.card,
                borderWidth: 2, borderColor: active ? theme.primary : theme.border,
              }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: th.bg, borderWidth: 3, borderColor: th.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: th.accent }} />
                  {active ? <View style={{ position: 'absolute', right: -4, top: -4, backgroundColor: theme.primary, borderRadius: 10 }}><Ionicons name="checkmark-circle" size={20} color={theme.onPrimary} /></View> : null}
                </View>
                <Text numberOfLines={2} style={{ color: theme.text, fontWeight: '700', fontSize: 11.5, textAlign: 'center' }}>{t(themeName[id])}</Text>
              </PressScale>
            );
          })}
        </View>

        <SectionTitle>{t('prayer_times')}</SectionTitle>
        <Card style={{ gap: 6 }}>
          <PressScale onPress={() => nav.navigate('Location')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <IconBadge name="location" size={40} />
            <View style={{ flex: 1 }}>
              <Txt v="caption" sub>{t('location')}</Txt>
              <Txt v="h2" style={{ fontSize: 16 }}>{s.location.name}</Txt>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={theme.sub} />
          </PressScale>
          <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 8 }} />
          <Txt v="caption" sub style={{ marginBottom: 6 }}>{t('calc_method')}</Txt>
          <View style={wrap}>
            {METHODS.map((m) => <Chip key={m.id} label={s.lang === 'ar' ? m.ar : m.en} active={s.method === m.id} onPress={() => update({ method: m.id })} />)}
          </View>
          <Txt v="caption" sub style={{ marginTop: 10, marginBottom: 6 }}>{t('madhab')}</Txt>
          <View style={wrap}>
            <Chip label={t('shafi')} active={s.madhab === 'shafi'} onPress={() => update({ madhab: 'shafi' })} />
            <Chip label={t('hanafi')} active={s.madhab === 'hanafi'} onPress={() => update({ madhab: 'hanafi' })} />
          </View>
          {row(t('time_24h'), <Toggle value={s.h24} onChange={(v) => update({ h24: v })} />)}
        </Card>

        <SectionTitle>{t('notifications')}</SectionTitle>
        <Card style={{ gap: 4 }}>
          {!notificationsSupported ? (
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
              <Ionicons name="information-circle" size={18} color={theme.accent} />
              <Txt v="small" sub style={{ flex: 1 }}>{t('notif_web_note')}</Txt>
            </View>
          ) : null}
          {denied ? <Txt v="small" color={theme.danger}>{t('notif_denied')}</Txt> : null}
          {row(t('enable_adhan'), <Toggle value={n.adhan} onChange={(v) => guard({ adhan: v })} />)}
          {n.adhan ? (
            <>
              <Txt v="caption" sub style={{ marginTop: 6, marginBottom: 6 }}>{t('before_prayer')}</Txt>
              <View style={wrap}>
                {[0, 5, 10, 15, 20, 30].map((m) => <Chip key={m} label={m === 0 ? t('off') : `${m} ${t('minutes')}`} active={n.before === m} onPress={() => updateNotif({ before: m })} />)}
              </View>
              <Txt v="caption" sub style={{ marginTop: 10, marginBottom: 6 }}>{t('after_prayer')}</Txt>
              <View style={wrap}>
                {[0, 10, 15, 20, 30].map((m) => <Chip key={m} label={m === 0 ? t('off') : `${m} ${t('minutes')}`} active={n.after === m} onPress={() => updateNotif({ after: m })} />)}
              </View>
              <Txt v="caption" sub style={{ marginTop: 10, marginBottom: 6 }}>{t('sound')}</Txt>
              <View style={wrap}>
                <Chip icon="volume-high" label={t('sound_default')} active={n.sound === 'default'} onPress={() => updateNotif({ sound: 'default' })} />
                <Chip icon="volume-mute" label={t('sound_silent')} active={n.sound === 'silent'} onPress={() => updateNotif({ sound: 'silent' })} />
              </View>
            </>
          ) : null}
        </Card>

        <SectionTitle>{t('daily_reminders')}</SectionTitle>
        <Card style={{ gap: 2 }}>
          {reminder(t('morning_azkar'), n.morning, n.morningTime, 'morning', 'morningTime')}
          <View style={{ height: 1, backgroundColor: theme.border }} />
          {reminder(t('evening_azkar'), n.evening, n.eveningTime, 'evening', 'eveningTime')}
          <View style={{ height: 1, backgroundColor: theme.border }} />
          {reminder(t('sleep_azkar'), n.sleep, n.sleepTime, 'sleep', 'sleepTime')}
          <View style={{ height: 1, backgroundColor: theme.border }} />
          {reminder(t('kahf_reminder'), n.kahf, n.kahfTime, 'kahf', 'kahfTime')}
        </Card>

        <SectionTitle>{t('quran_settings')}</SectionTitle>
        <Card style={{ gap: 6 }}>
          <Txt v="caption" sub>{t('riwaya')}</Txt>
          <View style={wrap}>
            {RIWAYAT.map((r) => <Chip key={r.id} label={t(r.label)} active={s.riwaya === r.id} onPress={() => update({ riwaya: r.id })} />)}
          </View>
          <Txt v="caption" sub style={{ marginTop: 10 }}>{t('font_size')}</Txt>
          <View style={wrap}>
            {[22, 26, 30, 34, 40].map((f) => <Chip key={f} label={String(f)} active={s.quranFont === f} onPress={() => update({ quranFont: f })} />)}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
