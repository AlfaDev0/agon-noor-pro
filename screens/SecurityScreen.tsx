import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../lib/settings';
import { createPinRecord, hasHardwareKeystore, storageSelfTest, verifyPin, wipeAll } from '../lib/storage';
import { secureFetchJson } from '../lib/secureFetch';
import { Button, Card, IconBadge, PressScale, ScreenHeader, Txt } from '../components/ui';
import { PinPad } from '../components/PinPad';
import type { Key } from '../lib/i18n';

type Mode = null | 'verify-change' | 'verify-remove' | 'new' | 'confirm';

export default function SecurityScreen() {
  const { s, t, theme, update, reset } = useApp();
  const [mode, setMode] = useState<Mode>(null);
  const [draft, setDraft] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [test, setTest] = useState<null | 'running' | 'pass' | 'fail'>(null);
  const [resetKey, setResetKey] = useState(0);

  const native = hasHardwareKeystore();
  const checks: { icon: keyof typeof Ionicons.glyphMap; title: Key; desc: Key; state: 'on' | 'web' | 'build' | 'off'; descWeb?: Key }[] = [
    { icon: 'lock-closed', title: 'sec_storage', desc: 'sec_storage_d', state: 'on' },
    { icon: 'key', title: 'sec_keystore', desc: native ? 'sec_keystore_d' : 'sec_keystore_web', state: native ? 'on' : 'web' },
    { icon: 'globe', title: 'sec_https', desc: 'sec_https_d', state: 'on' },
    { icon: 'finger-print', title: 'sec_lock', desc: 'sec_lock_d', state: s.pin ? 'on' : 'off' },
    { icon: 'shield-half', title: 'sec_pinning', desc: 'sec_pinning_d', state: 'build' },
    { icon: 'code-slash', title: 'sec_obf', desc: 'sec_obf_d', state: 'build' },
    { icon: 'ribbon', title: 'sec_owasp', desc: 'sec_owasp_d', state: 'on' },
  ];

  const close = () => { setMode(null); setDraft(''); setErr(null); };

  const onPin = (pin: string) => {
    if (mode === 'verify-change' || mode === 'verify-remove') {
      if (s.pin && verifyPin(pin, s.pin)) {
        setErr(null);
        if (mode === 'verify-remove') { update({ pin: null }); close(); } else setMode('new');
      } else { setErr(t('wrong_pin')); setResetKey((k) => k + 1); }
    } else if (mode === 'new') {
      setDraft(pin); setErr(null); setMode('confirm');
    } else if (mode === 'confirm') {
      if (pin === draft) { update({ pin: createPinRecord(pin) }); close(); }
      else { setErr(t('pins_mismatch')); setDraft(''); setMode('new'); setResetKey((k) => k + 1); }
    }
  };

  const title = mode === 'new' ? t('new_pin') : mode === 'confirm' ? t('confirm_pin') : t('enter_pin');

  const runTest = async () => {
    setTest('running');
    const ok = await storageSelfTest();
    let httpsBlocked = false;
    try { await secureFetchJson('http://cdn.jsdelivr.net/x.json'); } catch (e) { httpsBlocked = String((e as Error).message).includes('HTTPS'); }
    let hostBlocked = false;
    try { await secureFetchJson('https://example.com/x.json'); } catch (e) { hostBlocked = String((e as Error).message).includes('host'); }
    setTest(ok && httpsBlocked && hostBlocked ? 'pass' : 'fail');
  };

  const wipe = async () => {
    const go = async () => { await wipeAll(); reset(); };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(t('clear_confirm'))) await go();
    } else {
      Alert.alert(t('clear_data'), t('clear_confirm'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), style: 'destructive', onPress: go },
      ]);
    }
  };

  const badge = (st: 'on' | 'web' | 'build' | 'off') => {
    const map = {
      on: { c: theme.success, l: t('active'), i: 'checkmark-circle' as const },
      web: { c: theme.accent, l: t('web_limited'), i: 'alert-circle' as const },
      build: { c: theme.accent, l: t('production_build'), i: 'construct' as const },
      off: { c: theme.sub, l: t('off'), i: 'ellipse-outline' as const },
    }[st];
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: map.c + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' }}>
        <Ionicons name={map.i} size={13} color={map.c} />
        <Text style={{ color: map.c, fontSize: 11, fontWeight: '800' }}>{map.l}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader back title={t('security_center')} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <LinearGradient colors={theme.grad} style={{ borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Ionicons name="shield-checkmark" size={46} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18 }}>OWASP Mobile Top 10</Text>
            <Text style={{ color: '#ffffffcc', fontSize: 13, marginTop: 2 }}>{t('sec_summary')}</Text>
          </View>
        </LinearGradient>

        <Card style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <IconBadge name="keypad" />
            <View style={{ flex: 1 }}>
              <Txt v="h2">{t('pin_lock')}</Txt>
              {badge(s.pin ? 'on' : 'off')}
            </View>
          </View>
          {s.pin ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button kind="soft" style={{ flex: 1 }} label={t('change_pin')} onPress={() => { setErr(null); setMode('verify-change'); }} />
              <Button kind="danger" style={{ flex: 1 }} label={t('remove_pin')} onPress={() => { setErr(null); setMode('verify-remove'); }} />
            </View>
          ) : (
            <Button label={t('set_pin')} icon="lock-closed" onPress={() => { setErr(null); setMode('new'); }} />
          )}
        </Card>

        {checks.map((c) => (
          <Card key={c.title} style={{ flexDirection: 'row', gap: 12 }}>
            <IconBadge name={c.icon} />
            <View style={{ flex: 1, gap: 4 }}>
              <Txt v="h2" style={{ fontSize: 15.5 }}>{t(c.title)}</Txt>
              {badge(c.state)}
              <Txt v="small" sub>{t(c.desc)}</Txt>
            </View>
          </Card>
        ))}

        <Card style={{ gap: 10 }}>
          <Txt v="h2">{t('self_test')}</Txt>
          {test === 'pass' ? <Text style={{ color: theme.success, fontWeight: '800' }}>✓ {t('test_pass')}</Text> : null}
          {test === 'fail' ? <Text style={{ color: theme.danger, fontWeight: '800' }}>✗ {t('test_fail')}</Text> : null}
          <Button kind="outline" icon="pulse" label={test === 'running' ? t('loading') : t('run_test')} onPress={runTest} disabled={test === 'running'} />
        </Card>

        <Button kind="danger" icon="trash" label={t('clear_data')} onPress={wipe} />
      </ScrollView>

      <Modal visible={mode !== null} animationType="slide" onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <PinPad title={title} error={err} onComplete={onPin} resetKey={resetKey} />
          <PressScale onPress={close}><Text style={{ color: theme.sub, fontWeight: '700', fontSize: 15, padding: 10 }}>{t('cancel')}</Text></PressScale>
        </View>
      </Modal>
    </View>
  );
}
