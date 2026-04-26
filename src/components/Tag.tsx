import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface TagProps {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  outline?: boolean;
}

export const Tag: React.FC<TagProps> = ({ label, tone = 'default', outline = false }) => {
  const { theme } = useTheme();
  const palette = theme.colors;

  const map: Record<NonNullable<TagProps['tone']>, { bg: string; fg: string; border: string }> = {
    default: {
      bg: palette.surfaceMuted,
      fg: palette.textSecondary,
      border: palette.border,
    },
    success: { bg: palette.successBg, fg: palette.success, border: palette.success },
    warning: { bg: palette.warningBg, fg: palette.warning, border: palette.warning },
    danger: { bg: palette.dangerBg, fg: palette.danger, border: palette.danger },
    info: { bg: palette.infoBg, fg: palette.info, border: palette.info },
    brand: { bg: palette.brandSoft, fg: palette.brandStrong, border: palette.brand },
  };
  const c = map[tone];

  return (
    <View
      style={[
        styles.tag,
        outline
          ? { borderColor: c.border, backgroundColor: 'transparent', borderWidth: 1 }
          : { backgroundColor: c.bg },
      ]}
    >
      <Text style={[styles.label, { color: c.fg }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
