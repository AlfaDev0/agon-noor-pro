import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useApp } from '../lib/settings';
import { Card, ScreenHeader, Txt } from '../components/ui';
import { Ionicons } from '@expo/vector-icons';

const num = (v: string) => {
  const n = Number(v.replace(',', '.'));
  return isFinite(n) && n > 0 ? n : 0;
};

export default function ZakatScreen() {
  const { t, theme, align } = useApp();
  const [f, setF] = useState({ cash: '', gold: '', silver: '', invest: '', debts: '', price: '' });
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v.replace(/[^0-9.,]/g, '') }));

  const goldPrice = num(f.price);
  const wealth = Math.max(0, num(f.cash) + num(f.invest) + num(f.gold) * goldPrice - num(f.debts));
  const nisab = 85 * goldPrice;
  const due = goldPrice > 0 && wealth >= nisab && wealth > 0 ? wealth * 0.025 : 0;
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const field = (label: string, key: keyof typeof f) => (
    <View style={{ gap: 6 }} key={key}>
      <Txt v="small" sub>{label}</Txt>
      <TextInput
        value={f[key]} onChangeText={set(key)} placeholder="0" placeholderTextColor={theme.sub}
        keyboardType="decimal-pad" returnKeyType="done"
        style={{ backgroundColor: theme.card2, color: theme.text, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 17, fontWeight: '700', textAlign: align, borderWidth: 1, borderColor: theme.border }}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader back title={t('zakat')} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Card style={{ gap: 14 }}>
          {field(t('gold_price'), 'price')}
          {field(t('zakat_cash'), 'cash')}
          {field(t('zakat_gold'), 'gold')}
          {field(t('zakat_invest'), 'invest')}
          {field(t('zakat_debts'), 'debts')}
        </Card>
        <Card style={{ gap: 10, backgroundColor: due > 0 ? theme.primary : theme.card }}>
          <Row label={t('total_wealth')} value={fmt(wealth)} light={due > 0} />
          <Row label={t('nisab')} value={fmt(nisab)} light={due > 0} />
          <View style={{ height: 1, backgroundColor: due > 0 ? '#ffffff44' : theme.border }} />
          <Txt v="caption" color={due > 0 ? '#ffffffcc' : theme.sub}>{t('zakat_due')}</Txt>
          <Text style={{ color: due > 0 ? '#fff' : theme.text, fontSize: 36, fontWeight: '900' }}>{fmt(due)}</Text>
          {goldPrice > 0 && due === 0 ? <Txt v="small" sub>{t('zakat_not_due')}</Txt> : null}
        </Card>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Ionicons name="information-circle" size={18} color={theme.sub} />
          <Txt v="small" sub style={{ flex: 1 }}>{t('zakat_note')}</Txt>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value, light }: { label: string; value: string; light?: boolean }) {
  const { theme } = useApp();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ color: light ? '#ffffffcc' : theme.sub, fontWeight: '600', fontSize: 13 }}>{label}</Text>
      <Text style={{ color: light ? '#fff' : theme.text, fontWeight: '800', fontSize: 16 }}>{value}</Text>
    </View>
  );
}
