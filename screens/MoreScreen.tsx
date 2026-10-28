import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../lib/settings';
import { Card, FadeIn, FreePalestineChip, IconBadge, PressScale, ScreenHeader, Txt } from '../components/ui';
import type { Key } from '../lib/i18n';

const ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: Key; sub?: Key; route: string }[] = [
  { icon: 'radio-button-on', label: 'tasbeeh', sub: 'tap_to_count', route: 'Tasbeeh' },
  { icon: 'compass', label: 'qibla', sub: 'qibla_direction', route: 'Qibla' },
  { icon: 'calculator', label: 'calculator', route: 'Calculator' },
  { icon: 'cash', label: 'zakat', sub: 'zakat_due', route: 'Zakat' },
  { icon: 'settings', label: 'settings', sub: 'language', route: 'Settings' },
  { icon: 'shield-checkmark', label: 'security_center', sub: 'sec_summary', route: 'Security' },
  { icon: 'chatbubbles', label: 'contact_direct', sub: 'contact_sub', route: 'Contact' },
  { icon: 'information-circle', label: 'about', sub: 'developer', route: 'About' },
];

export default function MoreScreen() {
  const { t, theme, isRTL } = useApp();
  const nav = useNavigation<any>();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title={t('more_title')} subtitle="Ahmed Ayman" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30, gap: 10 }} showsVerticalScrollIndicator={false}>
        {ITEMS.map((it, i) => (
          <FadeIn key={it.route} delay={i * 40}>
            <Card onPress={() => nav.navigate(it.route)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 }}>
              <IconBadge name={it.icon} />
              <View style={{ flex: 1 }}>
                <Txt v="h2" style={{ fontSize: 16 }}>{t(it.label)}</Txt>
                {it.sub ? <Txt v="small" sub numberOfLines={1}>{t(it.sub)}</Txt> : null}
              </View>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={theme.sub} />
            </Card>
          </FadeIn>
        ))}
        <View style={{ alignItems: 'center', marginTop: 16, gap: 10 }}>
          <FreePalestineChip />
          <Text style={{ color: theme.sub, fontSize: 12, fontWeight: '600' }}>{t('developed_by')} <Text style={{ color: theme.primary, fontWeight: '900' }}>Ahmed Ayman</Text></Text>
        </View>
      </ScrollView>
    </View>
  );
}
