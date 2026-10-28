import {
  Coordinates, CalculationMethod, PrayerTimes, Madhab, HighLatitudeRule, Qibla, SunnahTimes,
} from 'adhan';
import type { Lang } from './i18n';
import { LANGS } from './i18n';

export type MethodId =
  | 'UmmAlQura' | 'MuslimWorldLeague' | 'Egyptian' | 'Karachi' | 'NorthAmerica' | 'Dubai'
  | 'Qatar' | 'Kuwait' | 'Singapore' | 'Turkey' | 'Tehran' | 'MoonsightingCommittee';

export const METHODS: { id: MethodId; en: string; ar: string }[] = [
  { id: 'UmmAlQura', en: 'Umm Al-Qura (Makkah)', ar: 'أم القرى (مكة المكرمة)' },
  { id: 'MuslimWorldLeague', en: 'Muslim World League', ar: 'رابطة العالم الإسلامي' },
  { id: 'Egyptian', en: 'Egyptian General Authority of Survey', ar: 'الهيئة المصرية العامة للمساحة' },
  { id: 'Karachi', en: 'Univ. of Islamic Sciences, Karachi', ar: 'جامعة العلوم الإسلامية بكراتشي' },
  { id: 'NorthAmerica', en: 'ISNA (North America)', ar: 'الجمعية الإسلامية لأمريكا الشمالية' },
  { id: 'Dubai', en: 'Dubai', ar: 'دبي' },
  { id: 'Qatar', en: 'Qatar', ar: 'قطر' },
  { id: 'Kuwait', en: 'Kuwait', ar: 'الكويت' },
  { id: 'Singapore', en: 'Singapore / MUIS', ar: 'سنغافورة' },
  { id: 'Turkey', en: 'Diyanet (Turkey)', ar: 'رئاسة الشؤون الدينية التركية' },
  { id: 'Tehran', en: 'Tehran (Geophysics)', ar: 'معهد الجيوفيزياء بطهران' },
  { id: 'MoonsightingCommittee', en: 'Moonsighting Committee', ar: 'لجنة رؤية الهلال' },
];

export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
  tz: string;
  auto?: boolean;
}

export interface City { en: string; ar: string; lat: number; lng: number; tz: string }

