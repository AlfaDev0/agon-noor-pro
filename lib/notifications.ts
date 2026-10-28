import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Settings } from './settings';
import { translate, type Key } from './i18n';
import { addDays, computeDay, dayInTz, METHODS, NOTIFY_KEYS, type PrayerKey } from './prayer';

export const notificationsSupported = Platform.OS !== 'web';

if (notificationsSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });
}

export async function ensurePermission(ask: boolean): Promise<boolean> {
  if (!notificationsSupported) return false;
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  if (!ask) return false;
  const res = await Notifications.requestPermissionsAsync();
  return res.granted;
}

async function ensureChannels(silent: boolean) {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(silent ? 'adhan-silent' : 'adhan', {
    name: silent ? 'Prayer (silent)' : 'Prayer & Adhan',
    importance: silent ? Notifications.AndroidImportance.DEFAULT : Notifications.AndroidImportance.MAX,
    sound: silent ? null : 'default',
    vibrationPattern: [0, 250, 150, 250, 150, 400],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    enableVibrate: true,
  });
  await Notifications.setNotificationChannelAsync('azkar', {
    name: 'Azkar reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

const PRAYER_LABEL: Record<PrayerKey, Key> = {
  fajr: 'fajr', sunrise: 'sunrise', dhuhr: 'dhuhr', asr: 'asr', maghrib: 'maghrib', isha: 'isha',
};

/** Cancels everything and schedules the next days of prayer alerts plus daily azkar reminders. */
export async function rescheduleAll(s: Settings): Promise<number> {
  if (!notificationsSupported) return 0;
  const granted = await ensurePermission(false);
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!granted) return 0;
  const lang = s.lang;
  const tr = (k: Key, v?: Record<string, string | number>) => translate(lang, k, v);
  const silent = s.notif.sound === 'silent';
  await ensureChannels(silent);
  const prayerChannel = silent ? 'adhan-silent' : 'adhan';
  let scheduled = 0;

  const dailyAt = async (title: string, body: string, h: number, m: number) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: h, minute: m, channelId: 'azkar' },
    });
    scheduled++;
  };

  if (s.notif.morning) await dailyAt(tr('morning_azkar'), tr('notif_morning_body'), s.notif.morningTime.h, s.notif.morningTime.m);
  if (s.notif.evening) await dailyAt(tr('evening_azkar'), tr('notif_evening_body'), s.notif.eveningTime.h, s.notif.eveningTime.m);
  if (s.notif.sleep) await dailyAt(tr('sleep_azkar'), tr('notif_sleep_body'), s.notif.sleepTime.h, s.notif.sleepTime.m);
  if (s.notif.kahf) {
    await Notifications.scheduleNotificationAsync({
      content: { title: tr('kahf_reminder'), body: tr('notif_kahf_body'), sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 6, // Friday (1 = Sunday)
        hour: s.notif.kahfTime.h, minute: s.notif.kahfTime.m, channelId: 'azkar',
      },
    });
    scheduled++;
  }

  if (s.notif.adhan) {
    const active = NOTIFY_KEYS.filter((k) => s.notif.prayers[k as Exclude<PrayerKey, 'sunrise'>]);
    const perPrayer = 1 + (s.notif.before > 0 ? 1 : 0) + (s.notif.after > 0 ? 1 : 0);
    const perDay = Math.max(1, active.length * perPrayer);
    const budget = 60 - scheduled; // iOS keeps at most 64 pending notifications
    const days = Math.max(1, Math.min(14, Math.floor(budget / perDay)));
    const now = new Date();
    const cityName = s.location.name;
    const base = dayInTz(now, s.location.tz);
    for (let d = 0; d < days; d++) {
      const day = computeDay(s.location, s.method, s.madhab, addDays(base, d));
      for (const k of active) {
        const when = day[k];
        const pName = tr(PRAYER_LABEL[k]);
        const mk = async (date: Date, title: string, body: string) => {
          if (date.getTime() <= Date.now() + 2000) return;
          await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: !silent },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: prayerChannel },
          });
          scheduled++;
        };
        await Notifications.scheduleNotificationAsync({
          content: { title: tr('notif_title_prayer', { p: pName }), body: tr('notif_body_prayer', { c: cityName }), sound: !silent, data: { type: 'adhan', prayer: k } },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: prayerChannel },
        });
        scheduled++;
        if (s.notif.before > 0) {
          const bd = new Date(when.getTime() - s.notif.before * 60000);
          if (bd.getTime() > Date.now() + 2000) {
            await Notifications.scheduleNotificationAsync({
              content: { title: tr('notif_title_before', { p: pName, n: s.notif.before }), body: tr('notif_body_before'), sound: !silent, data: { type: 'reminder', prayer: k } },
              trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: bd, channelId: prayerChannel },
            });
            scheduled++;
          }
        }
        if (s.notif.after > 0) {
          const ad = new Date(when.getTime() + s.notif.after * 60000);
          if (ad.getTime() > Date.now() + 2000) {
            await Notifications.scheduleNotificationAsync({
              content: { title: tr('notif_title_after', { p: pName }), body: tr('notif_body_after'), sound: !silent, data: { type: 'reminder', prayer: k } },
              trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: ad, channelId: prayerChannel },
            });
            scheduled++;
          }
        }
      }
    }
  }
  return scheduled;
}

export function methodLabel(id: string, lang: string): string {
  const m = METHODS.find((x) => x.id === id);
  if (!m) return id;
  return lang === 'ar' ? m.ar : m.en;
}
