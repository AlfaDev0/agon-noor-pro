import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';

/**
 * Encrypted local storage.
 *  - Master key: 256-bit random, held in iOS Keychain / Android Keystore (SecureStore).
 *    On web (preview only) a localStorage key is used.
 *  - Data: AES-256-CBC with random IV, authenticated with HMAC-SHA256 (encrypt-then-MAC).
 */
const KEY_NAME = 'noor.master.key.v1';
const PREFIX = 'noor.enc.';

let keyCache: string | null = null;

function randomHex(bytes: number): string {
  const arr = Crypto.getRandomBytes(bytes);
  let out = '';
  for (let i = 0; i < arr.length; i++) out += arr[i].toString(16).padStart(2, '0');
  return out;
}

async function getMasterKey(): Promise<string> {
  if (keyCache) return keyCache;
  let key: string | null = null;
  if (Platform.OS === 'web') {
    try { key = globalThis.localStorage?.getItem(KEY_NAME) ?? null; } catch { key = null; }
    if (!key) {
      key = randomHex(32);
      try { globalThis.localStorage?.setItem(KEY_NAME, key); } catch { /* ignore */ }
    }
  } else {
    key = await SecureStore.getItemAsync(KEY_NAME);
    if (!key) {
      key = randomHex(32);
      await SecureStore.setItemAsync(KEY_NAME, key, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
    }
  }
  keyCache = key;
  return key;
}

function deriveKeys(master: string) {
  const encKey = CryptoJS.SHA256('enc|' + master);
  const macKey = CryptoJS.SHA256('mac|' + master);
  return { encKey, macKey };
}

export async function encryptString(plain: string): Promise<string> {
  const master = await getMasterKey();
  const { encKey, macKey } = deriveKeys(master);
  const iv = CryptoJS.enc.Hex.parse(randomHex(16));
  const ct = CryptoJS.AES.encrypt(plain, encKey, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  const ivHex = CryptoJS.enc.Hex.stringify(iv);
  const ctB64 = ct.ciphertext.toString(CryptoJS.enc.Base64);
  const mac = CryptoJS.HmacSHA256(`v1.${ivHex}.${ctB64}`, macKey).toString(CryptoJS.enc.Hex);
  return `v1.${ivHex}.${ctB64}.${mac}`;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function decryptString(payload: string): Promise<string | null> {
  try {
    const parts = payload.split('.');
    if (parts.length !== 4 || parts[0] !== 'v1') return null;
    const [, ivHex, ctB64, mac] = parts;
    const master = await getMasterKey();
    const { encKey, macKey } = deriveKeys(master);
    const expected = CryptoJS.HmacSHA256(`v1.${ivHex}.${ctB64}`, macKey).toString(CryptoJS.enc.Hex);
    if (!safeEqual(expected, mac)) return null; // tampered
    const params = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(ctB64) });
    const dec = CryptoJS.AES.decrypt(params, encKey, {
      iv: CryptoJS.enc.Hex.parse(ivHex), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7,
    });
    const text = dec.toString(CryptoJS.enc.Utf8);
    return text.length ? text : null;
  } catch {
    return null;
  }
}

export async function setSecure<T>(name: string, value: T): Promise<void> {
  const enc = await encryptString(JSON.stringify(value));
  await AsyncStorage.setItem(PREFIX + name, enc);
}

export async function getSecure<T>(name: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(PREFIX + name);
  if (!raw) return null;
  const plain = await decryptString(raw);
  if (plain == null) return null;
  try { return JSON.parse(plain) as T; } catch { return null; }
}

export async function wipeAll(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.removeMany(keys.filter((k) => k.startsWith('noor.')));
}

export function hasHardwareKeystore(): boolean {
  return Platform.OS !== 'web';
}

/** Round-trip + tamper-detection self test. */
export async function storageSelfTest(): Promise<boolean> {
  try {
    const sample = 'noor-test-' + randomHex(8) + '-ﷲ';
    const enc = await encryptString(sample);
    if (enc.includes('noor-test')) return false;
    const dec = await decryptString(enc);
    if (dec !== sample) return false;
    const parts = enc.split('.');
    const flipped = parts[2].slice(0, -3) + (parts[2].endsWith('AAA') ? 'BBB' : 'AAA');
    const tampered = [parts[0], parts[1], flipped, parts[3]].join('.');
    const bad = await decryptString(tampered);
    return bad === null;
  } catch {
    return false;
  }
}

// ---- PIN hashing ----
export interface PinRecord { salt: string; hash: string }

export function hashPin(pin: string, salt: string): string {
  return CryptoJS.PBKDF2(pin, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32, iterations: 4000, hasher: CryptoJS.algo.SHA256,
  }).toString(CryptoJS.enc.Hex);
}

export function createPinRecord(pin: string): PinRecord {
  const salt = randomHex(16);
  return { salt, hash: hashPin(pin, salt) };
}

export function verifyPin(pin: string, rec: PinRecord): boolean {
  return safeEqual(hashPin(pin, rec.salt), rec.hash);
}
