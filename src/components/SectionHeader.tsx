import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { AnimatedPressable } from './AnimatedPressable';

export interface SectionHeaderProps {
  title: string;
  caption?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, caption, actionLabel, onAction, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, style]}>
      <View style={styles.titles}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
        {caption ? (
          <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>{caption}</Text>
        ) : null}
      </View>
      {actionLabel ? (
        <AnimatedPressable onPress={onAction} hapticStyle="light" scale={0.94}>
          <Text style={[styles.action, { color: theme.colors.brand }]}>{actionLabel}</Text>
        </AnimatedPressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  titles: { flex: 1 },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  caption: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
  action: {
    fontSize: 13,
    fontWeight: '700',
  },
});
