// Theme system for MeetX Ultra Pro.
// Provides a comprehensive color/typography/spacing system used throughout
// every screen in the app. Light & dark palettes are exhaustively specified
// so screens can compose glassmorphism, neumorphism and gradient surfaces.

import type { TextStyle } from 'react-native';

export type ThemeName = 'light' | 'dark';

export interface ColorPalette {
  // Brand
  brand: string;
  brandSoft: string;
  brandStrong: string;
  brandGradient: [string, string, string];

  // Surfaces
  background: string;
  backgroundElevated: string;
  card: string;
  cardElevated: string;
  surfaceMuted: string;
  surfaceTinted: string;
  glassBackground: string;
  glassStroke: string;
  neumorphLight: string;
  neumorphDark: string;
  neumorphBase: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textOnBrand: string;
  textInverse: string;
  textDisabled: string;

  // Lines/Strokes
  border: string;
  borderStrong: string;
  divider: string;

  // States
  success: string;
  warning: string;
  danger: string;
  info: string;
  successBg: string;
  warningBg: string;
  dangerBg: string;
  infoBg: string;

  // Tab/badge accents
  tabActive: string;
  tabInactive: string;
  badgeBg: string;
  badgeText: string;

  // Gradient stops used on hero cards
  heroGradient: [string, string, string];
  joinGradient: [string, string, string];
  createGradient: [string, string, string];
  scheduleGradient: [string, string, string];
  contactsGradient: [string, string, string];
  recordingGradient: [string, string, string];
  aiGradient: [string, string, string];
  premiumGradient: [string, string, string];

  // Avatar palette - 16 candidate colors used to color initials
  avatarPalette: string[];

  // Status pill colors
  statusOnline: string;
  statusBusy: string;
  statusAway: string;
  statusDnd: string;

  // Shadows
  shadowColor: string;
}

export interface Theme {
  name: ThemeName;
  isDark: boolean;
  colors: ColorPalette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadow: typeof shadow;
  motion: typeof motion;
}

export const spacing = {
  zero: 0,
  hair: 1,
  xxxs: 2,
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  jumbo: 40,
  mega: 56,
  giant: 72,
  ultra: 96,
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  pill: 999,
  bubble: 28,
} as const;

export const typography = {
  displayHuge: { fontSize: 48, lineHeight: 56, fontWeight: '800' } as TextStyle,
  displayLarge: { fontSize: 36, lineHeight: 44, fontWeight: '800' } as TextStyle,
  display: { fontSize: 30, lineHeight: 38, fontWeight: '700' } as TextStyle,
  titleLarge: { fontSize: 26, lineHeight: 34, fontWeight: '700' } as TextStyle,
  title: { fontSize: 22, lineHeight: 30, fontWeight: '700' } as TextStyle,
  titleSmall: { fontSize: 18, lineHeight: 26, fontWeight: '700' } as TextStyle,
  headline: { fontSize: 17, lineHeight: 24, fontWeight: '600' } as TextStyle,
  body: { fontSize: 15, lineHeight: 22, fontWeight: '500' } as TextStyle,
  bodyMuted: { fontSize: 15, lineHeight: 22, fontWeight: '400' } as TextStyle,
  callout: { fontSize: 14, lineHeight: 20, fontWeight: '600' } as TextStyle,
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' } as TextStyle,
  micro: { fontSize: 10, lineHeight: 14, fontWeight: '600' } as TextStyle,
  button: { fontSize: 15, lineHeight: 20, fontWeight: '700' } as TextStyle,
  buttonSmall: { fontSize: 13, lineHeight: 18, fontWeight: '700' } as TextStyle,
  mono: { fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 1.2 } as TextStyle,
};

export const shadow = {
  none: { shadowOpacity: 0, elevation: 0 },
  xs: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  lg: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 14,
  },
  xl: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.24,
    shadowRadius: 36,
    elevation: 20,
  },
};

export const motion = {
  fast: 160,
  base: 240,
  slow: 360,
  spring: { damping: 14, stiffness: 180, mass: 0.6 },
  springSoft: { damping: 18, stiffness: 120, mass: 0.8 },
  springSnappy: { damping: 11, stiffness: 220, mass: 0.5 },
  pressScale: 0.96,
  pressDeepScale: 0.92,
};

const avatarPalette = [
  '#5B8DEF', '#9C6BFF', '#FF7A59', '#FFB14C', '#3DD598', '#3CB6F4', '#F25C7C',
  '#7B61FF', '#0EA5E9', '#22C55E', '#FACC15', '#EC4899', '#14B8A6', '#F97316',
  '#A855F7', '#EF4444',
];

