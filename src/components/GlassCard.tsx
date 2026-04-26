import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme/ThemeProvider';

export interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
  tint?: 'default' | 'light' | 'dark';
}

/**
 * Frosted glass card used across the app for premium-feeling overlays.
 * Falls back to a tinted view when BlurView is unsupported.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 40,
  borderRadius = 20,
  tint,
}) => {
  const { theme } = useTheme();
  const blurTint = tint ?? (theme.isDark ? 'dark' : 'light');
  return (
    <View
      style={[
        styles.shadow,
        { borderRadius, shadowColor: theme.colors.shadowColor },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={blurTint}
        style={[
          styles.blur,
          {
            borderRadius,
            backgroundColor: theme.colors.glassBackground,
            borderColor: theme.colors.glassStroke,
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  blur: {
    overflow: 'hidden',
    borderWidth: 1,
  },
});
