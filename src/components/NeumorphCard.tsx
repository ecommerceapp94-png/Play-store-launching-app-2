import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface NeumorphCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  inset?: boolean;
}

/**
 * Soft neumorphic surface – simulates the dual highlight/shadow look used in
 * many screens (cards, KPI tiles, controls). It works in both themes by
 * reading the neumorph palette from the theme provider.
 */
export const NeumorphCard: React.FC<NeumorphCardProps> = ({ children, style, borderRadius = 22, inset = false }) => {
  const { theme } = useTheme();
  const { neumorphLight, neumorphDark, neumorphBase } = theme.colors;

  return (
    <View style={[styles.outer, { borderRadius }, style]}>
      <View
        style={[
          styles.shadowDark,
          {
            borderRadius,
            shadowColor: neumorphDark,
            backgroundColor: neumorphBase,
          },
        ]}
      >
        <View
          style={[
            styles.shadowLight,
            {
              borderRadius,
              shadowColor: neumorphLight,
              backgroundColor: neumorphBase,
            },
          ]}
        >
          <View
            style={[
              styles.inner,
              {
                borderRadius,
                backgroundColor: inset ? neumorphBase : neumorphBase,
              },
            ]}
          >
            {children}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    overflow: 'visible',
  },
  shadowDark: {
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 6,
  },
  shadowLight: {
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  inner: {
    overflow: 'hidden',
  },
});