export const CITIES: City[] = [
  { en: 'Makkah', ar: 'مكة المكرمة', lat: 21.4225, lng: 39.8262, tz: 'Asia/Riyadh' },
  { en: 'Madinah', ar: 'المدينة المنورة', lat: 24.4672, lng: 39.6111, tz: 'Asia/Riyadh' },
  { en: 'Jerusalem', ar: 'القدس', lat: 31.7683, lng: 35.2137, tz: 'Asia/Jerusalem' },
  { en: 'Gaza', ar: 'غزة', lat: 31.5017, lng: 34.4668, tz: 'Asia/Gaza' },
  { en: 'Ramallah', ar: 'رام الله', lat: 31.9038, lng: 35.2034, tz: 'Asia/Hebron' },
  { en: 'Cairo', ar: 'القاهرة', lat: 30.0444, lng: 31.2357, tz: 'Africa/Cairo' },
  { en: 'Alexandria', ar: 'الإسكندرية', lat: 31.2001, lng: 29.9187, tz: 'Africa/Cairo' },
  { en: 'Riyadh', ar: 'الرياض', lat: 24.7136, lng: 46.6753, tz: 'Asia/Riyadh' },
  { en: 'Jeddah', ar: 'جدة', lat: 21.4858, lng: 39.1925, tz: 'Asia/Riyadh' },
  { en: 'Dubai', ar: 'دبي', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
  { en: 'Abu Dhabi', ar: 'أبوظبي', lat: 24.4539, lng: 54.3773, tz: 'Asia/Dubai' },
  { en: 'Doha', ar: 'الدوحة', lat: 25.2854, lng: 51.531, tz: 'Asia/Qatar' },
  { en: 'Kuwait City', ar: 'مدينة الكويت', lat: 29.3759, lng: 47.9774, tz: 'Asia/Kuwait' },
  { en: 'Manama', ar: 'المنامة', lat: 26.2285, lng: 50.586, tz: 'Asia/Bahrain' },
  { en: 'Muscat', ar: 'مسقط', lat: 23.588, lng: 58.3829, tz: 'Asia/Muscat' },
  { en: 'Baghdad', ar: 'بغداد', lat: 33.3152, lng: 44.3661, tz: 'Asia/Baghdad' },
  { en: 'Damascus', ar: 'دمشق', lat: 33.5138, lng: 36.2765, tz: 'Asia/Damascus' },
  { en: 'Amman', ar: 'عمّان', lat: 31.9454, lng: 35.9284, tz: 'Asia/Amman' },
  { en: 'Beirut', ar: 'بيروت', lat: 33.8938, lng: 35.5018, tz: 'Asia/Beirut' },
  { en: 'Sanaa', ar: 'صنعاء', lat: 15.3694, lng: 44.191, tz: 'Asia/Aden' },
  { en: 'Khartoum', ar: 'الخرطوم', lat: 15.5007, lng: 32.5599, tz: 'Africa/Khartoum' },
  { en: 'Tripoli', ar: 'طرابلس', lat: 32.8872, lng: 13.1913, tz: 'Africa/Tripoli' },
  { en: 'Tunis', ar: 'تونس', lat: 36.8065, lng: 10.1815, tz: 'Africa/Tunis' },
  { en: 'Algiers', ar: 'الجزائر', lat: 36.7538, lng: 3.0588, tz: 'Africa/Algiers' },
  { en: 'Rabat', ar: 'الرباط', lat: 34.0209, lng: -6.8416, tz: 'Africa/Casablanca' },
  { en: 'Casablanca', ar: 'الدار البيضاء', lat: 33.5731, lng: -7.5898, tz: 'Africa/Casablanca' },
  { en: 'Istanbul', ar: 'إسطنبول', lat: 41.0082, lng: 28.9784, tz: 'Europe/Istanbul' },
  { en: 'Ankara', ar: 'أنقرة', lat: 39.9334, lng: 32.8597, tz: 'Europe/Istanbul' },
  { en: 'Tehran', ar: 'طهران', lat: 35.6892, lng: 51.389, tz: 'Asia/Tehran' },
  { en: 'Karachi', ar: 'كراتشي', lat: 24.8607, lng: 67.0011, tz: 'Asia/Karachi' },
  { en: 'Lahore', ar: 'لاهور', lat: 31.5204, lng: 74.3587, tz: 'Asia/Karachi' },
  { en: 'Islamabad', ar: 'إسلام آباد', lat: 33.6844, lng: 73.0479, tz: 'Asia/Karachi' },
  { en: 'Dhaka', ar: 'دكا', lat: 23.8103, lng: 90.4125, tz: 'Asia/Dhaka' },
  { en: 'Delhi', ar: 'دلهي', lat: 28.6139, lng: 77.209, tz: 'Asia/Kolkata' },
  { en: 'Jakarta', ar: 'جاكرتا', lat: -6.2088, lng: 106.8456, tz: 'Asia/Jakarta' },
  { en: 'Kuala Lumpur', ar: 'كوالالمبور', lat: 3.139, lng: 101.6869, tz: 'Asia/Kuala_Lumpur' },
  { en: 'Singapore', ar: 'سنغافورة', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore' },
  { en: 'London', ar: 'لندن', lat: 51.5072, lng: -0.1276, tz: 'Europe/London' },
  { en: 'Paris', ar: 'باريس', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris' },
  { en: 'Berlin', ar: 'برلين', lat: 52.52, lng: 13.405, tz: 'Europe/Berlin' },
  { en: 'Moscow', ar: 'موسكو', lat: 55.7558, lng: 37.6173, tz: 'Europe/Moscow' },
  { en: 'New York', ar: 'نيويورك', lat: 40.7128, lng: -74.006, tz: 'America/New_York' },
  { en: 'Toronto', ar: 'تورونتو', lat: 43.6532, lng: -79.3832, tz: 'America/Toronto' },
  { en: 'Los Angeles', ar: 'لوس أنجلوس', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles' },
  { en: 'Sydney', ar: 'سيدني', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney' },
  { en: 'Johannesburg', ar: 'جوهانسبرغ', lat: -26.2041, lng: 28.0473, tz: 'Africa/Johannesburg' },
  { en: 'Lagos', ar: 'لاغوس', lat: 6.5244, lng: 3.3792, tz: 'Africa/Lagos' },
  { en: 'Nairobi', ar: 'نيروبي', lat: -1.2921, lng: 36.8219, tz: 'Africa/Nairobi' },
];

export const DEFAULT_LOCATION: GeoLocation = { name: 'Cairo', lat: 30.0444, lng: 31.2357, tz: 'Africa/Cairo' };

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export const PRAYER_KEYS: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
export const NOTIFY_KEYS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type DayTimes = Record<PrayerKey, Date> & { midnight: Date; lastThird: Date };

function params(method: MethodId, madhab: 'shafi' | 'hanafi', c: Coordinates) {
  const p = CalculationMethod[method]();
  p.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  if (Math.abs(c.latitude) > 48) p.highLatitudeRule = HighLatitudeRule.recommended(c);
  return p;
}

/** Date represents the calendar day in the location's timezone (we use its Y/M/D parts). */
export function computeDay(loc: GeoLocation, method: MethodId, madhab: 'shafi' | 'hanafi', date: Date): DayTimes {
  const c = new Coordinates(loc.lat, loc.lng);
  const p = params(method, madhab, c);
  const pt = new PrayerTimes(c, date, p);
  const sn = new SunnahTimes(pt);
  return {
    fajr: pt.fajr, sunrise: pt.sunrise, dhuhr: pt.dhuhr, asr: pt.asr, maghrib: pt.maghrib, isha: pt.isha,
    midnight: sn.middleOfTheNight, lastThird: sn.lastThirdOfTheNight,
  };
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + n);
  return x;
}

export function nextPrayer(loc: GeoLocation, method: MethodId, madhab: 'shafi' | 'hanafi', now: Date) {
  const today = computeDay(loc, method, madhab, now);
  for (const k of PRAYER_KEYS) {
    if (today[k].getTime() > now.getTime()) return { key: k, time: today[k] };
  }
  const tomorrow = computeDay(loc, method, madhab, addDays(now, 1));
  return { key: 'fajr' as PrayerKey, time: tomorrow.fajr };
}

export function currentPrayerKey(day: DayTimes, now: Date): PrayerKey | null {
  let cur: PrayerKey | null = null;
  for (const k of PRAYER_KEYS) if (day[k].getTime() <= now.getTime()) cur = k;
  return cur;
}

export function localeOf(lang: Lang): string {
  return LANGS.find((l) => l.id === lang)?.locale ?? 'en-US';
}

export function formatTime(d: Date, tz: string, lang: Lang, h24: boolean): string {
  try {
    return new Intl.DateTimeFormat(localeOf(lang), {
      hour: '2-digit', minute: '2-digit', hour12: !h24, timeZone: tz,
    }).format(d);
  } catch {
    return d.toLocaleTimeString();
  }
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function qiblaBearing(lat: number, lng: number): number {
  return Qibla(new Coordinates(lat, lng));
}

export function distanceToKaabaKm(lat: number, lng: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const kLat = 21.4225, kLng = 39.8262;
  const dLat = toRad(kLat - lat);
  const dLng = toRad(kLng - lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(kLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Date whose local Y/M/D equals the Y/M/D that `now` has in timezone `tz` (noon, to avoid DST edges for adhan). */
export function dayInTz(now: Date, tz: string): Date {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(now);
    const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    return new Date(g('year'), g('month') - 1, g('day'), 12, 0, 0);
  } catch {
    return now;
  }
}

export function hijriString(date: Date, lang: Lang): string {
  try {
    const loc = localeOf(lang).split('-')[0] + '-u-ca-islamic-umalqura-nu-' + (lang === 'ar' || lang === 'ur' ? 'arab' : 'latn');
    const s = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    if (s && !/^\d{1,2}\/\d/.test(s)) return s;
  } catch { /* fall through */ }
  // Tabular civil Islamic calendar fallback
  const jd = Math.floor(date.getTime() / 86400000 + 2440587.5);
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  const names = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'];
  return `${day} ${names[month - 1]} ${year}`;
}
