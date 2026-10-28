import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../lib/settings';

export function PinPad({ title, error, onComplete, length = 4, resetKey, disabled }: {
  title: string; error?: string | null; onComplete: (pin: string) => void; length?: number; resetKey?: number; disabled?: boolean;
}) {
  const { theme } = useApp();
  const [pin, setPin] = useState('');
  useEffect(() => { setPin(''); }, [resetKey]);

  const press = (d: string) => {
    if (disabled) return;
    Haptics.selectionAsync().catch(() => {});
    const next = (pin + d).slice(0, length);
    setPin(next);
    if (next.length === length) {
      setTimeout(() => { onComplete(next); setPin(''); }, 120);
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  return (
    <View style={{ alignItems: 'center', gap: 22, direction: 'ltr' }}>
      <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', textAlign: 'center' }}>{title}</Text>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={{
            width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: error ? theme.danger : theme.primary,
            backgroundColor: i < pin.length ? (error ? theme.danger : theme.primary) : 'transparent',
          }} />
        ))}
      </View>
      <Text style={{ color: theme.danger, fontSize: 13, fontWeight: '700', minHeight: 18, textAlign: 'center' }}>{error ?? ''}</Text>
      <View style={{ width: 280, flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', opacity: disabled ? 0.4 : 1 }}>
        {keys.map((k, i) => (
          k === '' ? <View key={i} style={{ width: 80, height: 64 }} /> : (
            <Pressable
              key={i}
              onPress={() => (k === 'del' ? setPin((p) => p.slice(0, -1)) : press(k))}
              style={({ pressed }) => ({
                width: 80, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
                backgroundColor: pressed ? theme.card2 : theme.card, borderWidth: 1, borderColor: theme.border,
              })}
            >
              {k === 'del' ? <Ionicons name="backspace-outline" size={26} color={theme.text} /> :
                <Text style={{ color: theme.text, fontSize: 26, fontWeight: '700' }}>{k}</Text>}
            </Pressable>
          )
        ))}
      </View>
    </View>
  );
}
