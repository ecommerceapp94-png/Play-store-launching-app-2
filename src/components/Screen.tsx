import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, StyleProp, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

export interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  bottomPadding?: number;
  bg?: 'default' | 'elevated' | 'tinted' | 'muted';
}

/**
 * Screen wraps every page-level container in the app. It provides
 * - safe-area aware top/bottom padding
 * - optional pull-to-refresh
 * - theme-aware background tints
 */
export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = true,
  refreshing,
  onRefresh,
  style,
  contentStyle,
  bottomPadding = 96,
  bg = 'default',
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const background = (() => {
    switch (bg) {
      case 'elevated':
        return theme.colors.backgroundElevated;
      case 'tinted':
        return theme.colors.surfaceTinted;
      case 'muted':
        return theme.colors.surfaceMuted;
      default:
        return theme.colors.background;
    }
  })();

  if (!scroll) {
    return (
      <View
        style={[
          styles.flex,
          { backgroundColor: background, paddingBottom: insets.bottom },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: background }, style]}
      contentContainerStyle={[
        { paddingBottom: bottomPadding + insets.bottom, paddingTop: 0 },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh != null ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand}
            colors={[theme.colors.brand]}
            progressBackgroundColor={theme.colors.cardElevated}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
