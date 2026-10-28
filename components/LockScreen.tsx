import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../lib/settings';
import { getSecure, setSecure, verifyPin } from '../lib/storage';
import { PinPad } from './PinPad';
import { PalestineFlag } from './PalestineFlag';
import { Txt } from './ui';

interface LockState { fails: number; until: number }

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { s, t, theme } = useApp();
  const insets = useSafeAreaInsets();
  const [err, setErr] = useState<string | null>(null);
  const [state, setState] = useState<LockState>({ fails: 0, until: 0 });
  const [now, setNow] = useState(Date.now());
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    getSecure<LockState>('lock.v1').then((v) => { if (v) setState(v); });
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const wait = Math.max(0, Math.ceil((state.until - now) / 1000));
  const blocked = wait > 0;

  const submit = async (pin: string) => {
    if (blocked || !s.pin) return;
    if (verifyPin(pin, s.pin)) {
      setErr(null);
      await setSecure('lock.v1', { fails: 0, until: 0 });
      onUnlock();
      return;
    }
    const fails = state.fails + 1;
    // exponential back-off after 3 failures: 15s, 30s, 60s ... capped at 15 min
    const delay = fails >= 3 ? Math.min(900, 15 * 2 ** (fails - 3)) * 1000 : 0;
    const next = { fails, until: delay ? Date.now() + delay : 0 };
    setState(next);
    await setSecure('lock.v1', next);
    setErr(t('wrong_pin'));
    setResetKey((k) => k + 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', paddingTop: insets.top, gap: 18 }}>
      <PalestineFlag width={72} radius={6} />
      <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="lock-closed" size={34} color={theme.onPrimary} />
      </View>
      <Txt v="title" center>{t('app_name')}</Txt>
      <PinPad
        title={t('enter_pin')} error={blocked ? t('locked_try_later', { n: wait }) : err}
        onComplete={submit} resetKey={resetKey} disabled={blocked}
      />
    </View>
  );
}
