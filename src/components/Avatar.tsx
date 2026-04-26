import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  borderColor?: string;
  showStatus?: boolean;
  status?: 'available' | 'busy' | 'away' | 'do-not-disturb' | 'offline';
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  color = '#5B7CFA',
  size = 44,
  style,
  borderColor,
  showStatus = false,
  status = 'available',
}) => {
  const { theme } = useTheme();
  const fontSize = Math.round(size * 0.42);
  const dotSize = Math.max(8, Math.round(size * 0.28));

  const statusColor = {
    available: theme.colors.statusOnline,
    busy: theme.colors.statusBusy,
    away: theme.colors.statusAway,
    'do-not-disturb': theme.colors.statusDnd,
    offline: theme.colors.textTertiary,
  }[status];

  return (
    <View
      style={[
        styles.wrapper,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: borderColor ?? theme.colors.background,
            borderWidth: borderColor ? 2 : 0,
          },
        ]}
      >
        <Text style={[styles.label, { color: '#FFFFFF', fontSize }]}>{initials}</Text>
      </View>
      {showStatus ? (
        <View
          style={[
            styles.statusDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: statusColor,
              borderColor: theme.colors.background,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible',
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});