export const lightPalette: ColorPalette = {
  brand: '#5B7CFA',
  brandSoft: '#E3EAFF',
  brandStrong: '#3B5BD9',
  brandGradient: ['#5B7CFA', '#9C6BFF', '#FF7A59'],

  background: '#F4F6FB',
  backgroundElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  surfaceMuted: '#EEF1F7',
  surfaceTinted: '#F8F4FF',
  glassBackground: 'rgba(255,255,255,0.55)',
  glassStroke: 'rgba(255,255,255,0.7)',
  neumorphLight: '#FFFFFF',
  neumorphDark: '#D8DEEA',
  neumorphBase: '#EEF1F7',

  textPrimary: '#0E1424',
  textSecondary: '#4B5468',
  textTertiary: '#8A93A6',
  textOnBrand: '#FFFFFF',
  textInverse: '#FFFFFF',
  textDisabled: '#B8BFCD',

  border: '#E1E5EE',
  borderStrong: '#C9D0DC',
  divider: '#EDEFF5',

  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  successBg: '#E7F8F1',
  warningBg: '#FEF3E0',
  dangerBg: '#FDECEC',
  infoBg: '#E5EFFF',

  tabActive: '#5B7CFA',
  tabInactive: '#8A93A6',
  badgeBg: '#FF4D6D',
  badgeText: '#FFFFFF',

  heroGradient: ['#5B7CFA', '#9C6BFF', '#FF7A59'],
  joinGradient: ['#3DD598', '#0EA5E9', '#5B7CFA'],
  createGradient: ['#9C6BFF', '#5B7CFA', '#3CB6F4'],
  scheduleGradient: ['#FF7A59', '#F25C7C', '#9C6BFF'],
  contactsGradient: ['#3CB6F4', '#5B7CFA', '#9C6BFF'],
  recordingGradient: ['#F25C7C', '#FF7A59', '#FFB14C'],
  aiGradient: ['#0EA5E9', '#9C6BFF', '#F25C7C'],
  premiumGradient: ['#0F172A', '#5B7CFA', '#9C6BFF'],

  avatarPalette,

  statusOnline: '#22C55E',
  statusBusy: '#F59E0B',
  statusAway: '#94A3B8',
  statusDnd: '#EF4444',

  shadowColor: '#0E1424',
};

export const darkPalette: ColorPalette = {
  brand: '#7C9BFF',
  brandSoft: '#1F2746',
  brandStrong: '#A4B6FF',
  brandGradient: ['#7C9BFF', '#B689FF', '#FF8E70'],

  background: '#070B16',
  backgroundElevated: '#0F1424',
  card: '#121829',
  cardElevated: '#1A2238',
  surfaceMuted: '#161D31',
  surfaceTinted: '#1A1830',
  glassBackground: 'rgba(20,28,48,0.55)',
  glassStroke: 'rgba(255,255,255,0.08)',
  neumorphLight: '#1A2238',
  neumorphDark: '#070B16',
  neumorphBase: '#121829',

  textPrimary: '#F6F8FE',
  textSecondary: '#B7BFD2',
  textTertiary: '#8089A0',
  textOnBrand: '#0E1424',
  textInverse: '#0E1424',
  textDisabled: '#525B70',

  border: '#22293D',
  borderStrong: '#2D3552',
  divider: '#1A2238',

  success: '#22C55E',
  warning: '#FBBF24',
  danger: '#FB7185',
  info: '#60A5FA',
  successBg: 'rgba(34,197,94,0.12)',
  warningBg: 'rgba(251,191,36,0.12)',
  dangerBg: 'rgba(251,113,133,0.12)',
  infoBg: 'rgba(96,165,250,0.12)',

  tabActive: '#A4B6FF',
  tabInactive: '#5C6680',
  badgeBg: '#FB7185',
  badgeText: '#0E1424',

  heroGradient: ['#7C9BFF', '#B689FF', '#FF8E70'],
  joinGradient: ['#22C55E', '#0EA5E9', '#7C9BFF'],
  createGradient: ['#B689FF', '#7C9BFF', '#60A5FA'],
  scheduleGradient: ['#FF8E70', '#FB7185', '#B689FF'],
  contactsGradient: ['#60A5FA', '#7C9BFF', '#B689FF'],
  recordingGradient: ['#FB7185', '#FF8E70', '#FBBF24'],
  aiGradient: ['#0EA5E9', '#B689FF', '#FB7185'],
  premiumGradient: ['#000000', '#1F2746', '#5B7CFA'],

  avatarPalette,

  statusOnline: '#22C55E',
  statusBusy: '#FBBF24',
  statusAway: '#94A3B8',
  statusDnd: '#FB7185',

  shadowColor: '#000000',
};

export const lightTheme: Theme = {
  name: 'light',
  isDark: false,
  colors: lightPalette,
  spacing,
  radius,
  typography,
  shadow,
  motion,
};

export const darkTheme: Theme = {
  name: 'dark',
  isDark: true,
  colors: darkPalette,
  spacing,
  radius,
  typography,
  shadow,
  motion,
};

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

export type AppSpacing = keyof typeof spacing;
export type AppRadius = keyof typeof radius;
