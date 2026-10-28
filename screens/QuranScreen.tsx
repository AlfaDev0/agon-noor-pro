import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../lib/settings';
import { SURAHS } from '../lib/data/surahs';
import { RIWAYAT } from '../lib/riwayat';
import { ARABIC_FONT, Card, Chip, PressScale, ScreenHeader, Txt } from '../components/ui';
import { toArabicDigits } from '../lib/riwayat';

export default function QuranScreen() {
  const { s, t, theme, update, align } = useApp();
  const nav = useNavigation<any>();
  const [q, setQ] = useState('');
  const riwaya = RIWAYAT.find((r) => r.id === s.riwaya)!;

  const data = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return SURAHS;
    const digits = k.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
    return SURAHS.filter((x) =>
      String(x.n) === digits || x.en.toLowerCase().includes(k) || x.tr.toLowerCase().includes(k) ||
      x.ar.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').includes(k.replace(/[\u064B-\u065F]/g, '')),
    );
  }, [q]);

  const last = s.lastRead ? SURAHS[s.lastRead.surah - 1] : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader title={t('quran_title')} subtitle={t(riwaya.label)} />
      <FlatList
        data={data}
        keyExtractor={(x) => String(x.n)}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={14}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30, gap: 8 }}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 16, paddingHorizontal: 14, borderWidth: 1, borderColor: theme.border }}>
              <Ionicons name="search" size={18} color={theme.sub} />
              <TextInput
                value={q} onChangeText={setQ} placeholder={t('search_surah')} placeholderTextColor={theme.sub}
                returnKeyType="search" autoCorrect={false}
                style={{ flex: 1, color: theme.text, paddingVertical: 12, paddingHorizontal: 10, fontSize: 15, textAlign: align }}
              />
              {q ? <Ionicons name="close-circle" size={18} color={theme.sub} onPress={() => setQ('')} /> : null}
            </View>
            <View>
              <Txt v="caption" sub style={{ marginBottom: 6 }}>{t('riwaya')}</Txt>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {RIWAYAT.map((r) => (
                  <Chip key={r.id} label={t(r.label)} active={s.riwaya === r.id} onPress={() => update({ riwaya: r.id })} icon={r.edition ? undefined : 'cloud-offline'} />
                ))}
              </ScrollView>
            </View>
            {last ? (
              <Card onPress={() => nav.navigate('Surah', { surah: last.n, ayah: s.lastRead?.ayah })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="bookmark" size={22} color={theme.accent} />
                <View style={{ flex: 1 }}>
                  <Txt v="caption" sub>{t('last_read')}</Txt>
                  <Txt v="h2">{last.ar} · {t('ayah')} {s.lastRead?.ayah}</Txt>
                </View>
                <Ionicons name="play-circle" size={30} color={theme.primary} />
              </Card>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <PressScale
            onPress={() => nav.navigate('Surah', { surah: item.n })}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18,
              backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border,
            }}
          >
            <View style={{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ position: 'absolute', width: 32, height: 32, borderRadius: 8, backgroundColor: theme.card2, transform: [{ rotate: '45deg' }] }} />
              <View style={{ position: 'absolute', width: 32, height: 32, borderRadius: 8, backgroundColor: theme.card2, borderWidth: 1.5, borderColor: theme.primary + '66' }} />
              <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 13 }}>{item.n}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontWeight: '800', fontSize: 15, textAlign: align }}>{item.en}</Text>
              <Text style={{ color: theme.sub, fontSize: 12, textAlign: align }}>
                {item.tr} · {item.v} {t('verses')} · {item.rev === 'Mecca' ? t('meccan') : t('medinan')}
              </Text>
            </View>
            <Text style={{ fontFamily: ARABIC_FONT, fontSize: 24, color: theme.primary }}>{item.ar}</Text>
          </PressScale>
        )}
        ListEmptyComponent={<Txt center sub style={{ marginTop: 30 }}>—</Txt>}
      />
    </View>
  );
}

export { toArabicDigits };
