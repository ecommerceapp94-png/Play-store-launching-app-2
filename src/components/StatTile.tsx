import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { AnimatedPressable } from './AnimatedPressable';

export interface StatTileProps {
  label: string;
  value: string;
  caption?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  gradient?: [string, string, string];
  onPress?: () => void;
}

export const StatTile: React.FC<StatTileProps> = ({ label, value, caption, icon, gradient, onPress }) => {
  const { theme } = useTheme();
  const colors = gradient ?? theme.colors.brandGradient;

  const inner = (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.tile}
    >
      <View style={styles.row}>
        {icon ? (
          <View style={styles.iconBubble}>
            <Ionicons name={icon} size={18} color="#FFFFFF" />
          </View>
        ) : null}
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </LinearGradient>
  );

  return onPress ? (
    <AnimatedPressable onPress={onPress} hapticStyle="light" scale={0.97}>
      {inner}
    </AnimatedPressable>
  ) : (
    inner
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: 22,
    padding: 16,
    minHeight: 110,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  value: {
    marginTop: 16,
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  caption: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
});
