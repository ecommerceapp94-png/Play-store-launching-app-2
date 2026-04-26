import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'tinted' | 'outlined';
  radius?: number;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  radius = 18,
  padding = 16,
}) => {
  const { theme } = useTheme();
  const c = theme.colors;

  const palette = (() => {
    switch (variant) {
      case 'elevated':
        return { bg: c.cardElevated, border: 'transparent', shadow: 0.18 };
      case 'tinted':
        return { bg: c.surfaceTinted, border: 'transparent', shadow: 0.04 };
      case 'outlined':
        return { bg: 'transparent', border: c.border, shadow: 0 };
      default:
        return { bg: c.card, border: 'transparent', shadow: 0.08 };
    }
  })();

  return (
    <View
      style={[
        {
          backgroundColor: palette.bg,
          borderRadius: radius,
          padding,
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: palette.border,
          shadowColor: c.shadowColor,
          shadowOpacity: palette.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 18,
          elevation: variant === 'elevated' ? 8 : 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const Divider: React.FC<{ inset?: number }> = ({ inset = 0 }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: theme.colors.divider, marginLeft: inset, marginRight: inset },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth * 2,
    marginVertical: 4,
  },
});
