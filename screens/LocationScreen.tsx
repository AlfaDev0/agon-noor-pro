import React, { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useApp } from '../lib/settings';
import { CITIES, METHODS, type GeoLocation } from '../lib/prayer';
import { Button, Card, Chip, PressScale, ScreenHeader, Txt } from '../components/ui';

export default function LocationScreen() {
  const { s, t, theme, update, isRTL, align } = useApp();
  const nav = useNavigation<any>();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [lat, setLat] = useState(String(s.location.lat));
  const [lng, setLng] = useState(String(s.location.lng));
  const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const setLoc = (loc: GeoLocation) => update({ location: loc });

  const useGps = async () => {
    setMsg(null);
    setBusy(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) { setMsg(t('gps_denied')); return; }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      let name = `GPS ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
      try {
        const rev = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        const r = rev[0];
        if (r) name = [r.city ?? r.subregion ?? r.region, r.country].filter(Boolean).join(', ') || name;
      } catch { /* reverse geocode unavailable (web) */ }
      setLoc({ name, lat: pos.coords.latitude, lng: pos.coords.longitude, tz: deviceTz, auto: true });
      setLat(pos.coords.latitude.toFixed(4)); setLng(pos.coords.longitude.toFixed(4));
      nav.goBack();
    } catch {
      setMsg(t('gps_denied'));
    } finally {
      setBusy(false);
    }
  };

  const applyManual = () => {
    const la = Number(lat.replace(',', '.')), lo = Number(lng.replace(',', '.'));
    if (!isFinite(la) || !isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180 || lat.trim() === '' || lng.trim() === '') {
      setMsg(t('invalid_coords')); return;
    }
    setLoc({ name: `${la.toFixed(2)}, ${lo.toFixed(2)}`, lat: la, lng: lo, tz: deviceTz });
    nav.goBack();
  };

  const input = {
    flex: 1, backgroundColor: theme.card2, color: theme.text, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, textAlign: align, borderWidth: 1, borderColor: theme.border,
  } as const;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title={t('location')} back />
      <FlatList
        data={CITIES}
        keyExtractor={(c) => c.en}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 8 }}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 8 }}>
            <Button label={busy ? t('locating') : t('use_gps')} icon="navigate" onPress={useGps} disabled={busy} />
            {busy ? <ActivityIndicator color={theme.primary} /> : null}
            {msg ? <Txt v="small" color={theme.danger}>{msg}</Txt> : null}
            <Card>
              <Txt v="h2" style={{ marginBottom: 10 }}>{t('manual_coords')}</Txt>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput value={lat} onChangeText={setLat} placeholder={t('latitude')} placeholderTextColor={theme.sub}
                  keyboardType="numbers-and-punctuation" returnKeyType="next" style={input} />
                <TextInput value={lng} onChangeText={setLng} placeholder={t('longitude')} placeholderTextColor={theme.sub}
                  keyboardType="numbers-and-punctuation" returnKeyType="done" onSubmitEditing={applyManual} style={input} />
              </View>
              <Button label={t('apply')} kind="soft" onPress={applyManual} style={{ marginTop: 10 }} />
            </Card>
            <Txt v="h2" style={{ marginTop: 8 }}>{t('choose_city')}</Txt>
          </View>
        }
        renderItem={({ item }) => {
          const active = s.location.name === item.en || s.location.name === item.ar;
          return (
            <PressScale
              onPress={() => {
                setLoc({ name: s.lang === 'ar' ? item.ar : item.en, lat: item.lat, lng: item.lng, tz: item.tz });
                nav.goBack();
              }}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16,
                backgroundColor: theme.card, borderWidth: 1, borderColor: active ? theme.primary : theme.border,
              }}
            >
              <Ionicons name="location-outline" size={20} color={theme.primary} />
              <Text style={{ flex: 1, color: theme.text, fontWeight: '700', fontSize: 15, textAlign: align }}>{s.lang === 'ar' ? item.ar : item.en}</Text>
              <Text style={{ color: theme.sub, fontSize: 12 }}>{item.tz.split('/')[1]?.replace('_', ' ')}</Text>
            </PressScale>
          );
        }}
      />
    </KeyboardAvoidingView>
  );
}
