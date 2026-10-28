import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureFetchJson } from './secureFetch';
import type { Key } from './i18n';

const hafsData: string[][] = require('./data/hafs.json');

export type RiwayaId = 'hafs' | 'warsh' | 'qaloon' | 'doori' | 'soosi' | 'bazzi' | 'qumbul' | 'shouba';

export const RIWAYAT: { id: RiwayaId; edition: string | null; label: Key }[] = [
  { id: 'hafs', edition: null, label: 'riwaya_hafs' },
  { id: 'warsh', edition: 'ara-quranwarsh', label: 'riwaya_warsh' },
  { id: 'qaloon', edition: 'ara-quranqaloon', label: 'riwaya_qaloon' },
  { id: 'doori', edition: 'ara-qurandoori', label: 'riwaya_doori' },
  { id: 'soosi', edition: 'ara-quransoosi', label: 'riwaya_soosi' },
  { id: 'bazzi', edition: 'ara-quranbazzi', label: 'riwaya_bazzi' },
  { id: 'qumbul', edition: 'ara-quranqumbul', label: 'riwaya_qumbul' },
  { id: 'shouba', edition: 'ara-quranshouba', label: 'riwaya_shouba' },
];

const BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/';
const mem = new Map<string, string[]>();

export function hafsSurah(n: number): string[] {
  return hafsData[n - 1];
}

export async function loadSurah(riwaya: RiwayaId, n: number): Promise<string[]> {
  if (n < 1 || n > 114 || !Number.isInteger(n)) throw new Error('Invalid surah');
  const def = RIWAYAT.find((r) => r.id === riwaya);
  if (!def || !def.edition) return hafsData[n - 1];
  const cacheKey = `noor.quran.${riwaya}.${n}`;
  const m = mem.get(cacheKey);
  if (m) return m;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    try {
      const arr = JSON.parse(cached);
      if (Array.isArray(arr) && arr.length) { mem.set(cacheKey, arr); return arr; }
    } catch { /* refetch */ }
  }
  const data = await secureFetchJson<{ chapter: { chapter: number; verse: number; text: string }[] }>(
    `${BASE}${def.edition}/${n}.json`,
  );
  if (!data || !Array.isArray(data.chapter) || !data.chapter.length) throw new Error('Bad data');
  const verses = data.chapter
    .filter((v) => v.chapter === n && typeof v.text === 'string')
    .sort((a, b) => a.verse - b.verse)
    .map((v) => v.text);
  if (!verses.length) throw new Error('Bad data');
  mem.set(cacheKey, verses);
  try { await AsyncStorage.setItem(cacheKey, JSON.stringify(verses)); } catch { /* storage full */ }
  return verses;
}

export const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}
