import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { GradientButton } from './GradientButton';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  body?: string;
  ctaLabel?: string;
  onCta?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'sparkles-outline', title, body, ctaLabel, onCta, style }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.root, style]}>
      <View style={[styles.icon, { backgroundColor: theme.colors.brandSoft }]}>
        <Ionicons name={icon} size={32} color={theme.colors.brand} />
      </View>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      {body ? (
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
      ) : null}
      {ctaLabel ? <GradientButton label={ctaLabel} onPress={onCta} style={{ marginTop: 16 }} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  body: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
