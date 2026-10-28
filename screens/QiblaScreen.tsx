import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Magnetometer } from 'expo-sensors';
import { useApp } from '../lib/settings';
import { distanceToKaabaKm, qiblaBearing } from '../lib/prayer';
import { Card, ScreenHeader, Txt } from '../components/ui';

const SIZE = 290;

export default function QiblaScreen() {
  const { s, t, theme } = useApp();
  const { lat, lng, name } = s.location;
  const bearing = qiblaBearing(lat, lng);
  const dist = distanceToKaabaKm(lat, lng);
  const [heading, setHeading] = useState<number | null>(null);
  const rot = useRef(new Animated.Value(0)).current;
  const last = useRef(0);

  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    (async () => {
      try {
        if (Platform.OS === 'web') return;
        const ok = await Magnetometer.isAvailableAsync();
        if (!ok || cancelled) return;
        Magnetometer.setUpdateInterval(100);
        sub = Magnetometer.addListener(({ x, y }) => {
          let h = Math.atan2(y, x) * (180 / Math.PI) - 90;
          h = (h + 360) % 360;
          setHeading(h);
        });
      } catch { /* unavailable */ }
    })();
    return () => { cancelled = true; sub?.remove(); };
  }, []);

  // Dial rotates opposite to heading so N stays at true north.
  useEffect(() => {
    if (heading == null) return;
    let target = -heading;
    // shortest path
    let diff = target - (last.current % 360);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const next = last.current + diff;
    last.current = next;
    Animated.timing(rot, { toValue: next, duration: 120, easing: Easing.linear, useNativeDriver: true }).start();
  }, [heading, rot]);

  const dialRotate = rot.interpolate({ inputRange: [-36000, 36000], outputRange: ['-36000deg', '36000deg'] });
  const aligned = heading != null && Math.abs(((heading - bearing + 540) % 360) - 180) < 4;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenHeader back title={t('qibla')} subtitle={name} />
      <View style={{ flex: 1, alignItems: 'center', padding: 16, gap: 18 }}>
        <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
          <Animated.View style={{
            width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: theme.card, borderWidth: 3,
            borderColor: aligned ? theme.success : theme.border, transform: [{ rotate: heading == null ? '0deg' : dialRotate }],
            shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, elevation: 5,
          }}>
            {['N', 'E', 'S', 'W'].map((d, i) => (
              <View key={d} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', transform: [{ rotate: `${i * 90}deg` }] }}>
                <Text style={{ marginTop: 10, color: d === 'N' ? theme.danger : theme.sub, fontWeight: '900', fontSize: 18 }}>{d}</Text>
              </View>
            ))}
            {Array.from({ length: 36 }).map((_, i) => (
              <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', transform: [{ rotate: `${i * 10}deg` }] }}>
                <View style={{ marginTop: 36, width: i % 9 === 0 ? 0 : 2, height: i % 3 === 0 ? 12 : 6, backgroundColor: theme.border }} />
              </View>
            ))}
            {/* Qibla marker rotates with the dial at its true bearing */}
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', transform: [{ rotate: `${bearing}deg` }] }}>
              <View style={{ marginTop: 44, alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: theme.accent }}>
                  <Text style={{ fontSize: 20 }}>🕋</Text>
                </View>
                <View style={{ width: 4, height: SIZE / 2 - 100, backgroundColor: theme.accent, borderRadius: 2, marginTop: 4 }} />
              </View>
            </View>
          </Animated.View>
          {/* Fixed phone pointer */}
          <View style={{ position: 'absolute', top: -14, alignItems: 'center' }}>
            <Ionicons name="caret-down" size={30} color={aligned ? theme.success : theme.primary} />
          </View>
          <View style={{ position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: theme.primary }} />
        </View>

        <Card style={{ alignSelf: 'stretch', alignItems: 'center', gap: 4 }}>
          <Txt v="caption" sub center>{t('qibla_direction')}</Txt>
          <Text style={{ color: theme.primary, fontSize: 40, fontWeight: '900' }}>{bearing.toFixed(1)}°</Text>
          <Txt v="small" sub center>{t('degrees_from_north')}</Txt>
          <View style={{ height: 1, alignSelf: 'stretch', backgroundColor: theme.border, marginVertical: 8 }} />
          <Txt v="small" sub center>{t('distance_kaaba')}: {Math.round(dist).toLocaleString()} km</Txt>
        </Card>
        {heading == null ? (
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingHorizontal: 6 }}>
            <Ionicons name="information-circle" size={18} color={theme.sub} />
            <Txt v="small" sub style={{ flex: 1 }}>{t('compass_unavailable')}</Txt>
          </View>
        ) : aligned ? (
          <Text style={{ color: theme.success, fontWeight: '800', fontSize: 16 }}>✓ {t('qibla')}</Text>
        ) : null}
      </View>
    </View>
  );
}
