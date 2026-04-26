import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { AnimatedPressable } from './AnimatedPressable';

export interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  destructive?: boolean;
  onPress: () => void;
}

export interface QuickActionSheetHandle {
  open: () => void;
  close: () => void;
}

interface Props {
  title?: string;
  actions: QuickAction[];
}

export const QuickActionSheet = forwardRef<QuickActionSheetHandle, Props>(({ title, actions }, ref) => {
  const sheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.expand(),
    close: () => sheetRef.current?.close(),
  }));

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['55%']}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.colors.cardElevated, borderRadius: 32 }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border, width: 56 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
      )}
    >
      <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
        {title ? (
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
        ) : null}
        {actions.map((a) => (
          <AnimatedPressable
            key={a.id}
            onPress={() => {
              sheetRef.current?.close();
              setTimeout(a.onPress, 60);
            }}
            hapticStyle={a.destructive ? 'heavy' : 'light'}
            scale={0.97}
            containerStyle={[
              styles.row,
              {
                backgroundColor: theme.colors.surfaceMuted,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.iconBubble,
                { backgroundColor: (a.color ?? (a.destructive ? theme.colors.danger : theme.colors.brand)) + '22' },
              ]}
            >
              <Ionicons
                name={a.icon}
                size={20}
                color={a.color ?? (a.destructive ? theme.colors.danger : theme.colors.brand)}
              />
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: a.destructive ? theme.colors.danger : theme.colors.textPrimary,
                },
              ]}
            >
              {a.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
          </AnimatedPressable>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
});

QuickActionSheet.displayName = 'QuickActionSheet';

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '800',
    paddingTop: 8,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 6,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
});
