import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}) => {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderRadius: radius,
          width,
          height,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

interface BlockProps {
  lines?: number;
  spacing?: number;
}

export const SkeletonLines: React.FC<BlockProps> = ({ lines = 3, spacing = 8 }) => {
  const out: React.ReactElement[] = [];
  for (let i = 0; i < lines; i += 1) {
    out.push(
      <View key={i} style={{ marginTop: i === 0 ? 0 : spacing }}>
        <Skeleton width={i === lines - 1 ? '60%' : '100%'} height={12} />
      </View>
    );
  }
  return <View>{out}</View>;
};

export const SkeletonCard: React.FC<{ height?: number }> = ({ height = 96 }) => {
  return (
    <View style={styles.card}>
      <Skeleton width={56} height={56} radius={28} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Skeleton width={'70%'} height={14} />
        <View style={{ height: 8 }} />
        <Skeleton width={'90%'} height={10} />
        <View style={{ height: 6 }} />
        <Skeleton width={'50%'} height={10} />
      </View>
      <Skeleton width={20} height={height - 60} radius={6} />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
