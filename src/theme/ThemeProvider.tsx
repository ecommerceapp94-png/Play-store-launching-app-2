import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, ColorSchemeName, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, Theme, ThemeName } from './index';
import type { ThemeMode } from '@/types';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  resolvedName: ThemeName;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const STORAGE_KEY = '@meetx/theme-mode';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolve(mode: ThemeMode, system: ColorSchemeName): ThemeName {
  if (mode === 'system') {
    return system === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

interface ProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      })
      .catch(() => {
        /* ignore - default to system */
      });
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      /* swallow - we'll fall back to memory */
    });
  }, []);

  const resolvedName = resolve(mode, systemScheme);
  const theme = resolvedName === 'dark' ? darkTheme : lightTheme;

  const toggle = useCallback(() => {
    setMode(resolvedName === 'dark' ? 'light' : 'dark');
  }, [resolvedName, setMode]);

  useEffect(() => {
    StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content', true);
  }, [theme.isDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, mode, resolvedName, setMode, toggle }),
    [theme, mode, resolvedName, setMode, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};

export const useColors = () => useTheme().theme.colors;
