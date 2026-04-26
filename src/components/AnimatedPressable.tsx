import React, { useCallback } from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useHaptics } from '@/hooks/useHaptics';

const AnimatedNative = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends PressableProps {
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid' | 'select' | 'none';
  scale?: number;
  containerStyle?: StyleProp<ViewStyle>;
  rippleColor?: string;
  fadeOnPress?: boolean;
}

/**
 * AnimatedPressable wraps Reanimated press feedback (scale + fade) with optional
 * haptics. Used as the foundation for every interactive surface in the app.
 */
export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  hapticStyle = 'light',
  scale = 0.96,
  containerStyle,
  fadeOnPress = false,
  style,
  ...rest
}) => {
  const pressed = useSharedValue(0);
  const { impact, select } = useHaptics();

  const triggerHaptic = useCallback(() => {
    if (disabled) return;
    if (hapticStyle === 'none') return;
    if (hapticStyle === 'select') {
      select();
    } else {
      impact(hapticStyle);
    }
  }, [disabled, hapticStyle, impact, select]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(1 - pressed.value * (1 - scale), {
          damping: 14,
          stiffness: 220,
          mass: 0.5,
        }),
      },
    ],
    opacity: fadeOnPress ? withTiming(1 - pressed.value * 0.25, { duration: 120 }) : 1,
  }));

  return (
    <AnimatedNative
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        pressed.value = 1;
        triggerHaptic();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = 0;
        onPressOut?.(e);
      }}
      onPress={onPress}
      style={[containerStyle, animatedStyle, style as ViewStyle]}
    >
      {children}
    </AnimatedNative>
  );
};
