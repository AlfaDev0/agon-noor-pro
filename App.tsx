import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Platform, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsProvider, useApp } from './lib/settings';
import { rescheduleAll, notificationsSupported } from './lib/notifications';
import { LockScreen } from './components/LockScreen';
import { PalestineFlag } from './components/PalestineFlag';
import { AlarmProvider } from './lib/alarm';
import AdhanAlarmOverlay from './components/AdhanAlarmOverlay';

import HomeScreen from './screens/HomeScreen';
import PrayerScreen from './screens/PrayerScreen';
import QuranScreen from './screens/QuranScreen';
import SurahScreen from './screens/SurahScreen';
import AzkarScreen from './screens/AzkarScreen';
import AzkarSessionScreen from './screens/AzkarSessionScreen';
import MoreScreen from './screens/MoreScreen';
import TasbeehScreen from './screens/TasbeehScreen';
import QiblaScreen from './screens/QiblaScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import ZakatScreen from './screens/ZakatScreen';
import SettingsScreen from './screens/SettingsScreen';
import LocationScreen from './screens/LocationScreen';
import SecurityScreen from './screens/SecurityScreen';
import ContactScreen from './screens/ContactScreen';
import AboutScreen from './screens/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  const { t, theme } = useApp();
  const insets = useSafeAreaInsets();
  const icon = (name: string): { focused: keyof typeof Ionicons.glyphMap; idle: keyof typeof Ionicons.glyphMap } => {
    switch (name) {
      case 'Home': return { focused: 'home', idle: 'home-outline' };
      case 'Prayer': return { focused: 'time', idle: 'time-outline' };
      case 'Quran': return { focused: 'book', idle: 'book-outline' };
      case 'Azkar': return { focused: 'sunny', idle: 'sunny-outline' };
      default: return { focused: 'grid', idle: 'grid-outline' };
    }
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.sub,
        tabBarStyle: {
          backgroundColor: theme.card, borderTopColor: theme.border, height: 62 + insets.bottom, paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ focused, color }) => (
          <Ionicons name={focused ? icon(route.name).focused : icon(route.name).idle} size={24} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tab_home') }} />
      <Tab.Screen name="Prayer" component={PrayerScreen} options={{ title: t('tab_prayer') }} />
      <Tab.Screen name="Quran" component={QuranScreen} options={{ title: t('tab_quran') }} />
      <Tab.Screen name="Azkar" component={AzkarScreen} options={{ title: t('tab_azkar') }} />
      <Tab.Screen name="More" component={MoreScreen} options={{ title: t('tab_more') }} />
    </Tab.Navigator>
  );
}

function Root() {
  const { s, ready, theme, isRTL } = useApp();
  const [locked, setLocked] = useState(true);
  const pinRef = useRef(s.pin);
  pinRef.current = s.pin;
  const initDone = useRef(false);

  useEffect(() => {
    if (ready && !initDone.current) {
      initDone.current = true;
      setLocked(!!s.pin);
    }
  }, [ready, s.pin]);

  // Re-lock when the app goes to the background.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (st) => {
      if (st !== 'active' && pinRef.current) setLocked(true);
    });
    return () => sub.remove();
  }, []);

  // Keep OS-level scheduled alerts in sync with settings.
  const sig = JSON.stringify([s.notif, s.location, s.method, s.madhab, s.lang]);
  const sigRef = useRef(s);
  sigRef.current = s;
  useEffect(() => {
    if (!ready || !notificationsSupported) return;
    const id = setTimeout(() => { rescheduleAll(sigRef.current).catch(() => {}); }, 1200);
    return () => clearTimeout(id);
  }, [ready, sig]);

  useEffect(() => {
    if (!notificationsSupported) return;
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') rescheduleAll(sigRef.current).catch(() => {});
    });
    return () => sub.remove();
  }, []);

  const navTheme = {
    ...DefaultTheme,
    dark: theme.dark,
    colors: { ...DefaultTheme.colors, background: theme.bg, card: theme.card, text: theme.text, border: theme.border, primary: theme.primary },
  };

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A5C3B', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <PalestineFlag width={96} radius={8} />
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, direction: isRTL ? 'rtl' : 'ltr' }}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme} direction={isRTL ? 'rtl' : 'ltr'}>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: theme.bg } }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Surah" component={SurahScreen} />
          <Stack.Screen name="AzkarSession" component={AzkarSessionScreen} />
          <Stack.Screen name="Tasbeeh" component={TasbeehScreen} />
          <Stack.Screen name="Qibla" component={QiblaScreen} />
          <Stack.Screen name="Calculator" component={CalculatorScreen} />
          <Stack.Screen name="Zakat" component={ZakatScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Location" component={LocationScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Security" component={SecurityScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {locked && s.pin ? (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: theme.bg }}>
          <LockScreen onUnlock={() => setLocked(false)} />
        </View>
      ) : null}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font, Amiri_400Regular, Amiri_700Bold });
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A5C3B', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AlarmProvider>
          <Root />
          <AdhanAlarmOverlay />
        </AlarmProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
