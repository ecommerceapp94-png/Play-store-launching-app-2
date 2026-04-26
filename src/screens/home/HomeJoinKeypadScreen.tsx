import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { GradientButton } from '@/components/GradientButton';
import { GlassCard } from '@/components/GlassCard';
import { NeumorphCard } from '@/components/NeumorphCard';
import { ListRow } from '@/components/ListRow';
import { Card } from '@/components/Card';
import { AnimatedPressable } from '@/components/AnimatedPressable';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store/AppStore';
import { useHaptics } from '@/hooks/useHaptics';
import { formatRoomCode } from '@/utils/format';
import type { HomeStackParamList } from '@/types';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

const KEYS: Array<string | { icon: 'backspace-outline'; key: 'BACK' }> = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '*', '0', { icon: 'backspace-outline', key: 'BACK' },
];

export default function HomeJoinKeypadScreen() {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();
  const { state } = useAppStore();
  const { impact, notify, select } = useHaptics();

  const [code, setCode] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const shake = useSharedValue(0);

  const compact = useMemo(() => code.replace(/[^0-9*]/g, ''), [code]);
  const isValid = compact.length === 9;

  const onPressKey = useCallback(
    (raw: string) => {
      select();
      if (raw === 'BACK') {
        setCode((c) => c.slice(0, -1));
        return;
      }
      setCode((c) => (c.length >= 9 ? c : c + raw));
    },
    [select]
  );

  const onJoin = useCallback(() => {
    if (!isValid) {
      notify('error');
      shake.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
      setShakeKey((s) => s + 1);
      return;
    }
    impact('medium');
    navigation.navigate('HomeMeetingControlsPreview', {
      code: formatRoomCode(compact),
    });
  }, [isValid, notify, shake, impact, navigation, compact]);

  const animatedShake = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  return (
    <Screen scroll={false} bg="default">
      <Header
        title="Join meeting"
        subtitle="Enter the 9-digit room code"
        onBack={() => navigation.goBack()}
        rightIcon="qr-code"
        onRightPress={() => navigation.navigate('HomeQuickJoinDetail', { code: 'qr-scan' })}
      />

      <Animated.View style={[styles.codeWrapper, animatedShake]} key={shakeKey}>
        <Card variant="elevated" radius={22} padding={20}>
          <Text style={[styles.codeLabel, { color: theme.colors.textSecondary }]}>ROOM CODE</Text>
          <View style={styles.codeRow}>
            {Array.from({ length: 9 }).map((_, idx) => {
              const ch = compact[idx] ?? '';
              const filled = !!ch;
              return (
                <View
                  key={idx}
                  style={[
                    styles.codeBox,
                    {
                      borderColor: filled ? theme.colors.brand : theme.colors.border,
                      backgroundColor: filled
                        ? theme.colors.brandSoft
                        : theme.colors.surfaceMuted,
                    },
                  ]}
                >
                  <Text style={[styles.codeChar, { color: theme.colors.textPrimary }]}>{ch}</Text>
                </View>
              );
            })}
          </View>
          <Text
            style={{
              marginTop: 12,
              color: theme.colors.textTertiary,
              fontSize: 12,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {isValid ? 'Looks good! Tap join to continue.' : 'We auto-format your code into 3-3-3.'}
          </Text>
        </Card>
      </Animated.View>

      <View style={styles.keypad}>
        {KEYS.map((k, i) => {
          const isSpecial = typeof k === 'object';
          const label = isSpecial ? '' : (k as string);
          return (
            <AnimatedPressable
              key={i}
              onPress={() => onPressKey(isSpecial ? 'BACK' : (k as string))}
              hapticStyle="light"
              scale={0.92}
              containerStyle={styles.keyWrap}
            >
              <NeumorphCard borderRadius={28}>
                <View style={styles.keyInner}>
                  {isSpecial ? (
                    <Ionicons name={(k as { icon: 'backspace-outline' }).icon} size={22} color={theme.colors.textPrimary} />
                  ) : (
                    <Text style={[styles.keyLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
                  )}
                </View>
              </NeumorphCard>
            </AnimatedPressable>
          );
        })}
      </View>

      <View style={styles.actionsRow}>
        <GradientButton
          label="Paste from clipboard"
          icon="clipboard"
          variant="ghost"
          onPress={() => {
            impact('light');
            setCode('123456789');
          }}
          style={{ flex: 1 }}
        />
        <View style={{ width: 12 }} />
        <GradientButton
          label="Join"
          icon="enter"
          onPress={onJoin}
          disabled={!isValid}
          style={{ flex: 1 }}
        />
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <Text
          style={{
            color: theme.colors.textTertiary,
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}
        >
          Quick join recents
        </Text>
        {state.recentRooms.slice(0, 3).map((r, idx) => (
          <ListRow
            key={r.id}
            title={r.label}
            subtitle={`Room ${r.code}`}
            leadingIcon="time"
            leadingColor={r.color}
            onPress={() => navigation.navigate('HomeRoomHistoryItem', { code: r.code, index: idx })}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  codeWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  codeBox: {
    width: 30,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeChar: {
    fontSize: 18,
    fontWeight: '800',
  },
  keypad: {
    marginTop: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  keyWrap: {
    width: '30%',
    aspectRatio: 1.4,
    marginBottom: 12,
  },
  keyInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  keyLabel: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
