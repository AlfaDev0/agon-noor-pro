import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../lib/settings';
import { ScreenHeader } from '../components/ui';

type Op = '+' | '−' | '×' | '÷';

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
  }
}

function fmt(n: number): string {
  if (!isFinite(n)) return 'Error';
  const r = Math.round(n * 1e10) / 1e10;
  const s = String(r);
  if (s.includes('e')) return r.toExponential(6);
  const [i, d] = s.split('.');
  const neg = i.startsWith('-');
  const digits = neg ? i.slice(1) : i;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (neg ? '-' : '') + grouped + (d ? '.' + d : '');
}

export default function CalculatorScreen() {
  const { t, theme } = useApp();
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);
  const [expr, setExpr] = useState('');
  const [error, setError] = useState(false);

  const buzz = () => Haptics.selectionAsync().catch(() => {});
  const cur = () => Number(display.replace(/,/g, ''));

  const clear = () => { setDisplay('0'); setAcc(null); setOp(null); setFresh(true); setExpr(''); setError(false); };

  const digit = (d: string) => {
    buzz();
    if (error) { clear(); }
    if (fresh) { setDisplay(d === '.' ? '0.' : d); setFresh(false); return; }
    if (d === '.' && display.includes('.')) return;
    if (display.replace(/[-.]/g, '').length >= 12) return;
    setDisplay(display === '0' && d !== '.' ? d : display + d);
  };

  const operate = (next: Op) => {
    buzz();
    if (error) return;
    const v = cur();
    if (acc !== null && op && !fresh) {
      const r = compute(acc, v, op);
      if (!isFinite(r)) { setDisplay('Error'); setError(true); setAcc(null); setOp(null); setExpr(''); return; }
      setAcc(r); setDisplay(fmt(r)); setExpr(`${fmt(r)} ${next}`);
    } else {
      setAcc(v); setExpr(`${fmt(v)} ${next}`);
    }
    setOp(next); setFresh(true);
  };

  const equals = () => {
    buzz();
    if (error || acc === null || !op) return;
    const v = cur();
    const r = compute(acc, v, op);
    setExpr(`${fmt(acc)} ${op} ${fmt(v)} =`);
    if (!isFinite(r)) { setDisplay('Error'); setError(true); } else setDisplay(fmt(r));
    setAcc(null); setOp(null); setFresh(true);
  };

  const percent = () => { buzz(); if (!error) { setDisplay(fmt(cur() / 100)); setFresh(true); } };
  const sign = () => { buzz(); if (!error && display !== '0') setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display); };
  const back = () => {
    buzz();
    if (error) { clear(); return; }
    if (fresh) return;
    const n = display.slice(0, -1);
    setDisplay(n === '' || n === '-' ? '0' : n);
    if (n === '' || n === '-') setFresh(true);
  };

  const Key = ({ label, onPress, kind = 'num', icon, wide }: { label?: string; onPress: () => void; kind?: 'num' | 'op' | 'fn' | 'eq'; icon?: keyof typeof Ionicons.glyphMap; wide?: boolean }) => {
    const bg = kind === 'eq' ? theme.primary : kind === 'op' ? theme.card2 : kind === 'fn' ? theme.border : theme.card;
    const fg = kind === 'eq' ? theme.onPrimary : kind === 'op' ? theme.primary : theme.text;
    const active = kind === 'op' && op === label && fresh;
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          flex: wide ? 2 : 1, height: 66, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
          backgroundColor: active ? theme.primary : bg, opacity: pressed ? 0.7 : 1,
          borderWidth: kind === 'num' ? 1 : 0, borderColor: theme.border,
        })}
      >
        {icon ? <Ionicons name={icon} size={26} color={fg} /> : <Text style={{ fontSize: 26, fontWeight: '700', color: active ? theme.onPrimary : fg }}>{label}</Text>}
      </Pressable>
    );
  };

  const row = (children: React.ReactNode) => <View style={{ flexDirection: 'row', gap: 10 }}>{children}</View>;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader back title={t('calculator')} />
      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 24, justifyContent: 'flex-end', gap: 10, direction: 'ltr' }}>
        <View style={{ alignItems: 'flex-end', paddingHorizontal: 8, paddingBottom: 12 }}>
          <Text style={{ color: theme.sub, fontSize: 16, minHeight: 22 }}>{expr}</Text>
          <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: error ? theme.danger : theme.text, fontSize: 64, fontWeight: '300' }}>{display}</Text>
        </View>
        {row(<><Key label="C" kind="fn" onPress={clear} /><Key icon="backspace-outline" kind="fn" onPress={back} /><Key label="%" kind="fn" onPress={percent} /><Key label="÷" kind="op" onPress={() => operate('÷')} /></>)}
        {row(<><Key label="7" onPress={() => digit('7')} /><Key label="8" onPress={() => digit('8')} /><Key label="9" onPress={() => digit('9')} /><Key label="×" kind="op" onPress={() => operate('×')} /></>)}
        {row(<><Key label="4" onPress={() => digit('4')} /><Key label="5" onPress={() => digit('5')} /><Key label="6" onPress={() => digit('6')} /><Key label="−" kind="op" onPress={() => operate('−')} /></>)}
        {row(<><Key label="1" onPress={() => digit('1')} /><Key label="2" onPress={() => digit('2')} /><Key label="3" onPress={() => digit('3')} /><Key label="+" kind="op" onPress={() => operate('+')} /></>)}
        {row(<><Key label="±" onPress={sign} /><Key label="0" onPress={() => digit('0')} /><Key label="." onPress={() => digit('.')} /><Key label="=" kind="eq" onPress={equals} /></>)}
      </View>
    </View>
  );
}
