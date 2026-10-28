import React, { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { useApp } from '../lib/settings';
import { Button, Card, FreePalestineChip, PressScale, ScreenHeader, Txt } from '../components/ui';

const OWNER = require('../assets/images/1792866791121_srjv0gq7m.jpg');
export const OWNER_NAME = 'Ahmed Ayman';
export const OWNER_PHONE_LOCAL = '01110581059';
export const OWNER_PHONE_INTL = '201110581059';

export default function ContactScreen() {
  const { t, theme, align } = useApp();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState<string | null>(null);

  const open = (url: string) => Linking.openURL(url).catch(() => setNote('—'));

  const sendWhatsApp = () => {
    const body = msg.trim().slice(0, 1000);
    if (!body) { setNote(t('message_required')); return; }
    setNote(null);
    const text = (name.trim() ? `${name.trim().slice(0, 60)}: ` : '') + body;
    open(`https://wa.me/${OWNER_PHONE_INTL}?text=${encodeURIComponent(text)}`);
  };

  const copy = async () => {
    await Clipboard.setStringAsync(OWNER_PHONE_LOCAL);
    setNote(t('copied'));
  };

  const input = {
    backgroundColor: theme.card2, color: theme.text, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, textAlign: align, borderWidth: 1, borderColor: theme.border,
  } as const;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader back title={t('contact_direct')} subtitle={t('contact_sub')} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
        <View style={{ borderRadius: 28, overflow: 'hidden', height: 360, backgroundColor: '#0B1020' }}>
          <Image source={OWNER} style={{ width: '100%', height: '100%' }} contentFit="cover" contentPosition={{ top: 0, left: '50%' }} transition={300} accessibilityLabel={OWNER_NAME} />
          <LinearGradient colors={['transparent', '#000000dd']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 160, justifyContent: 'flex-end', padding: 18 }}>
            <Text style={{ color: '#fff', fontSize: 30, fontWeight: '900' }}>{OWNER_NAME}</Text>
            <Text style={{ color: '#ffffffcc', fontSize: 14, fontWeight: '600' }}>{t('owner_role')}</Text>
            <Text style={{ color: theme.accent, fontSize: 16, fontWeight: '800', marginTop: 4, writingDirection: 'ltr' }}>{OWNER_PHONE_LOCAL}</Text>
          </LinearGradient>
          <View style={{ position: 'absolute', top: 12, right: 12 }}><FreePalestineChip compact /></View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <PressScale style={{ flex: 1, backgroundColor: '#25D366', borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 4 }}
            onPress={() => open(`https://wa.me/${OWNER_PHONE_INTL}`)}>
            <Ionicons name="logo-whatsapp" size={28} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>{t('whatsapp')}</Text>
          </PressScale>
          <PressScale style={{ flex: 1, backgroundColor: theme.primary, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 4 }}
            onPress={() => open(`tel:+${OWNER_PHONE_INTL}`)}>
            <Ionicons name="call" size={28} color={theme.onPrimary} />
            <Text style={{ color: theme.onPrimary, fontWeight: '800', fontSize: 13 }}>{t('call')}</Text>
          </PressScale>
          <PressScale style={{ flex: 1, backgroundColor: theme.card, borderRadius: 18, paddingVertical: 14, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: theme.border }}
            onPress={() => open(`sms:+${OWNER_PHONE_INTL}`)}>
            <Ionicons name="chatbubble-ellipses" size={28} color={theme.primary} />
            <Text style={{ color: theme.text, fontWeight: '800', fontSize: 13 }}>{t('sms')}</Text>
          </PressScale>
        </View>

        <Card style={{ gap: 12 }}>
          <TextInput value={name} onChangeText={setName} placeholder={t('your_name')} placeholderTextColor={theme.sub}
            returnKeyType="next" maxLength={60} style={input} />
          <TextInput value={msg} onChangeText={setMsg} placeholder={t('your_message')} placeholderTextColor={theme.sub}
            multiline numberOfLines={4} maxLength={1000} textAlignVertical="top" style={[input, { minHeight: 110 }]} />
          <Button label={t('send_message')} icon="logo-whatsapp" color="#25D366" onPress={sendWhatsApp} />
          <Button kind="soft" label={t('copy_number')} icon="copy" onPress={copy} />
          {note ? <Txt v="small" center color={theme.primary}>{note}</Txt> : null}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
