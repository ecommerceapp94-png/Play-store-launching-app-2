import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { AppStoreProvider } from '@/store/AppStore';
import { AIAssistantProvider } from '@/components/AIAssistant';
import RootNavigator from '@/navigation/RootNavigator';

const NavigationShell: React.FC = () => {
  const { theme, resolvedName } = useTheme();
  const navTheme = {
    ...(resolvedName === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(resolvedName === 'dark' ? DarkTheme : DefaultTheme).colors,
      background: theme.colors.background,
      card: theme.colors.cardElevated,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      primary: theme.colors.brand,
      notification: theme.colors.brand,
    },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
      <StatusBar style={resolvedName === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppStoreProvider>
            <BottomSheetModalProvider>
              <AIAssistantProvider>
                <NavigationShell />
              </AIAssistantProvider>
            </BottomSheetModalProvider>
          </AppStoreProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
