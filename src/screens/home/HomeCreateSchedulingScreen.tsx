/**
 * AUTO-GENERATED SCREEN — DO NOT EDIT BY HAND.
 *
 * MeetX Ultra Pro is a richly-styled mock meeting application designed to
 * demonstrate deep navigation, premium UI surfaces (glass / neumorphism /
 * gradients), micro-interactions and AsyncStorage-driven persistence. Every
 * card, row and chip on this screen is interactive – tap any one of them to
 * open a deeper screen of the same flow.
 *
 * Screen: HomeCreateScheduling
 * Stack:  home
 * Depth:  Level 4
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Card, Divider } from '@/components/Card';
import { GlassCard } from '@/components/GlassCard';
import { NeumorphCard } from '@/components/NeumorphCard';
import { GradientButton } from '@/components/GradientButton';
import { SkeletonCard, SkeletonLines } from '@/components/Skeleton';
import { Tag } from '@/components/Tag';
import { Avatar } from '@/components/Avatar';
import { ListRow } from '@/components/ListRow';
import { StatTile } from '@/components/StatTile';
import { SectionHeader } from '@/components/SectionHeader';
import { EmptyState } from '@/components/EmptyState';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useAIAssistant } from '@/components/AIAssistant';
import { QuickActionSheet, QuickActionSheetHandle } from '@/components/QuickActionSheet';

import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store/AppStore';
import { useHaptics } from '@/hooks/useHaptics';
import { formatRelativeDay, formatTime, formatDuration, formatDurationLong, pluralize, truncate } from '@/utils/format';
import type { HomeStackParamList } from '@/types';

type Nav = NativeStackNavigationProp<HomeStackParamList>;
type Route = RouteProp<HomeStackParamList, 'HomeCreateScheduling'>;

const QUICK_ACTIONS = [
  { id: 'pin', label: 'Pin to top', icon: 'pin', tone: 'brand' as const },
  { id: 'share', label: 'Share with team', icon: 'share-social', tone: 'info' as const },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy', tone: 'default' as const },
  { id: 'remind', label: 'Remind me later', icon: 'alarm', tone: 'warning' as const },
  { id: 'archive', label: 'Archive', icon: 'archive', tone: 'default' as const },
  { id: 'delete', label: 'Delete', icon: 'trash', tone: 'danger' as const, destructive: true },
];

const SECTION_TIPS = [
  'Long-press any card for context actions, swipe to dismiss.',
  'Aria can summarize this entire screen — tap the floating sparkle to ask.',
  'Pull down to refresh the latest data with a buttery smooth animation.',
  'Use the search bar in the header to filter by name, code, or category.',
  'Anything you tap opens a richer screen — keep exploring!',
];

export default function HomeCreateSchedulingScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const params = (route.params ?? {}) as Record<string, unknown>;

  const { theme, toggle, resolvedName } = useTheme();
  const { state } = useAppStore();
  const { impact, notify, select } = useHaptics();
  const ai = useAIAssistant();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<QuickActionSheetHandle>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [muted, setMuted] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [encrypted, setEncrypted] = useState(true);
  const [page, setPage] = useState(0);

  const heroPulse = useSharedValue(0);
  useEffect(() => {
    heroPulse.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [heroPulse]);
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(heroPulse.value, [0, 1], [-14, 14]) },
      { translateY: interpolate(heroPulse.value, [0, 1], [-8, 8]) },
    ],
    opacity: interpolate(heroPulse.value, [0, 1], [0.95, 0.65]),
  }));

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800 + Math.random() * 600);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    impact('light');
    setTimeout(() => {
      setRefreshing(false);
      notify('success');
    }, 900);
  }, [impact, notify]);

  const onLoadMore = useCallback(() => {
    select();
    setPage((p) => p + 1);
  }, [select]);

  const items = state.meetings.slice(0, 12);
  const headline = items[0];
  const participants = headline ? state.contacts.filter((c) => headline.participantIds.includes(c.id)).slice(0, 8) : [];

  const nextRoutes: Array<{ key: string; label: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }> = [
    {
      key: 'HomeFeatureSpotlight-0',
      label: "Conflict detection",
      subtitle: "See clashes across attendees",
      icon: "alert" as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate('HomeFeatureSpotlight', { feature: "conflicts" }),
    },
    {
      key: 'HomeFeatureSpotlight-1',
      label: "Recurrence presets",
      subtitle: "Daily, weekly, custom intervals",
      icon: "repeat" as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate('HomeFeatureSpotlight', { feature: "recurrence" }),
    },
  ];

  const heroGradient = theme.colors.scheduleGradient;

  return (
    <Screen
      bg="default"
      refreshing={refreshing}
      onRefresh={onRefresh}
      bottomPadding={120}
    >
      <LinearGradient
        colors={heroGradient}
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

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <AnimatedPressable
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            hapticStyle="light"
            scale={0.92}
            containerStyle={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </AnimatedPressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroCaption}>HOME • LEVEL 4</Text>
          </View>
          <AnimatedPressable
            onPress={() => sheetRef.current?.open()}
            hapticStyle="light"
            scale={0.92}
            containerStyle={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
          </AnimatedPressable>
        </View>

        <Text style={styles.heroTitle}>Pick the perfect time</Text>
        <Text style={styles.heroSubtitle}>Compare time zones, set reminders, choose a recurrence.</Text>

        <View style={styles.heroPills}>
          <View style={styles.heroPill}><Text style={styles.heroPillText}>Premium</Text></View>
          <View style={styles.heroPill}><Text style={styles.heroPillText}>HD video</Text></View>
          <View style={styles.heroPill}><Text style={styles.heroPillText}>End-to-end encrypted</Text></View>
          <View style={styles.heroPill}><Text style={styles.heroPillText}>AI assisted</Text></View>
        </View>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{items.length}</Text>
            <Text style={styles.heroStatLabel}>ITEMS</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{participants.length}</Text>
            <Text style={styles.heroStatLabel}>PEOPLE</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>4/4</Text>
            <Text style={styles.heroStatLabel}>DEPTH</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ------- Quick metrics ------- */}
      <SectionHeader title="At a glance" caption="Tap a tile for the deep dive" />
      <View style={[styles.sectionWrap, styles.metricGrid]}>
        <View style={styles.metricTile}>
          <StatTile
            label="On track"
            value={`${Math.max(items.length - 2, 0)}`}
            caption="ready to roll"
            icon="rocket"
            gradient={theme.colors.brandGradient}
            onPress={() => sheetRef.current?.open()}
          />
        </View>
        <View style={styles.metricTile}>
          <StatTile
            label="Followers"
            value={`${participants.length * 12}`}
            caption="watching this"
            icon="people"
            gradient={theme.colors.contactsGradient}
            onPress={() => sheetRef.current?.open()}
          />
        </View>
        <View style={styles.metricTile}>
          <StatTile
            label="Saved"
            value={`${Math.max(items.length / 3, 1).toFixed(0)}`}
            caption="bookmarks"
            icon="bookmark"
            gradient={theme.colors.scheduleGradient}
            onPress={() => sheetRef.current?.open()}
          />
        </View>
        <View style={styles.metricTile}>
          <StatTile
            label="Score"
            value={`${(participants.length * 7).toFixed(0)}%`}
            caption="health"
            icon="pulse"
            gradient={theme.colors.recordingGradient}
            onPress={() => sheetRef.current?.open()}
          />
        </View>
      </View>

      {/* ------- Headline glass card ------- */}
      <View style={styles.glassCardWrap}>
        <GlassCard borderRadius={22}>
          <View style={styles.glassCardInner}>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Pick the perfect time</Text>
            <Text style={[styles.cardCaption, { color: theme.colors.textSecondary }]}>Compare time zones, set reminders, choose a recurrence. Tap any tile below to keep diving.</Text>
            <View style={styles.rowMeta}>
              <View style={styles.rowMetaItem}>
                <Ionicons name="people" size={14} color={theme.colors.textTertiary} />
                <Text style={[styles.rowMetaLabel, { color: theme.colors.textTertiary }]}>{participants.length} people</Text>
              </View>
              <View style={styles.rowMetaItem}>
                <Ionicons name="time" size={14} color={theme.colors.textTertiary} />
                <Text style={[styles.rowMetaLabel, { color: theme.colors.textTertiary }]}>{loading ? '—' : 'Updated just now'}</Text>
              </View>
              <View style={styles.rowMetaItem}>
                <Ionicons name="lock-closed" size={14} color={theme.colors.textTertiary} />
                <Text style={[styles.rowMetaLabel, { color: theme.colors.textTertiary }]}>{encrypted ? 'Encrypted' : 'Open'}</Text>
              </View>
            </View>
            <View style={styles.pillsRow}>
              {SECTION_TIPS.slice(0, 3).map((tip) => (
                <Tag key={tip} label={truncate(tip, 28)} tone="brand" outline />
              ))}
            </View>
          </View>
        </GlassCard>
      </View>

      {/* ------- Primary action ------- */}
      <View style={styles.ctaRow}>
        <GradientButton
          label="Explore deeper"
          icon="layers"
          onPress={() => nextRoutes[0]?.onPress()}
          full={false}
          style={{ flex: 1 }}
        />
        <GradientButton
          label="Ask Aria"
          icon="sparkles"
          variant="ghost"
          onPress={ai.open}
          full={false}
          style={{ flex: 1 }}
        />
      </View>

      {/* ------- Drill-deeper grid (every card opens a new screen) ------- */}
      <SectionHeader title="Go deeper" caption="Each tile opens a richer screen" />
      <View style={[styles.sectionWrap, { gap: 12 }]}>
        {nextRoutes.map((r) => (
          <AnimatedPressable
            key={r.key}
            onPress={r.onPress}
            hapticStyle="light"
            scale={0.97}
          >
            <NeumorphCard borderRadius={20}>
              <View style={styles.itemBubbleRow}>
                <View style={[styles.itemBubble, { backgroundColor: theme.colors.brandSoft }]}>
                  <Ionicons name={r.icon} size={20} color={theme.colors.brand} />
                </View>
                <View style={styles.itemBody}>
                  <Text style={[styles.itemTitle, { color: theme.colors.textPrimary }]}>{r.label}</Text>
                  <Text style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]}>
                    {r.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
              </View>
            </NeumorphCard>
          </AnimatedPressable>
        ))}
      </View>

      {/* ------- Items list (every row taps to next screen) ------- */}
      <SectionHeader
        title="Meeting highlights"
        caption="Pull-to-refresh the latest"
      />
      {loading ? (
        <View style={styles.loaderRow}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : (
        <View style={{ paddingHorizontal: 16 }}>
          {items.map((m) => (
            <AnimatedPressable
              key={m.id}
              onPress={() => sheetRef.current?.open()}
              hapticStyle="light"
              scale={0.98}
              containerStyle={{ marginVertical: 6 }}
            >
              <Card variant="elevated" radius={20}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 6, height: 56, borderRadius: 3, backgroundColor: m.thumbnailColor, marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.textPrimary, fontSize: 15, fontWeight: '700' }}>{m.title}</Text>
                    <Text style={{ marginTop: 4, color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                      {formatRelativeDay(new Date(m.startsAt))} • {formatTime(new Date(m.startsAt))} • {m.durationMinutes}m
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      <Tag label={m.category.toUpperCase()} tone="brand" outline />
                      {m.tags.slice(0, 2).map((t) => (
                        <Tag key={t} label={t} tone="default" />
                      ))}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                </View>
              </Card>
            </AnimatedPressable>
          ))}
        </View>
      )}

      {/* ------- Toggles section ------- */}
      <SectionHeader title="Preferences" caption="Tweak this screen exactly to your taste" />
      <Card variant="elevated" radius={20} style={{ marginHorizontal: 16 }}>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleLabel, { color: theme.colors.textPrimary }]}>Mute notifications</Text>
            <Text style={[styles.toggleCaption, { color: theme.colors.textSecondary }]}>Stop pushes for items below until tomorrow.</Text>
          </View>
          <Switch
            value={muted}
            onValueChange={(v) => {
              setMuted(v);
              impact(v ? 'heavy' : 'light');
            }}
          />
        </View>
        <Divider />
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleLabel, { color: theme.colors.textPrimary }]}>Auto-save changes</Text>
            <Text style={[styles.toggleCaption, { color: theme.colors.textSecondary }]}>Skip the confirmation step when changing values.</Text>
          </View>
          <Switch value={autoSave} onValueChange={setAutoSave} />
        </View>
        <Divider />
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleLabel, { color: theme.colors.textPrimary }]}>End-to-end encryption</Text>
            <Text style={[styles.toggleCaption, { color: theme.colors.textSecondary }]}>Cross-device sync uses MeetX-issued keys only.</Text>
          </View>
          <Switch value={encrypted} onValueChange={setEncrypted} />
        </View>
        <Divider />
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.toggleLabel, { color: theme.colors.textPrimary }]}>Pin to home</Text>
            <Text style={[styles.toggleCaption, { color: theme.colors.textSecondary }]}>Surface this screen on the home tab.</Text>
          </View>
          <Switch value={favorited} onValueChange={setFavorited} />
        </View>
      </Card>

      {/* ------- Activity log ------- */}
      <SectionHeader title="Activity" caption="Tap an item to drill into it" />
      <View style={{ paddingHorizontal: 16 }}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <ListRow
            key={`activity-${idx}`}
            title={`Activity entry #${idx + 1}`}
            subtitle={`Auto-summarized event ${idx + 1} • ${formatTime(new Date(Date.now() - idx * 600000))}`}
            caption={SECTION_TIPS[idx % SECTION_TIPS.length]}
            leadingIcon={(idx % 2 === 0 ? 'flash' : 'analytics') as keyof typeof Ionicons.glyphMap}
            leadingColor={idx % 2 === 0 ? theme.colors.warning : theme.colors.info}
            onPress={() => sheetRef.current?.open()}
          />
        ))}
      </View>

      {/* ------- People row ------- */}
      <SectionHeader title="People involved" actionLabel="See all" onAction={() => sheetRef.current?.open()} />
      <View style={{ paddingHorizontal: 16 }}>
        {participants.slice(0, 6).map((p) => (
          <ListRow
            key={p.id}
            title={p.name}
            subtitle={`${p.jobTitle} • ${p.company}`}
            caption={`${p.city}, ${p.country} • ${p.timeZone}`}
            leading={<Avatar initials={p.initials} color={p.avatarColor} size={42} showStatus status="available" />}
            onPress={() => sheetRef.current?.open()}
          />
        ))}
      </View>

      {/* ------- Bottom CTA ------- */}
      <View style={styles.ctaRow}>
        <GradientButton
          label={favorited ? 'Pinned to home' : 'Pin to home'}
          icon={favorited ? 'star' : 'star-outline'}
          variant="ghost"
          onPress={() => {
            setFavorited((v) => !v);
            impact('medium');
          }}
          style={{ flex: 1 }}
        />
        <GradientButton
          label="Load more"
          icon="refresh"
          variant="secondary"
          onPress={onLoadMore}
          style={{ flex: 1 }}
        />
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Text
          style={{
            color: theme.colors.textTertiary,
            fontSize: 11,
            textAlign: 'center',
            fontWeight: '600',
            letterSpacing: 0.4,
          }}
        >
          MeetX Ultra Pro • {resolvedName} mode • home HomeCreateScheduling • Page {page + 1}
        </Text>
      </View>

      <QuickActionSheet
        ref={sheetRef}
        title="Quick actions"
        actions={QUICK_ACTIONS.map((a) => ({
          id: a.id,
          label: a.label,
          icon: a.icon as keyof typeof Ionicons.glyphMap,
          destructive: !!a.destructive,
          onPress: () => {
            impact(a.destructive ? 'heavy' : 'light');
            notify(a.destructive ? 'warning' : 'success');
          },
        }))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  heroBlob: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
  },
  heroBlobGradient: { flex: 1, borderRadius: 120 },
  heroCaption: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  heroSubtitle: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  heroPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  heroPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 12,
  },
  heroStat: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  sectionWrap: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 12,
  },
  metricTile: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  card: {
    borderRadius: 22,
    padding: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cardCaption: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  rowMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowMetaLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 6,
  },
  ctaRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  itemBubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: {
    flex: 1,
    paddingHorizontal: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemSubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  glassCardWrap: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  glassCardInner: {
    padding: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    paddingRight: 12,
  },
  toggleCaption: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    paddingRight: 12,
    marginTop: 2,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  loaderRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

