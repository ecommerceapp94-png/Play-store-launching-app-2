import React from 'react';
import { Text, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { AnimatedPressable } from './AnimatedPressable';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  caption?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  leadingColor?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
  hapticStyle?: 'light' | 'medium' | 'heavy';
}

export const ListRow: React.FC<ListRowProps> = ({
  title,
  subtitle,
  caption,
  leadingIcon,
  leadingColor,
  leading,
  trailing,
  onPress,
  showChevron = true,
  style,
  hapticStyle = 'light',
}) => {
  const { theme } = useTheme();

  const content = (
    <View style={[styles.row, style]}>
      {leading ?? (leadingIcon ? (
        <View
          style={[
            styles.iconBubble,
            { backgroundColor: (leadingColor ?? theme.colors.brand) + '22' },
          ]}
        >
          <Ionicons name={leadingIcon} size={20} color={leadingColor ?? theme.colors.brand} />
        </View>
      ) : null)}
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
        ) : null}
        {caption ? (
          <Text style={[styles.caption, { color: theme.colors.textTertiary }]}>{caption}</Text>
        ) : null}
      </View>
      {trailing ?? (showChevron ? (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
      ) : null)}
    </View>
  );

  if (!onPress) return content;
  return (
    <AnimatedPressable onPress={onPress} hapticStyle={hapticStyle} scale={0.98}>
      {content}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  body: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
  caption: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '500',
  },
});
