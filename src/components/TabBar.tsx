import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { AnimatedPressable } from './AnimatedPressable';
import { useHaptics } from '@/hooks/useHaptics';

const ICON_MAP: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  HomeTab: ['home-outline', 'home'],
  MeetingsTab: ['videocam-outline', 'videocam'],
  ContactsTab: ['people-outline', 'people'],
  ScheduleTab: ['calendar-outline', 'calendar'],
  ProfileTab: ['person-circle-outline', 'person-circle'],
};

const LABEL_MAP: Record<string, string> = {
  HomeTab: 'Home',
  MeetingsTab: 'Meetings',
  ContactsTab: 'Contacts',
  ScheduleTab: 'Schedule',
  ProfileTab: 'Profile',
};

export const GlassTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { impact } = useHaptics();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingBottom: insets.bottom + 6,
          backgroundColor: Platform.select({
            ios: 'transparent',
            android: theme.colors.cardElevated,
            default: theme.colors.cardElevated,
          }),
        },
      ]}
      pointerEvents="box-none"
    >
      <BlurView
        intensity={50}
        tint={theme.isDark ? 'dark' : 'light'}
        style={[
          styles.bar,
          {
            backgroundColor: theme.colors.glassBackground,
            borderTopColor: theme.colors.glassStroke,
            borderColor: theme.colors.glassStroke,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const [outlined, filled] = ICON_MAP[route.name] ?? ['ellipse-outline', 'ellipse'];
          const label = LABEL_MAP[route.name] ?? route.name;
          return (
            <TabButton
              key={route.key}
              label={label}
              focused={isFocused}
              icon={isFocused ? filled : outlined}
              onPress={() => {
                if (!isFocused) {
                  impact('light');
                  navigation.navigate(route.name);
                }
              }}
              theme={theme}
            />
          );
        })}
      </BlurView>
    </View>
  );
};

interface TabButtonProps {
  label: string;
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>['theme'];
}

const TabButton: React.FC<TabButtonProps> = ({ label, focused, icon, onPress, theme }) => {
  const scale = useSharedValue(focused ? 1.08 : 1);
  const lift = useSharedValue(focused ? -2 : 0);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.08 : 1, { damping: 14, stiffness: 220, mass: 0.5 });
    lift.value = withTiming(focused ? -2 : 0, { duration: 180 });
  }, [focused, scale, lift]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: lift.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      hapticStyle="none"
      containerStyle={styles.tabButton}
    >
      <Animated.View style={[styles.tabInner, animatedStyle]}>
        {focused ? (
          <LinearGradient
            colors={theme.colors.brandGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBubble}
          >
            <Ionicons name={icon} size={20} color="#FFFFFF" />
          </LinearGradient>
        ) : (
          <View style={[styles.iconBubble, { backgroundColor: 'transparent' }]}>
            <Ionicons name={icon} size={22} color={theme.colors.tabInactive} />
          </View>
        )}
        <Text
          style={[
            styles.label,
            {
              color: focused ? theme.colors.tabActive : theme.colors.tabInactive,
              fontWeight: focused ? '800' : '600',
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
