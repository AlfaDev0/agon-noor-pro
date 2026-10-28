export type ThemeId = 'green' | 'blue' | 'gold' | 'dark' | 'light';

export interface Theme {
  id: ThemeId;
  dark: boolean;
  bg: string;
  card: string;
  card2: string;
  text: string;
  sub: string;
  primary: string;
  primaryDark: string;
  onPrimary: string;
  accent: string;
  border: string;
  danger: string;
  success: string;
  grad: [string, string];
}

export const THEMES: Record<ThemeId, Theme> = {
  green: {
    id: 'green', dark: false, bg: '#F1F7F3', card: '#FFFFFF', card2: '#E5F1EA', text: '#10261B', sub: '#5C7367',
    primary: '#0F7B4F', primaryDark: '#0A5C3B', onPrimary: '#FFFFFF', accent: '#D4AF37', border: '#D6E6DC',
    danger: '#C62828', success: '#16A34A', grad: ['#0F7B4F', '#064A30'],
  },
  blue: {
    id: 'blue', dark: false, bg: '#F0F4FC', card: '#FFFFFF', card2: '#E2EAFA', text: '#0F1B3D', sub: '#5A6A8F',
    primary: '#1D4ED8', primaryDark: '#1E3A8A', onPrimary: '#FFFFFF', accent: '#F5B942', border: '#D4DEF3',
    danger: '#C62828', success: '#16A34A', grad: ['#2457E6', '#14246B'],
  },
  gold: {
    id: 'gold', dark: false, bg: '#FBF6E9', card: '#FFFDF7', card2: '#F5EAC9', text: '#2B2108', sub: '#7D6B3C',
    primary: '#B5830B', primaryDark: '#85600A', onPrimary: '#FFFFFF', accent: '#0F7B4F', border: '#EBDDB1',
    danger: '#C62828', success: '#16A34A', grad: ['#D4A21A', '#7A5608'],
  },
  dark: {
    id: 'dark', dark: true, bg: '#09100D', card: '#121C18', card2: '#1A2823', text: '#E9F2EE', sub: '#8CA399',
    primary: '#2FBF85', primaryDark: '#1E8F63', onPrimary: '#04140D', accent: '#E0B84F', border: '#22332C',
    danger: '#F0625D', success: '#34D399', grad: ['#126B4B', '#0A3A2A'],
  },
  light: {
    id: 'light', dark: false, bg: '#F6F7F9', card: '#FFFFFF', card2: '#EDF0F4', text: '#18202B', sub: '#677386',
    primary: '#0E7490', primaryDark: '#0B566B', onPrimary: '#FFFFFF', accent: '#E08A00', border: '#E1E5EB',
    danger: '#C62828', success: '#16A34A', grad: ['#1394B5', '#0B566B'],
  },
};

export const THEME_ORDER: ThemeId[] = ['green', 'blue', 'gold', 'dark', 'light'];
