import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { GlassCard } from '@/components/GlassCard';
import { NeumorphCard } from '@/components/NeumorphCard';
import { GradientButton } from '@/components/GradientButton';
import { Skeleton, SkeletonCard, SkeletonLines } from '@/components/Skeleton';
import { Tag } from '@/components/Tag';
import { Avatar } from '@/components/Avatar';
import { SectionHeader } from '@/components/SectionHeader';
import { ListRow } from '@/components/ListRow';
import { StatTile } from '@/components/StatTile';
import { Card } from '@/components/Card';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useAIAssistant } from '@/components/AIAssistant';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store/AppStore';
import { useHaptics } from '@/hooks/useHaptics';
import { formatRelativeDay, formatTime } from '@/utils/format';
import type { HomeStackParamList } from '@/types';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function HomeIndexScreen() {
  const navigation = useNavigation<Nav>();
  const { theme, toggle, resolvedName } = useTheme();
  const { state } = useAppStore();
  const { impact } = useHaptics();
  const ai = useAIAssistant();
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const heroAnim = useSharedValue(0);
  useEffect(() => {
    heroAnim.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [heroAnim]);
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(heroAnim.value, [0, 1], [-12, 12]) },
      { translateY: interpolate(heroAnim.value, [0, 1], [-6, 6]) },
    ],
    opacity: interpolate(heroAnim.value, [0, 1], [0.95, 0.7]),
  }));

  const upcoming = state.meetings
    .filter((m) => Date.parse(m.startsAt) >= Date.now())
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
    .slice(0, 4);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 160 + insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand}
            colors={[theme.colors.brand]}
          />
        }
      >
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={theme.colors.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, { paddingTop: insets.top + 12 }]}
          >
            <Animated.View style={[styles.heroBlob, heroAnimatedStyle]}>
              <LinearGradient
                colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBlobGradient}
              />
            </Animated.View>

            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroGreeting}>Namaste, {state.profile.name.split(' ')[0]}</Text>
                <Text style={styles.heroTitle}>Ready for your next conversation?</Text>
              </View>
              <AnimatedPressable
                onPress={() => {
                  toggle();
                  impact('light');
                }}
                hapticStyle="none"
                containerStyle={styles.heroButton}
              >
                <Ionicons
                  name={resolvedName === 'dark' ? 'sunny' : 'moon'}
                  size={20}
                  color="#FFFFFF"
                />
              </AnimatedPressable>
            </View>

            <GlassCard
              borderRadius={22}
              style={[styles.searchCard, { borderRadius: 22 }]}
            >
              <View style={styles.searchRow}>
                <Ionicons name="search" size={18} color="#FFFFFF" />
                <TextInput
                  placeholder="Search meetings, recordings, contacts"
                  placeholderTextColor="rgba(255,255,255,0.85)"
                  style={styles.searchInput}
                />
                <AnimatedPressable
                  onPress={ai.open}
                  hapticStyle="medium"
                  containerStyle={styles.aiPill}
                >
                  <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                  <Text style={styles.aiPillText}>Ask Aria</Text>
                </AnimatedPressable>
              </View>
            </GlassCard>

            <View style={styles.heroCardsRow}>
              <AnimatedPressable
                onPress={() => navigation.navigate('HomeJoinFlow')}
                hapticStyle="medium"
                scale={0.96}
                containerStyle={styles.heroCardWrap}
              >
                <LinearGradient
                  colors={theme.colors.joinGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroCard}
                >
                  <Ionicons name="enter" size={22} color="#FFFFFF" />
                  <Text style={styles.heroCardTitle}>Join meeting</Text>
                  <Text style={styles.heroCardCaption}>Use a code or invite link</Text>
                </LinearGradient>
              </AnimatedPressable>

              <AnimatedPressable
                onPress={() => navigation.navigate('HomeCreateFlow')}
                hapticStyle="medium"
                scale={0.96}
                containerStyle={styles.heroCardWrap}
              >
                <LinearGradient
                  colors={theme.colors.createGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroCard}
                >
                  <Ionicons name="add-circle" size={22} color="#FFFFFF" />
                  <Text style={styles.heroCardTitle}>New meeting</Text>
                  <Text style={styles.heroCardCaption}>Start instantly or schedule</Text>
                </LinearGradient>
              </AnimatedPressable>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsRow}>
          <StatTile
            label="Today"
            value={`${upcoming.filter((u) => formatRelativeDay(new Date(u.startsAt)) === 'Today').length}`}
            caption="meetings scheduled"
            icon="time"
            gradient={theme.colors.scheduleGradient}
            onPress={() => navigation.navigate('HomeStatusDetail', { region: 'today' })}
          />
          <View style={{ width: 12 }} />
          <StatTile
            label="Recordings"
            value={`${state.recordings.length}`}
            caption="ready to revisit"
            icon="film"
            gradient={theme.colors.recordingGradient}
            onPress={() => navigation.navigate('HomeStatusDetail', { region: 'recordings' })}
          />
        </View>

        <SectionHeader
          title="Up next"
          caption="Tap a card for full details"
          actionLabel="See all"
          onAction={() => navigation.navigate('HomeStatusDetail', { region: 'upcoming' })}
        />

        {loading ? (
          <View style={{ paddingHorizontal: 16 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {upcoming.map((m) => (
              <AnimatedPressable
                key={m.id}
                onPress={() => navigation.navigate('HomeQuickJoinDetail', { code: m.roomCode })}
                hapticStyle="light"
                scale={0.96}
                containerStyle={{ width: 240 }}
              >
                <Card variant="elevated" radius={20}>
                  <View style={styles.upcomingTopRow}>
                    <View style={[styles.colorDot, { backgroundColor: m.thumbnailColor }]} />
                    <Tag label={m.category.toUpperCase()} tone="brand" outline />
                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      marginTop: 12,
                      color: theme.colors.textPrimary,
                      fontSize: 15,
                      fontWeight: '700',
                      lineHeight: 20,
                    }}
                  >
                    {m.title}
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      color: theme.colors.textSecondary,
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    {formatRelativeDay(new Date(m.startsAt))} • {formatTime(new Date(m.startsAt))}
                  </Text>
                  <View style={styles.upcomingFooter}>
                    {state.contacts
                      .filter((c) => m.participantIds.slice(0, 3).includes(c.id))
                      .map((c, idx) => (
                        <View
                          key={c.id}
                          style={{ marginLeft: idx === 0 ? 0 : -8 }}
                        >
                          <Avatar
                            initials={c.initials}
                            color={c.avatarColor}
                            size={28}
                            borderColor={theme.colors.cardElevated}
                          />
                        </View>
                      ))}
                    <Text style={{ marginLeft: 8, color: theme.colors.textTertiary, fontSize: 11, fontWeight: '600' }}>
                      +{Math.max(0, m.participantIds.length - 3)} more
                    </Text>
                  </View>
                </Card>
              </AnimatedPressable>
            ))}
          </ScrollView>
        )}

        <SectionHeader title="Favorite rooms" actionLabel="Manage" onAction={() => navigation.navigate('HomeStatusDetail', { region: 'favorites' })} />
        <View style={{ paddingHorizontal: 16 }}>
          {state.favorites.slice(0, 6).map((f) => (
            <ListRow
              key={f.id}
              title={f.label}
              subtitle={`Room ${f.code}`}
              caption="Tap to peek into the room"
              leadingIcon="star"
              leadingColor={f.color}
              onPress={() => navigation.navigate('HomeFavoriteRoom', { roomId: f.id })}
            />
          ))}
        </View>

        <SectionHeader title="Recent rooms" actionLabel="History" onAction={() => navigation.navigate('HomeStatusDetail', { region: 'history' })} />
        <View style={{ paddingHorizontal: 16 }}>
          {state.recentRooms.slice(0, 6).map((r, i) => (
            <ListRow
              key={r.id}
              title={r.label}
              subtitle={`Joined ${formatRelativeDay(new Date(r.joinedAt))} • Room ${r.code}`}
              leadingIcon="time"
              leadingColor={r.color}
              onPress={() => navigation.navigate('HomeRoomHistoryItem', { code: r.code, index: i })}
            />
          ))}
        </View>

        <SectionHeader title="What\'s new" caption="Tap any card to learn more" />
        <View style={{ paddingHorizontal: 16 }}>
          {state.announcements.slice(0, 4).map((a) => (
            <AnimatedPressable
              key={a.id}
              onPress={() => navigation.navigate('HomeAnnouncementDetail', { id: a.id })}
              hapticStyle="light"
              scale={0.97}
              containerStyle={{ marginVertical: 6 }}
            >
              <NeumorphCard borderRadius={20}>
                <View style={{ padding: 16 }}>
                  <Text style={{ color: theme.colors.textPrimary, fontSize: 15, fontWeight: '800' }}>{a.title}</Text>
                  <Text style={{ marginTop: 6, color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                    {a.body}
                  </Text>
                  <Text style={{ marginTop: 10, color: theme.colors.brand, fontWeight: '700', fontSize: 12 }}>Read more →</Text>
                </View>
              </NeumorphCard>
            </AnimatedPressable>
          ))}
        </View>

        <SectionHeader title="Pro tips" caption="Pulled fresh just for you" />
        <View style={{ paddingHorizontal: 16 }}>
          {state.tips.slice(0, 6).map((t) => (
            <ListRow
              key={t.id}
              title={t.title}
              subtitle={t.body}
              leadingIcon="bulb"
              leadingColor={theme.colors.warning}
              onPress={() => navigation.navigate('HomeTipDetail', { id: t.id })}
            />
          ))}
        </View>

        <SectionHeader title="Integrations" actionLabel="See all" onAction={() => navigation.navigate('HomeStatusDetail', { region: 'integrations' })} />
        <View style={{ paddingHorizontal: 16 }}>
          {state.integrations.slice(0, 5).map((i) => (
            <ListRow
              key={i.id}
              title={i.name}
              subtitle={i.description}
              caption={i.enabled ? 'Connected' : 'Tap to connect'}
              leadingIcon={i.enabled ? 'checkmark-circle' : 'apps'}
              leadingColor={i.enabled ? theme.colors.success : theme.colors.brand}
              onPress={() => navigation.navigate('HomeIntegrationDetail', { integrationId: i.id })}
            />
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <GradientButton
            label="Open AI assistant"
            icon="sparkles"
            onPress={ai.open}
            full
            size="lg"
          />
          <Text
            style={{
              marginTop: 12,
              textAlign: 'center',
              color: theme.colors.textTertiary,
              fontSize: 11,
              fontWeight: '600',
            }}
          >
            MeetX Ultra Pro v1.0 • Built with love for great meetings
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: { padding: 16 },
  hero: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  heroBlob: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden',
  },
  heroBlobGradient: { flex: 1, borderRadius: 110 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroGreeting: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    letterSpacing: 0.4,
    fontSize: 13,
  },
  heroTitle: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  heroButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCard: { marginTop: 18 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 999,
  },
  aiPillText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '700',
  },
  heroCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  heroCardWrap: { flex: 1 },
  heroCard: {
    padding: 14,
    borderRadius: 22,
    minHeight: 120,
    justifyContent: 'flex-end',
  },
  heroCardTitle: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  heroCardCaption: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  upcomingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  upcomingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
});
