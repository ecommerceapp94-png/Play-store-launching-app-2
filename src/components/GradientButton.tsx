import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from './AnimatedPressable';
import { useTheme } from '@/theme/ThemeProvider';

export interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  full?: boolean;
  style?: StyleProp<ViewStyle>;
  hapticStyle?: 'light' | 'medium' | 'heavy';
}

const SIZE_HEIGHT: Record<NonNullable<GradientButtonProps['size']>, number> = {
  sm: 36,
  md: 44,
  lg: 52,
  xl: 60,
};

const SIZE_RADIUS: Record<NonNullable<GradientButtonProps['size']>, number> = {
  sm: 12,
  md: 16,
  lg: 18,
  xl: 22,
};

const SIZE_FONT: Record<NonNullable<GradientButtonProps['size']>, number> = {
  sm: 13,
  md: 15,
  lg: 16,
  xl: 18,
};

export const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  onPress,
  icon,
  trailingIcon,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  full = false,
  style,
  hapticStyle = 'medium',
}) => {
  const { theme } = useTheme();

  const gradientForVariant = (): [string, string, string] => {
    const c = theme.colors;
    switch (variant) {
      case 'secondary':
        return [c.surfaceMuted, c.surfaceTinted, c.surfaceMuted];
      case 'ghost':
        return ['transparent', 'transparent', 'transparent'];
      case 'danger':
        return [c.danger, c.danger, c.warning];
      case 'success':
        return [c.success, c.success, c.info];
      case 'primary':
      default:
        return c.brandGradient;
    }
  };

  const labelColor = (() => {
    const c = theme.colors;
    if (variant === 'ghost') return c.textPrimary;
    if (variant === 'secondary') return c.textPrimary;
    return c.textOnBrand;
  })();

  return (
    <AnimatedPressable
      onPress={loading || disabled ? undefined : onPress}
      hapticStyle={hapticStyle}
      disabled={disabled}
      containerStyle={[
        full ? styles.full : undefined,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientForVariant()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          {
            height: SIZE_HEIGHT[size],
            borderRadius: SIZE_RADIUS[size],
            borderColor: variant === 'ghost' ? theme.colors.border : 'transparent',
            borderWidth: variant === 'ghost' ? 1 : 0,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={labelColor} />
        ) : (
          <View style={styles.content}>
            {icon ? (
              <Ionicons
                name={icon}
                size={SIZE_FONT[size] + 4}
                color={labelColor}
                style={{ marginRight: 8 }}
              />
            ) : null}
            <Text
              style={{
                color: labelColor,
                fontSize: SIZE_FONT[size],
                fontWeight: '700',
                letterSpacing: 0.2,
              }}
            >
              {label}
            </Text>
            {trailingIcon ? (
              <Ionicons
                name={trailingIcon}
                size={SIZE_FONT[size] + 4}
                color={labelColor}
                style={{ marginLeft: 8 }}
              />
            ) : null}
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  full: { alignSelf: 'stretch' },
  button: {
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
