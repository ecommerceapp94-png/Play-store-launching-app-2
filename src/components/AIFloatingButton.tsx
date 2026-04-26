import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAIAssistant } from './AIAssistant';
import { AnimatedPressable } from './AnimatedPressable';
import { useTheme } from '@/theme/ThemeProvider';

const SIZE = 58;

export const AIFloatingButton: React.FC<{ bottomOffset?: number }> = ({ bottomOffset = 80 }) => {
  const { open } = useAIAssistant();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <AnimatedPressable
      onPress={open}
      hapticStyle="medium"
      containerStyle={[
        styles.wrap,
        animatedStyle,
        { right: 18, bottom: bottomOffset + insets.bottom, shadowColor: theme.colors.shadowColor },
      ]}
    >
      <LinearGradient
        colors={theme.colors.aiGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Ionicons name="sparkles" size={24} color="#FFFFFF" />
      </LinearGradient>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 14,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
