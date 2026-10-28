import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Txt } from './ui';
import { useTheme } from '../lib/theme';
import { useAlarm } from '../lib/alarm';
import { useI18n } from '../lib/i18n';
import { playAdhan, stopAdhan } from '../lib/adhanAudio';

const { width, height } = Dimensions.get('window');

export default function AdhanAlarmOverlay() {
  const { visible, data, hide } = useAlarm();
  const { theme } = useTheme();
  const { t } = useI18n();

  const scale1 = useRef(new Animated.Value(0.8)).current;
  const scale2 = useRef(new Animated.Value(0.9)).current;
  const scale3 = useRef(new Animated.Value(1.0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      stopAdhan().catch(() => {});
      return;
    }

    playAdhan().catch(() => {});

    // هابتيكس متكرر زي المنبه
    const h1 = setInterval(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}), 150);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid).catch(() => {}), 300);
    }, 850);

    // أنميشن الموجات المائية
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale1, { toValue: 1.6, duration: 2200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale1, { toValue: 0.8, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale2, { toValue: 1.9, duration: 2800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale2, { toValue: 0.9, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale3, { toValue: 2.2, duration: 3400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale3, { toValue: 1.0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0, duration: 6000, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, { toValue: 12, duration: 3800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float1, { toValue: -8, duration: 3800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, { toValue: -16, duration: 4600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float2, { toValue: 10, duration: 4600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    return () => clearInterval(h1);
  }, [visible]);

  if (!visible) return null;

  const rot = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={styles.root}>
        <LinearGradient
          colors={['rgba(10, 20, 40, 0.98)', 'rgba(15, 60, 90, 0.98)', 'rgba(20, 90, 120, 0.98)']}
          style={StyleSheet.absoluteFill}
        />

        {/* موجات مائية ضبابية */}
        <Animated.View style={[styles.wave, { transform: [{ scale: scale1 }] }]} />
        <Animated.View style={[styles.wave, styles.wave2, { transform: [{ scale: scale2 }] }]} />
        <Animated.View style={[styles.wave, styles.wave3, { transform: [{ scale: scale3 }] }]} />

        {/* فقاعات مائية */}
        <Animated.View style={[styles.bubble, styles.b1, { transform: [{ translateY: float1 }, { rotate: rot }] }]} />
        <Animated.View style={[styles.bubble, styles.b2, { transform: [{ translateY: float2 }, { rotate: rot }] }]} />
        <Animated.View style={[styles.bubble, styles.b3, { transform: [{ translateX: float1 }] }]} />

        <View style={styles.content}>
          <View style={styles.glassCard}>
            <View style={styles.iconWrap}>
              <Ionicons name="moon" size={58} color="#9ff3ff" />
            </View>
            <Txt v="h1" style={styles.title}>أذان</Txt>
            <Txt v="h2" style={styles.sub}>{data?.title || 'حان وقت الصلاة'}</Txt>
            {data?.body ? <Txt v="body" style={styles.body}>{data.body}</Txt> : null}

            <TouchableOpacity activeOpacity={0.8} onPress={async () => { await stopAdhan().catch(() => {}); hide(); }} style={styles.dismissBtn}>
              <LinearGradient
                colors={['rgba(160, 240, 255, 0.9)', 'rgba(90, 200, 255, 0.8)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dismissGradient}
              >
                <Txt v="h2" style={styles.dismissText}>إيقاف</Txt>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  wave: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: 'rgba(110, 220, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(160, 240, 255, 0.25)',
  },
  wave2: {
    width: width * 1.0,
    height: width * 1.0,
    borderRadius: width * 0.5,
    backgroundColor: 'rgba(90, 200, 255, 0.10)',
  },
  wave3: {
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width * 0.55,
    backgroundColor: 'rgba(70, 180, 255, 0.08)',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(180, 245, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(200, 250, 255, 0.35)',
    shadowColor: '#7df3ff',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  b1: { width: 90, height: 90, top: height * 0.18, left: width * 0.12 },
  b2: { width: 120, height: 120, bottom: height * 0.22, right: width * 0.08 },
  b3: { width: 60, height: 60, top: height * 0.28, right: width * 0.22 },
  glassCard: {
    width: width * 0.88,
    maxWidth: 380,
    alignItems: 'center',
    paddingVertical: 42,
    paddingHorizontal: 28,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(200, 250, 255, 0.4)',
    shadowColor: '#7df3ff',
    shadowOpacity: 0.25,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    backdropFilter: Platform.OS === 'web' ? 'blur(18px)' : undefined,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(160, 240, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(190, 250, 255, 0.5)',
    marginBottom: 18,
  },
  title: { color: '#f7feff', fontSize: 42, marginBottom: 6, textAlign: 'center' },
  sub: { color: '#e6fbff', fontSize: 22, textAlign: 'center', marginBottom: 10 },
  body: { color: 'rgba(230, 251, 255, 0.9)', textAlign: 'center', marginBottom: 28 },
  dismissBtn: { width: '100%', borderRadius: 999, overflow: 'hidden' },
  dismissGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  dismissText: { color: '#0b1f2a', fontSize: 20 },
});
