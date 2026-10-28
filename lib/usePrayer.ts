import { useEffect, useMemo, useState } from 'react';
import { useApp } from './settings';
import { addDays, computeDay, currentPrayerKey, dayInTz, PRAYER_KEYS, type PrayerKey } from './prayer';

export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function usePrayer() {
  const { s } = useApp();
  const now = useNow(1000);
  const dayDate = dayInTz(now, s.location.tz);
  const dayStamp = dayDate.getTime();
  const { lat, lng, tz, name } = s.location;

  const day = useMemo(
    () => computeDay({ lat, lng, tz, name }, s.method, s.madhab, new Date(dayStamp)),
    [lat, lng, tz, name, s.method, s.madhab, dayStamp],
  );
  const tomorrow = useMemo(
    () => computeDay({ lat, lng, tz, name }, s.method, s.madhab, addDays(new Date(dayStamp), 1)),
    [lat, lng, tz, name, s.method, s.madhab, dayStamp],
  );

  let nextKey: PrayerKey = 'fajr';
  let nextTime = tomorrow.fajr;
  for (const k of PRAYER_KEYS) {
    if (day[k].getTime() > now.getTime()) { nextKey = k; nextTime = day[k]; break; }
  }
  const currentKey = currentPrayerKey(day, now);
  return { now, dayDate, day, next: { key: nextKey, time: nextTime }, currentKey };
}
