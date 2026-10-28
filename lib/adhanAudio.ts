import { Platform } from 'react-native';
import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;
let playing = false;

export async function playAdhan() {
  try {
    if (Platform.OS === 'web') {
      // ويب: نحاول نشغل صوت باستخدام Audio API لو موجود
      try {
        const a = new (window as any).Audio('https://www.islamcan.com/audio/adhan/azan1.mp3');
        a.volume = 1.0;
        a.loop = true;
        (a as any).play().catch(() => {});
        (global as any).__ADHAN_AUDIO__ = a;
        playing = true;
        return;
      } catch (e) {}
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    if (sound) {
      await sound.stopAsync().catch(() => {});
      await sound.unloadAsync().catch(() => {});
    }
    const { sound: s } = await Audio.Sound.createAsync(
      { uri: 'https://www.islamcan.com/audio/adhan/azan1.mp3' },
      { shouldPlay: true, isLooping: true, volume: 1.0 },
    );
    sound = s;
    playing = true;
  } catch (e) {
    // لو مفيش إنترنت أو خطأ، نكمل بدون صوت
  }
}

export async function stopAdhan() {
  try {
    if (Platform.OS === 'web') {
      const a = (global as any).__ADHAN_AUDIO__;
      if (a) {
        try { a.pause(); a.currentTime = 0; } catch (e) {}
        (global as any).__ADHAN_AUDIO__ = null;
      }
      playing = false;
      return;
    }
    if (sound) {
      await sound.stopAsync().catch(() => {});
      await sound.unloadAsync().catch(() => {});
      sound = null;
    }
    playing = false;
  } catch (e) {
    playing = false;
  }
}

export function isPlaying() {
  return playing;
}
