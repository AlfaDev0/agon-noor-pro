import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../lib/settings';
import { Button, Card, FadeIn, ScreenHeader, Txt, ARABIC_BOLD } from '../components/ui';
import { PalestineFlag } from '../components/PalestineFlag';

const OWNER = require('../assets/images/1792866791121_srjv0gq7m.jpg');

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: 'time', text: 'Prayer times · 12 astronomical methods · GPS & manual' },
  { icon: 'notifications', text: 'Adhan alerts, before/after reminders, daily azkar' },
  { icon: 'book', text: 'Holy Quran · Hafs, Warsh, Qaloon, Doori, Soosi, Bazzi, Qunbul, Shu\'bah' },
  { icon: 'sunny', text: 'Morning / Evening / Sleep azkar with counters' },
  { icon: 'compass', text: 'Qibla compass · Tasbeeh · Calculator · Zakat' },
  { icon: 'language', text: 'العربية · English · Français · اردو · Türkçe (RTL/LTR)' },
  { icon: 'color-palette', text: '5 themes: Green, Royal Blue, Gold, Dark, Light' },
  { icon: 'shield-checkmark', text: 'AES-256 encrypted storage · PIN lock · HTTPS-only' },
];

export default function AboutScreen() {
  const { t, theme } = useApp();
  const nav = useNavigation<any>();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader back title={t('about')} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 50 }}>
        <FadeIn>
          <LinearGradient colors={theme.grad} style={{ borderRadius: 28, padding: 22, alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <View style={{ width: 128, height: 128, borderRadius: 64, overflow: 'hidden', borderWidth: 4, borderColor: theme.accent }}>
              <Image source={OWNER} style={{ width: '100%', height: '100%' }} contentFit="cover" contentPosition={{ top: 0, left: '50%' }} />
            </View>
            <Text style={{ color: '#ffffffcc', fontWeight: '700', fontSize: 13, marginTop: 6 }}>{t('developer')}</Text>
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900' }}>Ahmed Ayman</Text>
            <Text style={{ color: '#ffffffcc', fontSize: 14 }}>{t('owner_role')}</Text>
            <Text style={{ color: '#FFE08A', fontWeight: '800', fontSize: 16 }}>01110581059</Text>
          </LinearGradient>
        </FadeIn>

        <Card style={{ alignItems: 'center', gap: 10 }}>
          <PalestineFlag width={150} radius={8} />
          <Text style={{ fontFamily: ARABIC_BOLD, fontSize: 36, lineHeight: 54, color: theme.text }}>فلسطين حرة</Text>
          <Text style={{ color: '#009736', fontWeight: '900', fontSize: 18, letterSpacing: 0.5 }}>Free Palestine</Text>
        </Card>

        <Card style={{ gap: 6 }}>
          <Txt v="h2">{t('app_name')} · {t('version')} 1.0.0</Txt>
          <Txt v="body" sub>{t('about_text')}</Txt>
        </Card>

        <Card style={{ gap: 12 }}>
          <Txt v="h2">{t('features')}</Txt>
          {FEATURES.map((f) => (
            <View key={f.text} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: theme.card2, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={f.icon} size={19} color={theme.primary} />
              </View>
              <Txt v="small" style={{ flex: 1 }}>{f.text}</Txt>
            </View>
          ))}
        </Card>
        <Button icon="chatbubbles" label={t('contact_direct')} onPress={() => nav.navigate('Contact')} />
      </ScrollView>
    </View>
  );
}
