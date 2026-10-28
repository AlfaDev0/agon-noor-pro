import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getSecure, setSecure, type PinRecord } from './storage';
import { LANGS, translate, type Key, type Lang } from './i18n';
import { THEMES, type Theme, type ThemeId } from './theme';
import { DEFAULT_LOCATION, type GeoLocation, type MethodId, type PrayerKey } from './prayer';
import type { RiwayaId } from './riwayat';

export interface TimeOfDay { h: number; m: number }

export interface Settings {
  lang: Lang;
  theme: ThemeId;
  method: MethodId;
  madhab: 'shafi' | 'hanafi';
  h24: boolean;
  location: GeoLocation;
  notif: {
    adhan: boolean;
    prayers: Record<Exclude<PrayerKey, 'sunrise'>, boolean>;
    before: number;
    after: number;
    sound: 'default' | 'silent';
    morning: boolean; morningTime: TimeOfDay;
    evening: boolean; eveningTime: TimeOfDay;
    sleep: boolean; sleepTime: TimeOfDay;
    kahf: boolean; kahfTime: TimeOfDay;
  };
  riwaya: RiwayaId;
  quranFont: number;
  lastRead: { surah: number; ayah: number } | null;
  azkar: { date: string; progress: Record<string, number> };
  tasbeeh: { preset: string; count: number; target: number; cycles: number; total: number };
  pin: PinRecord | null;
}

export const DEFAULT_SETTINGS: Settings = {
  lang: 'ar',
  theme: 'green',
  method: 'Egyptian',
  madhab: 'shafi',
  h24: false,
  location: DEFAULT_LOCATION,
  notif: {
    adhan: true,
    prayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
    before: 10,
    after: 0,
    sound: 'default',
    morning: true, morningTime: { h: 6, m: 0 },
    evening: true, eveningTime: { h: 17, m: 30 },
    sleep: true, sleepTime: { h: 22, m: 30 },
    kahf: true, kahfTime: { h: 9, m: 0 },
  },
  riwaya: 'hafs',
  quranFont: 28,
  lastRead: null,
  azkar: { date: '', progress: {} },
  tasbeeh: { preset: 'subhan', count: 0, target: 33, cycles: 0, total: 0 },
  pin: null,
};

interface Ctx {
  s: Settings;
  ready: boolean;
  update: (patch: Partial<Settings>) => void;
  updateNotif: (patch: Partial<Settings['notif']>) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
  isRTL: boolean;
  theme: Theme;
  align: 'left' | 'right';
  reset: () => void;
}

const SettingsCtx = createContext<Ctx | null>(null);
const STORE_KEY = 'settings.v1';

function merge(base: Settings, saved: Partial<Settings> | null): Settings {
  if (!saved) return base;
  return {
    ...base,
    ...saved,
    notif: {
      ...base.notif,
      ...(saved.notif ?? {}),
      prayers: { ...base.notif.prayers, ...(saved.notif?.prayers ?? {}) },
    },
    azkar: { ...base.azkar, ...(saved.azkar ?? {}) },
    tasbeeh: { ...base.tasbeeh, ...(saved.tasbeeh ?? {}) },
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await getSecure<Partial<Settings>>(STORE_KEY);
      setS(merge(DEFAULT_SETTINGS, saved));
      loaded.current = true;
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { setSecure(STORE_KEY, s).catch(() => {}); }, 250);
  }, [s]);

  const update = useCallback((patch: Partial<Settings>) => setS((p) => ({ ...p, ...patch })), []);
  const updateNotif = useCallback(
    (patch: Partial<Settings['notif']>) => setS((p) => ({ ...p, notif: { ...p.notif, ...patch } })),
    [],
  );
  const reset = useCallback(() => setS(DEFAULT_SETTINGS), []);

  const value = useMemo<Ctx>(() => {
    const isRTL = LANGS.find((l) => l.id === s.lang)?.rtl ?? false;
    return {
      s, ready, update, updateNotif, reset, isRTL,
      theme: THEMES[s.theme],
      align: isRTL ? 'right' : 'left',
      t: (key, vars) => translate(s.lang, key, vars),
    };
  }, [s, ready, update, updateNotif, reset]);

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(SettingsCtx);
  if (!c) throw new Error('SettingsProvider missing');
  return c;
}
