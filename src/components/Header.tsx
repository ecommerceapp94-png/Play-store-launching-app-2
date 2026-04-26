import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { AnimatedPressable } from './AnimatedPressable';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  rightLabel?: string;
  withGradient?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  rightLabel,
  withGradient = false,
  style,
}) => {
  const { theme } = useTheme();
  const Wrapper: React.ComponentType<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = withGradient
    ? ({ children, style: s }) => (
        <LinearGradient
          colors={theme.colors.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s, { paddingBottom: 16 }]}
        >
          {children}
        </LinearGradient>
      )
    : ({ children, style: s }) => <View style={s}>{children}</View>;

  const titleColor = withGradient ? theme.colors.textOnBrand : theme.colors.textPrimary;
  const subtitleColor = withGradient ? 'rgba(255,255,255,0.85)' : theme.colors.textSecondary;
  const iconColor = withGradient ? theme.colors.textOnBrand : theme.colors.textPrimary;

  return (
    <Wrapper style={[styles.root, { backgroundColor: withGradient ? undefined : theme.colors.background }, style]}>
      <View style={styles.row}>
        {onBack ? (
          <AnimatedPressable
            onPress={onBack}
            hapticStyle="light"
            scale={0.92}
            containerStyle={[styles.iconButton, { backgroundColor: withGradient ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceMuted }]}
          >
            <Ionicons name="chevron-back" size={22} color={iconColor} />
          </AnimatedPressable>
        ) : (
          <View style={styles.iconButton} />
        )}
        <View style={styles.titleBlock}>
          <Text numberOfLines={1} style={[styles.title, { color: titleColor }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={[styles.subtitle, { color: subtitleColor }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightIcon || rightLabel ? (
          <AnimatedPressable
            onPress={onRightPress}
            hapticStyle="light"
            scale={0.92}
            containerStyle={[styles.iconButton, { backgroundColor: withGradient ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceMuted, paddingHorizontal: rightLabel ? 12 : 0, width: rightLabel ? undefined : 38 }]}
          >
            {rightIcon ? <Ionicons name={rightIcon} size={20} color={iconColor} /> : null}
            {rightLabel ? <Text style={{ color: iconColor, fontWeight: '600', marginLeft: rightIcon ? 6 : 0 }}>{rightLabel}</Text> : null}
          </AnimatedPressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
});
