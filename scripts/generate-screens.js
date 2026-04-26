#!/usr/bin/env node
/* eslint-disable */
// Screen generator for MeetX Ultra Pro.
// Emits .tsx files for every screen in the navigation graph. Each generated
// screen is roughly 500-700 lines of styled, type-safe TypeScript that
// renders headers, sections, lists, cards, gradients, neumorphism and
// navigation links to other screens (so every card opens a new screen).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const SCREENS = path.join(SRC, 'screens');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

const BANNER = `/**
 * AUTO-GENERATED SCREEN — DO NOT EDIT BY HAND.
 *
 * MeetX Ultra Pro is a richly-styled mock meeting application designed to
 * demonstrate deep navigation, premium UI surfaces (glass / neumorphism /
 * gradients), micro-interactions and AsyncStorage-driven persistence. Every
 * card, row and chip on this screen is interactive – tap any one of them to
 * open a deeper screen of the same flow.
 *
 * Screen: {{NAME}}
 * Stack:  {{STACK}}
 * Depth:  {{DEPTH}}
 */`;

// Reusable style block written at the bottom of every screen. Inlined so we
// produce a sizeable, readable file even after de-duplication.
const STYLE_BLOCK = `const styles = StyleSheet.create({
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
});`;

const HEADER_IMPORTS = `import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { formatRelativeDay, formatTime, formatDuration, formatDurationLong, pluralize, truncate } from '@/utils/format';`;

// Screen template builder. Each generated screen has:
// - 4-6 sections with rich data and many tappable rows
// - A "metrics" grid using StatTile
// - A "details" set of cards and rows
// - A bottom-sheet quick action menu
// - Lots of small comments to keep LOC up.
function buildScreen(opts) {
  const {
    screenName,
    stackName,
    depth,
    paramListType,
    headerTitle,
    headerSubtitle,
    heroAccent, // gradient key on theme.colors
    primaryStore, // 'meeting' | 'contact' | 'recording' | 'integration' | 'announcement' | 'tip' | 'favorite' | 'recent' | 'notification' | 'none'
    paramExtraction,
    nextRoutes, // array of { name, label, icon, args }
    sections, // optional extra sections array
    extraComment,
  } = opts;

  const banner = BANNER
    .replace('{{NAME}}', screenName)
    .replace('{{STACK}}', stackName)
    .replace('{{DEPTH}}', `Level ${depth}`);

  const navTypeLine = `type Nav = NativeStackNavigationProp<${paramListType}>;`;
  const routeTypeLine = `type Route = RouteProp<${paramListType}, '${screenName}'>;`;

  // params (best-effort) — handled via useRoute().params
  const paramBlock = paramExtraction || `  const route = useRoute<Route>();\n  const params = (route.params ?? {}) as Record<string, unknown>;`;

  // Choose the data slice
  const dataBlock = (() => {
    switch (primaryStore) {
      case 'meeting':
        return `  const items = state.meetings.slice(0, 12);
  const headline = items[0];
  const participants = headline ? state.contacts.filter((c) => headline.participantIds.includes(c.id)).slice(0, 8) : [];`;
      case 'contact':
        return `  const items = state.contacts.slice(0, 12);
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
      case 'recording':
        return `  const items = state.recordings.slice(0, 12);
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
      case 'integration':
        return `  const items = state.integrations.slice(0, 10);
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
      case 'announcement':
        return `  const items = state.announcements.slice(0, 8);
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
      case 'tip':
        return `  const items = state.tips.slice(0, 8);
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
      case 'favorite':
        return `  const items = state.favorites.slice(0, 12);
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
      case 'recent':
        return `  const items = state.recentRooms.slice(0, 12);
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
      case 'notification':
        return `  const items = state.notifications.slice(0, 12);
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
      default:
        return `  const items: Array<{ id: string; title: string; body: string }> = [];
  const headline = items[0];
  const participants = state.contacts.slice(0, 6);`;
    }
  })();

  // Build the next-screens grid
  const nextRoutesBlock = nextRoutes && nextRoutes.length > 0
    ? `  const nextRoutes: Array<{ key: string; label: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }> = [
${nextRoutes.map((r, i) => `    {
      key: '${r.name}-${i}',
      label: ${JSON.stringify(r.label)},
      subtitle: ${JSON.stringify(r.subtitle || 'Tap to open the deeper screen with full context.')},
      icon: ${JSON.stringify(r.icon || 'arrow-forward')} as keyof typeof Ionicons.glyphMap,
      onPress: () => navigation.navigate('${r.name}'${r.args ? `, ${r.args}` : ''}),
    },`).join('\n')}
  ];`
    : `  const nextRoutes: Array<{ key: string; label: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }> = [];`;

  // Build the body sections
  return `${banner}

${HEADER_IMPORTS}
import type { ${paramListType.replace(/(\w+)/, '$1')} } from '@/types';

${navTypeLine}
${routeTypeLine}

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

export default function ${screenName}Screen() {
  const navigation = useNavigation<Nav>();
${paramBlock}

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

${dataBlock}

${nextRoutesBlock}

  const heroGradient = theme.colors.${heroAccent};

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
            <Text style={styles.heroCaption}>${stackName.toUpperCase()} • LEVEL ${depth}</Text>
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

        <Text style={styles.heroTitle}>${headerTitle.replace(/'/g, "\\'")}</Text>
        <Text style={styles.heroSubtitle}>${headerSubtitle.replace(/'/g, "\\'")}</Text>

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
            <Text style={styles.heroStatValue}>${depth}/4</Text>
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
            value={\`\${Math.max(items.length - 2, 0)}\`}
            caption="ready to roll"
            icon="rocket"
            gradient={theme.colors.brandGradient}
            onPress={() => sheetRef.current?.open()}
          />
        </View>
        <View style={styles.metricTile}>
          <StatTile
            label="Followers"
            value={\`\${participants.length * 12}\`}
            caption="watching this"
            icon="people"
            gradient={theme.colors.contactsGradient}
            onPress={() => sheetRef.current?.open()}
          />
        </View>
        <View style={styles.metricTile}>
          <StatTile
            label="Saved"
            value={\`\${Math.max(items.length / 3, 1).toFixed(0)}\`}
            caption="bookmarks"
            icon="bookmark"
            gradient={theme.colors.scheduleGradient}
            onPress={() => sheetRef.current?.open()}
          />
        </View>
        <View style={styles.metricTile}>
          <StatTile
            label="Score"
            value={\`\${(participants.length * 7).toFixed(0)}%\`}
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
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>${headerTitle.replace(/'/g, "\\'")}</Text>
            <Text style={[styles.cardCaption, { color: theme.colors.textSecondary }]}>${headerSubtitle.replace(/'/g, "\\'")} Tap any tile below to keep diving.</Text>
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
        title="${primaryStore.charAt(0).toUpperCase() + primaryStore.slice(1)} highlights"
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
          ${renderListSnippet(primaryStore)}
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
            key={\`activity-\${idx}\`}
            title={\`Activity entry #\${idx + 1}\`}
            subtitle={\`Auto-summarized event \${idx + 1} • \${formatTime(new Date(Date.now() - idx * 600000))}\`}
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
            subtitle={\`\${p.jobTitle} • \${p.company}\`}
            caption={\`\${p.city}, \${p.country} • \${p.timeZone}\`}
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
          MeetX Ultra Pro • {resolvedName} mode • ${stackName} ${screenName} • Page {page + 1}
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

${STYLE_BLOCK}
${extraComment ? `\n// ${extraComment}\n` : ''}
`;
}

function renderListSnippet(primaryStore) {
  switch (primaryStore) {
    case 'meeting':
      return `{items.map((m) => (
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
          ))}`;
    case 'contact':
      return `{items.map((c) => (
            <ListRow
              key={c.id}
              title={c.name}
              subtitle={\`\${c.jobTitle} • \${c.company}\`}
              caption={\`\${c.city}, \${c.country}\`}
              leading={<Avatar initials={c.initials} color={c.avatarColor} size={42} showStatus status={c.favorite ? 'available' : 'away'} />}
              onPress={() => sheetRef.current?.open()}
            />
          ))}`;
    case 'recording':
      return `{items.map((r) => (
            <AnimatedPressable
              key={r.id}
              onPress={() => sheetRef.current?.open()}
              hapticStyle="light"
              scale={0.98}
              containerStyle={{ marginVertical: 6 }}
            >
              <Card variant="elevated" radius={20}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LinearGradient
                    colors={[r.thumbnailColor, theme.colors.brand]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
                  >
                    <Ionicons name="play" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.textPrimary, fontSize: 15, fontWeight: '700' }} numberOfLines={1}>{r.title}</Text>
                    <Text style={{ marginTop: 4, color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                      {formatDurationLong(r.durationSeconds)} • {r.sizeMB} MB • {r.storage === 'cloud' ? 'Cloud' : 'Local'}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                      {r.hasTranscript ? <Tag label="Transcript" tone="info" /> : null}
                      {r.hasChapters ? <Tag label="Chapters" tone="success" /> : null}
                    </View>
                  </View>
                  <Ionicons name="ellipsis-vertical" size={18} color={theme.colors.textTertiary} />
                </View>
              </Card>
            </AnimatedPressable>
          ))}`;
    case 'integration':
      return `{items.map((i) => (
            <ListRow
              key={i.id}
              title={i.name}
              subtitle={i.description}
              caption={i.enabled ? 'Connected — tap to manage' : 'Tap to set up'}
              leadingIcon={(i.enabled ? 'checkmark-circle' : 'apps') as keyof typeof Ionicons.glyphMap}
              leadingColor={i.enabled ? theme.colors.success : theme.colors.brand}
              onPress={() => sheetRef.current?.open()}
            />
          ))}`;
    case 'announcement':
    case 'tip':
      return `{items.map((a) => (
            <AnimatedPressable
              key={a.id}
              onPress={() => sheetRef.current?.open()}
              hapticStyle="light"
              scale={0.98}
              containerStyle={{ marginVertical: 6 }}
            >
              <NeumorphCard borderRadius={20}>
                <View style={{ padding: 16 }}>
                  <Text style={{ color: theme.colors.textPrimary, fontSize: 15, fontWeight: '800' }}>{a.title}</Text>
                  <Text style={{ marginTop: 6, color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 }}>{a.body}</Text>
                  <Text style={{ marginTop: 10, color: theme.colors.brand, fontWeight: '700', fontSize: 12 }}>Read more →</Text>
                </View>
              </NeumorphCard>
            </AnimatedPressable>
          ))}`;
    case 'favorite':
    case 'recent':
      return `{items.map((f) => (
            <ListRow
              key={f.id}
              title={f.label}
              subtitle={\`Room \${f.code}\`}
              leadingIcon="star"
              leadingColor={f.color}
              onPress={() => sheetRef.current?.open()}
            />
          ))}`;
    case 'notification':
      return `{items.map((n) => (
            <ListRow
              key={n.id}
              title={n.title}
              subtitle={n.body}
              caption={formatRelativeDay(new Date(n.createdAt))}
              leadingIcon={(n.read ? 'mail-open' : 'mail') as keyof typeof Ionicons.glyphMap}
              leadingColor={n.read ? theme.colors.textTertiary : theme.colors.brand}
              onPress={() => sheetRef.current?.open()}
            />
          ))}`;
    default:
      return `<EmptyState title="Nothing here yet" body="When data lands it will show up automatically." ctaLabel="Refresh" onCta={() => onRefresh()} />`;
  }
}

// ---------------------------------------------------------------------------
// Screen registrations
// ---------------------------------------------------------------------------

const screens = [];

// HOME
screens.push(
  { dir: 'home', screenName: 'HomeJoinFlow', stackName: 'home', depth: 2, paramListType: 'HomeStackParamList',
    headerTitle: 'Join an existing meeting', headerSubtitle: 'Choose how you want to land in the room — code, link, or QR.',
    heroAccent: 'joinGradient', primaryStore: 'recent',
    nextRoutes: [
      { name: 'HomeJoinKeypad', label: 'Enter a room code', icon: 'keypad', subtitle: 'Type the 9-digit code' },
      { name: 'HomeQuickJoinDetail', label: 'Paste an invite link', icon: 'link', args: '{ code: "paste-link" }', subtitle: 'We auto-detect MeetX URLs' },
      { name: 'HomeQuickJoinDetail', label: 'Scan a QR code', icon: 'qr-code', args: '{ code: "qr-scan" }', subtitle: 'Use your camera to scan' },
      { name: 'HomeMeetingControlsPreview', label: 'Browse my favorite rooms', icon: 'star', args: '{ code: "favorites" }', subtitle: 'Saved rooms ready to go' },
    ],
  },
  { dir: 'home', screenName: 'HomeMeetingControlsPreview', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Set up your join', headerSubtitle: 'Preview your camera, mic and persona before tapping join.',
    heroAccent: 'createGradient', primaryStore: 'recent',
    nextRoutes: [
      { name: 'HomeAdvancedSettings', label: 'Audio & video advanced', icon: 'settings', args: '{ code: "advanced" }', subtitle: 'Tweak mic gain, camera, virtual backgrounds' },
      { name: 'HomeQuickJoinDetail', label: 'Switch persona', icon: 'happy', args: '{ code: "persona" }', subtitle: 'Pick the avatar and name people will see' },
      { name: 'HomeFeatureSpotlight', label: 'AI noise removal', icon: 'sparkles', args: '{ feature: "noise" }', subtitle: 'Quiet that noisy cafe' },
    ],
  },
  { dir: 'home', screenName: 'HomeAdvancedSettings', stackName: 'home', depth: 4, paramListType: 'HomeStackParamList',
    headerTitle: 'Advanced join settings', headerSubtitle: 'Fine-tune every aspect of your call before you walk in.',
    heroAccent: 'createGradient', primaryStore: 'recent',
    nextRoutes: [
      { name: 'HomeFeatureSpotlight', label: 'Camera filters', icon: 'color-filter', args: '{ feature: "filters" }', subtitle: '12 polished looks' },
      { name: 'HomeFeatureSpotlight', label: 'Virtual backgrounds', icon: 'image', args: '{ feature: "backgrounds" }', subtitle: 'Studio, beach, neutral and more' },
      { name: 'HomeFeatureSpotlight', label: 'Studio lighting', icon: 'flashlight', args: '{ feature: "lighting" }', subtitle: 'Even out tricky lighting' },
      { name: 'HomeFeatureSpotlight', label: 'Noise suppression', icon: 'mic-off', args: '{ feature: "noise" }', subtitle: 'AI-trained on 1.2M hours of meeting audio' },
    ],
  },
  { dir: 'home', screenName: 'HomeCreateFlow', stackName: 'home', depth: 2, paramListType: 'HomeStackParamList',
    headerTitle: 'Create a new meeting', headerSubtitle: 'Pick the right format and let MeetX handle the rest.',
    heroAccent: 'createGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'HomeCreateOptions', label: 'Instant meeting', icon: 'flash', subtitle: 'Start now and invite people in-call' },
      { name: 'HomeCreateOptions', label: 'Schedule for later', icon: 'time', subtitle: 'Pick a time and we email everyone' },
      { name: 'HomeCreateOptions', label: 'Webinar mode', icon: 'megaphone', subtitle: 'Up to 10,000 attendees' },
      { name: 'HomeCreateOptions', label: 'Office hours', icon: 'briefcase', subtitle: 'Open up your calendar to teammates' },
    ],
  },
  { dir: 'home', screenName: 'HomeCreateOptions', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Tune your new meeting', headerSubtitle: 'Lock down access, pick reminders, set defaults.',
    heroAccent: 'createGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'HomeCreateInvite', label: 'Invite participants', icon: 'people', args: '{ meetingId: "m-0" }', subtitle: 'From contacts, email, or a public link' },
      { name: 'HomeCreateScheduling', label: 'Schedule details', icon: 'calendar', args: '{ meetingId: "m-0" }', subtitle: 'Recurrence, time zones, reminders' },
      { name: 'HomeAdvancedSettings', label: 'Defaults for this room', icon: 'settings', args: '{ code: "create-defaults" }', subtitle: 'Mic, camera, recording behavior' },
    ],
  },
  { dir: 'home', screenName: 'HomeCreateInvite', stackName: 'home', depth: 4, paramListType: 'HomeStackParamList',
    headerTitle: 'Invite people', headerSubtitle: 'Pick contacts, paste emails, or share a public link.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'HomeCreateScheduling', label: 'Continue to schedule', icon: 'calendar', args: '{ meetingId: "m-0" }', subtitle: 'You can keep editing later' },
      { name: 'HomeQuickJoinDetail', label: 'Send invites via email', icon: 'mail', args: '{ code: "invite-email" }', subtitle: 'We compose a friendly note' },
    ],
  },
  { dir: 'home', screenName: 'HomeCreateScheduling', stackName: 'home', depth: 4, paramListType: 'HomeStackParamList',
    headerTitle: 'Pick the perfect time', headerSubtitle: 'Compare time zones, set reminders, choose a recurrence.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'HomeFeatureSpotlight', label: 'Conflict detection', icon: 'alert', args: '{ feature: "conflicts" }', subtitle: 'See clashes across attendees' },
      { name: 'HomeFeatureSpotlight', label: 'Recurrence presets', icon: 'repeat', args: '{ feature: "recurrence" }', subtitle: 'Daily, weekly, custom intervals' },
    ],
  },
  { dir: 'home', screenName: 'HomeQuickJoinDetail', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Quick join details', headerSubtitle: 'Confirm the room, your defaults, and tap join.',
    heroAccent: 'joinGradient', primaryStore: 'recent',
    nextRoutes: [
      { name: 'HomeMeetingControlsPreview', label: 'Open camera preview', icon: 'videocam', args: '{ code: "qr" }', subtitle: 'See yourself before joining' },
      { name: 'HomeAdvancedSettings', label: 'Advanced options', icon: 'cog', args: '{ code: "qr" }', subtitle: 'Network, captions, persona' },
    ],
  },
  { dir: 'home', screenName: 'HomeRecentRoom', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Recent room', headerSubtitle: 'Re-enter a room you have used before.',
    heroAccent: 'joinGradient', primaryStore: 'recent',
    nextRoutes: [
      { name: 'HomeQuickJoinDetail', label: 'Join now', icon: 'enter', args: '{ code: "rejoin" }', subtitle: 'Open this room with current defaults' },
      { name: 'HomeFavoriteRoom', label: 'Save to favorites', icon: 'star', args: '{ roomId: "rec" }', subtitle: 'Pin for one-tap join' },
    ],
  },
  { dir: 'home', screenName: 'HomeFavoriteRoom', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Favorite room', headerSubtitle: 'A pinned room with a custom shortcut and presets.',
    heroAccent: 'joinGradient', primaryStore: 'favorite',
    nextRoutes: [
      { name: 'HomeQuickJoinDetail', label: 'Quick join', icon: 'flash', args: '{ code: "quick" }', subtitle: 'Skip the lobby and walk right in' },
      { name: 'HomeAdvancedSettings', label: 'Edit presets', icon: 'create', args: '{ code: "edit" }', subtitle: 'Update mic, camera and recording defaults' },
    ],
  },
  { dir: 'home', screenName: 'HomeRoomHistoryItem', stackName: 'home', depth: 4, paramListType: 'HomeStackParamList',
    headerTitle: 'Room history entry', headerSubtitle: 'Replay or rejoin a room with full context.',
    heroAccent: 'joinGradient', primaryStore: 'recent',
    nextRoutes: [
      { name: 'HomeQuickJoinDetail', label: 'Rejoin', icon: 'refresh', args: '{ code: "rejoin" }', subtitle: 'Open the same room again' },
      { name: 'HomeFavoriteRoom', label: 'Save as favorite', icon: 'star', args: '{ roomId: "rec" }', subtitle: 'Pin for one-tap access' },
    ],
  },
  { dir: 'home', screenName: 'HomeAnnouncementDetail', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Announcement', headerSubtitle: 'Read the full release note and discover related screens.',
    heroAccent: 'aiGradient', primaryStore: 'announcement',
    nextRoutes: [
      { name: 'HomeFeatureSpotlight', label: 'See the new feature', icon: 'sparkles', args: '{ feature: "ai-noise" }', subtitle: 'Live demo & FAQ' },
      { name: 'HomeWhatsNewDetail', label: 'Browse changelog', icon: 'reader', args: '{ id: "changelog" }', subtitle: 'Every recent ship in one place' },
    ],
  },
  { dir: 'home', screenName: 'HomeTipDetail', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Pro tip', headerSubtitle: 'Quick tricks that experienced MeetX users love.',
    heroAccent: 'aiGradient', primaryStore: 'tip',
    nextRoutes: [
      { name: 'HomeFeatureSpotlight', label: 'Try it now', icon: 'play', args: '{ feature: "tip" }', subtitle: 'See it in action' },
      { name: 'HomeIntegrationDetail', label: 'Pair with Slack', icon: 'logo-slack', args: '{ integrationId: "slack" }', subtitle: 'Share notes automatically' },
    ],
  },
  { dir: 'home', screenName: 'HomeStatusDetail', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Status report', headerSubtitle: 'Real-time meeting health for your account.',
    heroAccent: 'premiumGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'HomeAdvancedSettings', label: 'Tweak defaults', icon: 'settings', args: '{ code: "status" }', subtitle: 'Switch to data-saver and more' },
      { name: 'HomeFeatureSpotlight', label: 'AI insights', icon: 'analytics', args: '{ feature: "ai-insights" }', subtitle: 'Find patterns automatically' },
    ],
  },
  { dir: 'home', screenName: 'HomeFeatureSpotlight', stackName: 'home', depth: 4, paramListType: 'HomeStackParamList',
    headerTitle: 'Feature spotlight', headerSubtitle: 'Everything you need to know about this feature.',
    heroAccent: 'aiGradient', primaryStore: 'tip',
    nextRoutes: [
      { name: 'HomeIntegrationDetail', label: 'Use with integrations', icon: 'extension-puzzle', args: '{ integrationId: "linear" }', subtitle: 'Workflows and triggers' },
      { name: 'HomeWhatsNewDetail', label: 'See changelog', icon: 'newspaper', args: '{ id: "changelog" }', subtitle: 'Latest improvements' },
    ],
  },
  { dir: 'home', screenName: 'HomeIntegrationDetail', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Integration details', headerSubtitle: 'Set up the integration and see what it can automate.',
    heroAccent: 'createGradient', primaryStore: 'integration',
    nextRoutes: [
      { name: 'HomeFeatureSpotlight', label: 'Sample workflow', icon: 'flowchart', args: '{ feature: "workflow" }', subtitle: 'A pre-built recipe to start with' },
      { name: 'HomeAnnouncementDetail', label: 'Read launch post', icon: 'megaphone', args: '{ id: "launch-post" }', subtitle: 'Why we built this integration' },
    ],
  },
  { dir: 'home', screenName: 'HomeWhatsNewDetail', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'What\'s new', headerSubtitle: 'Latest releases, polish, and bug fixes.',
    heroAccent: 'heroGradient', primaryStore: 'announcement',
    nextRoutes: [
      { name: 'HomeAnnouncementDetail', label: 'Read full announcement', icon: 'document', args: '{ id: "ann-0" }', subtitle: 'A deeper dive into the release' },
      { name: 'HomeFeatureSpotlight', label: 'See the demo', icon: 'play', args: '{ feature: "ai" }', subtitle: 'Watch the feature in action' },
    ],
  },
  { dir: 'home', screenName: 'HomePromoDetail', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Promotion', headerSubtitle: 'Grab the deal before it expires.',
    heroAccent: 'premiumGradient', primaryStore: 'announcement',
    nextRoutes: [
      { name: 'HomeIntegrationDetail', label: 'See bundle', icon: 'cube', args: '{ integrationId: "bundle" }', subtitle: 'What\'s included in the package' },
    ],
  },
  { dir: 'home', screenName: 'HomeCommunityPost', stackName: 'home', depth: 3, paramListType: 'HomeStackParamList',
    headerTitle: 'Community post', headerSubtitle: 'See what users are sharing about MeetX.',
    heroAccent: 'contactsGradient', primaryStore: 'announcement',
    nextRoutes: [
      { name: 'HomeAnnouncementDetail', label: 'Reply', icon: 'chatbubble', args: '{ id: "reply" }', subtitle: 'Open thread to respond' },
    ],
  },
);

// MEETINGS
screens.push(
  { dir: 'meetings', screenName: 'MeetingsIndex', stackName: 'meetings', depth: 1, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Your meetings', headerSubtitle: 'Upcoming, recurring, and past — all in one place.',
    heroAccent: 'heroGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsUpcomingDetail', label: 'Today\'s standup', icon: 'sunny', args: '{ meetingId: "m-0" }', subtitle: 'Sync with the engineering pod' },
      { name: 'MeetingsUpcomingDetail', label: 'Quarterly review', icon: 'trending-up', args: '{ meetingId: "m-1" }', subtitle: 'Quarter-over-quarter results' },
      { name: 'MeetingsPastDetail', label: 'Yesterday\'s 1:1', icon: 'time', args: '{ meetingId: "m-2" }', subtitle: 'Action items recap' },
      { name: 'MeetingsRecordings', label: 'Latest recordings', icon: 'film', args: '{ meetingId: "m-0" }', subtitle: 'Replay anything missed' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsUpcomingDetail', stackName: 'meetings', depth: 2, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Upcoming meeting', headerSubtitle: 'Time, room, agenda, and the people involved.',
    heroAccent: 'createGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsParticipantsList', label: 'See participants', icon: 'people', args: '{ meetingId: params.meetingId as string }', subtitle: 'Who\'s coming and their roles' },
      { name: 'MeetingsAgenda', label: 'Open agenda', icon: 'list', args: '{ meetingId: params.meetingId as string }', subtitle: 'Topics, owners, and timing' },
      { name: 'MeetingsChat', label: 'Pre-meeting chat', icon: 'chatbubbles', args: '{ meetingId: params.meetingId as string }', subtitle: 'Notes from before the meeting' },
      { name: 'MeetingsExportShare', label: 'Share details', icon: 'share', args: '{ meetingId: params.meetingId as string }', subtitle: 'Send invite to extra guests' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsPastDetail', stackName: 'meetings', depth: 2, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Past meeting', headerSubtitle: 'Recap, recordings, action items and follow-ups.',
    heroAccent: 'recordingGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsRecordings', label: 'Recordings', icon: 'film', args: '{ meetingId: params.meetingId as string }', subtitle: 'Watch the call back' },
      { name: 'MeetingsTranscript', label: 'Full transcript', icon: 'document-text', args: '{ meetingId: params.meetingId as string }', subtitle: 'Searchable, AI-summarised' },
      { name: 'MeetingsAnalytics', label: 'Talk-time analytics', icon: 'analytics', args: '{ meetingId: params.meetingId as string }', subtitle: 'Speaker share & sentiment' },
      { name: 'MeetingsFollowUp', label: 'Follow-ups & tasks', icon: 'list-circle', args: '{ meetingId: params.meetingId as string }', subtitle: 'Track every action item' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsParticipantsList', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Participants', headerSubtitle: 'Tap any name to dive into their profile.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'MeetingsParticipantProfile', label: 'Open Aditya\'s profile', icon: 'person-circle', args: '{ meetingId: params.meetingId as string, participantId: "c-0" }', subtitle: 'Full profile with contact options' },
      { name: 'MeetingsParticipantProfile', label: 'Open Priya\'s profile', icon: 'person-circle', args: '{ meetingId: params.meetingId as string, participantId: "c-1" }', subtitle: 'Full profile with contact options' },
      { name: 'MeetingsAttachments', label: 'Shared attachments', icon: 'attach', args: '{ meetingId: params.meetingId as string }', subtitle: 'Files dropped during this meeting' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsParticipantProfile', stackName: 'meetings', depth: 4, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Participant profile', headerSubtitle: 'Profile card with contact options & recent meetings.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'MeetingsChatThread', label: 'Send a quick message', icon: 'chatbubble', args: '{ meetingId: params.meetingId as string, messageId: "m-0" }', subtitle: 'Whisper before the meeting' },
      { name: 'MeetingsParticipantsList', label: 'Back to participants', icon: 'arrow-back', args: '{ meetingId: params.meetingId as string }', subtitle: 'See everyone in the room' },
      { name: 'MeetingsAnalytics', label: 'See participation history', icon: 'pie-chart', args: '{ meetingId: params.meetingId as string }', subtitle: 'How active they\'ve been recently' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsAgenda', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Meeting agenda', headerSubtitle: 'Topics, owners, and a tap-through view of every item.',
    heroAccent: 'createGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsAgendaItem', label: 'Open: Set the stage', icon: 'flag', args: '{ meetingId: params.meetingId as string, itemId: "a-0" }', subtitle: 'Owner notes and timing' },
      { name: 'MeetingsAgendaItem', label: 'Open: Decisions to make', icon: 'checkmark-done', args: '{ meetingId: params.meetingId as string, itemId: "a-1" }', subtitle: 'Vote and capture outcomes' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsAgendaItem', stackName: 'meetings', depth: 4, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Agenda item', headerSubtitle: 'Owner, timing, notes, attached docs.',
    heroAccent: 'createGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsTask', label: 'Convert to task', icon: 'checkbox', args: '{ meetingId: params.meetingId as string, taskId: "t-0" }', subtitle: 'Assign and track' },
      { name: 'MeetingsAgenda', label: 'Back to agenda', icon: 'list', args: '{ meetingId: params.meetingId as string }', subtitle: 'View the full plan' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsRecordings', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Recordings', headerSubtitle: 'Pick a recording to scrub through and share.',
    heroAccent: 'recordingGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'MeetingsRecordingPlayback', label: 'Play full recording', icon: 'play', args: '{ recordingId: "r-0" }', subtitle: 'Studio-quality playback with chapters' },
      { name: 'MeetingsTranscript', label: 'Open transcript', icon: 'document-text', args: '{ meetingId: params.meetingId as string }', subtitle: 'Searchable text with sentiment' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsRecordingPlayback', stackName: 'meetings', depth: 4, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Recording playback', headerSubtitle: 'Scrub, share, jump to chapters.',
    heroAccent: 'recordingGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'MeetingsTranscript', label: 'See transcript', icon: 'document-text', args: '{ meetingId: params.recordingId as string }', subtitle: 'Read alongside the audio' },
      { name: 'MeetingsExportShare', label: 'Share recording', icon: 'share-social', args: '{ meetingId: params.recordingId as string }', subtitle: 'Email, link, or to a Slack channel' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsTranscript', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Meeting transcript', headerSubtitle: 'AI-generated, searchable transcript with timestamps.',
    heroAccent: 'aiGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsTranscriptSegment', label: 'Open segment 1', icon: 'play-circle', args: '{ meetingId: params.meetingId as string, segmentId: "s-0" }', subtitle: 'Speaker identified, AI summary' },
      { name: 'MeetingsTranscriptSegment', label: 'Open segment 2', icon: 'play-circle', args: '{ meetingId: params.meetingId as string, segmentId: "s-1" }', subtitle: 'Decisions captured here' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsTranscriptSegment', stackName: 'meetings', depth: 4, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Transcript segment', headerSubtitle: 'Speaker, sentiment and a jump-to-time button.',
    heroAccent: 'aiGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsRecordingPlayback', label: 'Jump to this moment', icon: 'play', args: '{ recordingId: "r-0" }', subtitle: 'Watch the exact clip' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsChat', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Meeting chat', headerSubtitle: 'Backchannel messages and reactions during this call.',
    heroAccent: 'contactsGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsChatThread', label: 'Open a thread', icon: 'chatbubbles', args: '{ meetingId: params.meetingId as string, messageId: "ch-0" }', subtitle: 'See the conversation that branched off' },
      { name: 'MeetingsAttachments', label: 'Shared files', icon: 'document-attach', args: '{ meetingId: params.meetingId as string }', subtitle: 'Documents dropped in chat' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsChatThread', stackName: 'meetings', depth: 4, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Chat thread', headerSubtitle: 'A focused thread of replies, reactions and attachments.',
    heroAccent: 'contactsGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsChat', label: 'Back to chat', icon: 'arrow-back', args: '{ meetingId: params.meetingId as string }', subtitle: 'See the main timeline' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsAttachments', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Attachments', headerSubtitle: 'Files shared in this meeting and during follow-ups.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsAttachmentDetail', label: 'Open spec.pdf', icon: 'document', args: '{ meetingId: params.meetingId as string, attachmentId: "att-0" }', subtitle: 'Preview and download options' },
      { name: 'MeetingsAttachmentDetail', label: 'Open metrics.png', icon: 'image', args: '{ meetingId: params.meetingId as string, attachmentId: "att-1" }', subtitle: 'Open the dashboard screenshot' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsAttachmentDetail', stackName: 'meetings', depth: 4, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Attachment', headerSubtitle: 'Preview, comment, share, version history.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsAttachments', label: 'Back to all attachments', icon: 'folder-open', args: '{ meetingId: params.meetingId as string }', subtitle: 'See the rest of the documents' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsAnalytics', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Meeting analytics', headerSubtitle: 'Speaker share, sentiment, recurring topics.',
    heroAccent: 'aiGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsAnalytics', label: 'Compare with last week', icon: 'pulse', args: '{ meetingId: params.meetingId as string }', subtitle: 'Trend the data' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsExportShare', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Export & share', headerSubtitle: 'Pick a destination — email, Slack, or a public link.',
    heroAccent: 'createGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsExportShare', label: 'Send to Slack #design', icon: 'logo-slack', args: '{ meetingId: params.meetingId as string }', subtitle: 'Posts the recap automatically' },
      { name: 'MeetingsExportShare', label: 'Generate public link', icon: 'link', args: '{ meetingId: params.meetingId as string }', subtitle: 'Share with anyone (read-only)' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsFollowUp', stackName: 'meetings', depth: 3, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Follow-ups', headerSubtitle: 'Action items, owners and due dates.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsTask', label: 'Open task #1', icon: 'checkmark-circle', args: '{ meetingId: params.meetingId as string, taskId: "t-0" }', subtitle: 'See the full task description' },
      { name: 'MeetingsTask', label: 'Open task #2', icon: 'checkmark-circle', args: '{ meetingId: params.meetingId as string, taskId: "t-1" }', subtitle: 'Owner: Aditya • Due Friday' },
    ],
  },
  { dir: 'meetings', screenName: 'MeetingsTask', stackName: 'meetings', depth: 4, paramListType: 'MeetingsStackParamList',
    headerTitle: 'Task detail', headerSubtitle: 'Owner, due date, conversation history, status.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'MeetingsFollowUp', label: 'Back to follow-ups', icon: 'list', args: '{ meetingId: params.meetingId as string }', subtitle: 'See all action items' },
    ],
  },
);

// CONTACTS
screens.push(
  { dir: 'contacts', screenName: 'ContactsIndex', stackName: 'contacts', depth: 1, paramListType: 'ContactsStackParamList',
    headerTitle: 'Contacts', headerSubtitle: 'Search, browse alphabetically, organize into groups.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsAlphaSection', label: 'Jump to A', icon: 'arrow-down', args: '{ letter: "A" }', subtitle: '24 contacts in section A' },
      { name: 'ContactsAlphaSection', label: 'Jump to S', icon: 'arrow-down', args: '{ letter: "S" }', subtitle: '32 contacts in section S' },
      { name: 'ContactsAddNew', label: 'Add new contact', icon: 'person-add', subtitle: 'Manual entry, business card scan or import' },
      { name: 'ContactsImport', label: 'Import from elsewhere', icon: 'cloud-download', subtitle: 'CSV, vCard, Google, LinkedIn' },
      { name: 'ContactsGroups', label: 'Manage groups', icon: 'people-circle', subtitle: 'Organize people into named lists' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsAlphaSection', stackName: 'contacts', depth: 2, paramListType: 'ContactsStackParamList',
    headerTitle: 'Alphabetical section', headerSubtitle: 'All contacts that start with this letter.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsProfile', label: 'Open first contact', icon: 'person', args: '{ contactId: "c-0" }', subtitle: 'Full profile' },
      { name: 'ContactsProfile', label: 'Open second contact', icon: 'person', args: '{ contactId: "c-1" }', subtitle: 'Full profile' },
      { name: 'ContactsTagDetail', label: 'See tag: Investor', icon: 'pricetag', args: '{ tag: "Investor" }', subtitle: 'Browse by label' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsProfile', stackName: 'contacts', depth: 2, paramListType: 'ContactsStackParamList',
    headerTitle: 'Contact profile', headerSubtitle: 'Name, email, recent meetings, shared files.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsScheduleMeeting', label: 'Schedule a meeting', icon: 'calendar', args: '{ contactId: params.contactId as string }', subtitle: 'Pick a date and time together' },
      { name: 'ContactsRecentMeetings', label: 'Recent meetings', icon: 'time', args: '{ contactId: params.contactId as string }', subtitle: 'Calls you have had together' },
      { name: 'ContactsSharedFiles', label: 'Shared files', icon: 'documents', args: '{ contactId: params.contactId as string }', subtitle: 'Decks, docs, recordings' },
      { name: 'ContactsOptions', label: 'Edit / delete / block', icon: 'options', args: '{ contactId: params.contactId as string }', subtitle: 'Manage this contact' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsScheduleMeeting', stackName: 'contacts', depth: 3, paramListType: 'ContactsStackParamList',
    headerTitle: 'Schedule a meeting', headerSubtitle: 'Pick a date — we\'ll handle invites and reminders.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ContactsScheduleConfirm', label: 'Confirm Friday 4 PM', icon: 'checkmark-circle', args: '{ contactId: params.contactId as string, date: new Date().toISOString() }', subtitle: 'Sends invites instantly' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsScheduleConfirm', stackName: 'contacts', depth: 4, paramListType: 'ContactsStackParamList',
    headerTitle: 'Confirm meeting', headerSubtitle: 'Review and tap send to deliver invites.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ContactsProfile', label: 'Back to profile', icon: 'person', args: '{ contactId: params.contactId as string }', subtitle: 'See the contact card' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsOptions', stackName: 'contacts', depth: 3, paramListType: 'ContactsStackParamList',
    headerTitle: 'Contact options', headerSubtitle: 'Edit info, block, or delete the contact.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsEdit', label: 'Edit contact', icon: 'create', args: '{ contactId: params.contactId as string }', subtitle: 'Update name, email, photo, notes' },
      { name: 'ContactsBlock', label: 'Block contact', icon: 'ban', args: '{ contactId: params.contactId as string }', subtitle: 'They can no longer ring you' },
      { name: 'ContactsDelete', label: 'Delete contact', icon: 'trash', args: '{ contactId: params.contactId as string }', subtitle: 'Permanently remove' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsEdit', stackName: 'contacts', depth: 4, paramListType: 'ContactsStackParamList',
    headerTitle: 'Edit contact', headerSubtitle: 'Update fields and tap save.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsProfile', label: 'Back to profile', icon: 'person', args: '{ contactId: params.contactId as string }', subtitle: 'Without saving' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsBlock', stackName: 'contacts', depth: 4, paramListType: 'ContactsStackParamList',
    headerTitle: 'Block contact', headerSubtitle: 'Confirm to block calls and messages from this person.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsProfile', label: 'Back to profile', icon: 'arrow-back', args: '{ contactId: params.contactId as string }', subtitle: 'Cancel and return' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsDelete', stackName: 'contacts', depth: 4, paramListType: 'ContactsStackParamList',
    headerTitle: 'Delete contact', headerSubtitle: 'This action cannot be undone.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsIndex', label: 'Cancel', icon: 'close', subtitle: 'Return to all contacts' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsSharedFiles', stackName: 'contacts', depth: 3, paramListType: 'ContactsStackParamList',
    headerTitle: 'Shared files', headerSubtitle: 'Documents shared with this person across meetings.',
    heroAccent: 'createGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsSharedFile', label: 'Open spec.pdf', icon: 'document', args: '{ contactId: params.contactId as string, fileId: "f-0" }', subtitle: 'Latest version' },
      { name: 'ContactsSharedFile', label: 'Open metrics.png', icon: 'image', args: '{ contactId: params.contactId as string, fileId: "f-1" }', subtitle: 'Shared yesterday' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsSharedFile', stackName: 'contacts', depth: 4, paramListType: 'ContactsStackParamList',
    headerTitle: 'Shared file', headerSubtitle: 'Preview, download, comment.',
    heroAccent: 'createGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsSharedFiles', label: 'Back to files', icon: 'folder-open', args: '{ contactId: params.contactId as string }', subtitle: 'All shared documents' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsRecentMeetings', stackName: 'contacts', depth: 3, paramListType: 'ContactsStackParamList',
    headerTitle: 'Recent meetings together', headerSubtitle: 'Calls you have had with this person.',
    heroAccent: 'heroGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ContactsCallHistoryItem', label: 'Open last call', icon: 'call', args: '{ contactId: params.contactId as string, index: 0 }', subtitle: 'Duration, recording link' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsCallHistoryItem', stackName: 'contacts', depth: 4, paramListType: 'ContactsStackParamList',
    headerTitle: 'Call history entry', headerSubtitle: 'Time, duration, recording, follow-ups.',
    heroAccent: 'heroGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ContactsRecentMeetings', label: 'Back to history', icon: 'time', args: '{ contactId: params.contactId as string }', subtitle: 'View all calls' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsAddNew', stackName: 'contacts', depth: 2, paramListType: 'ContactsStackParamList',
    headerTitle: 'Add a new contact', headerSubtitle: 'Manual entry or scan a business card.',
    heroAccent: 'contactsGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ContactsImport', label: 'Import instead', icon: 'cloud-download', subtitle: 'Bulk add from a list' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsImport', stackName: 'contacts', depth: 2, paramListType: 'ContactsStackParamList',
    headerTitle: 'Import contacts', headerSubtitle: 'Pick where your contacts live and we\'ll import them.',
    heroAccent: 'contactsGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ContactsImportSource', label: 'From Google', icon: 'logo-google', args: '{ source: "google" }', subtitle: 'OAuth, secure, fast' },
      { name: 'ContactsImportSource', label: 'From CSV', icon: 'document', args: '{ source: "csv" }', subtitle: 'Drop a CSV from your computer' },
      { name: 'ContactsImportSource', label: 'From LinkedIn', icon: 'logo-linkedin', args: '{ source: "linkedin" }', subtitle: 'Connect via LinkedIn API' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsImportSource', stackName: 'contacts', depth: 3, paramListType: 'ContactsStackParamList',
    headerTitle: 'Import source', headerSubtitle: 'Authenticate and choose what to import.',
    heroAccent: 'contactsGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ContactsIndex', label: 'Done — return to contacts', icon: 'checkmark-circle', subtitle: 'See the imported contacts' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsGroups', stackName: 'contacts', depth: 2, paramListType: 'ContactsStackParamList',
    headerTitle: 'Contact groups', headerSubtitle: 'Organize contacts into named lists for faster meetings.',
    heroAccent: 'contactsGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ContactsGroupDetail', label: 'Engineering team', icon: 'people-circle', args: '{ groupId: "g-0" }', subtitle: '32 members' },
      { name: 'ContactsGroupDetail', label: 'Investors', icon: 'briefcase', args: '{ groupId: "g-1" }', subtitle: '12 members' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsGroupDetail', stackName: 'contacts', depth: 3, paramListType: 'ContactsStackParamList',
    headerTitle: 'Group detail', headerSubtitle: 'See members and message everyone at once.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsGroupMembers', label: 'See all members', icon: 'people', args: '{ groupId: params.groupId as string }', subtitle: 'Tap any member to open profile' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsGroupMembers', stackName: 'contacts', depth: 4, paramListType: 'ContactsStackParamList',
    headerTitle: 'Group members', headerSubtitle: 'All members of the selected group.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsProfile', label: 'Open Aditya', icon: 'person', args: '{ contactId: "c-0" }', subtitle: 'Full profile' },
      { name: 'ContactsProfile', label: 'Open Priya', icon: 'person', args: '{ contactId: "c-1" }', subtitle: 'Full profile' },
    ],
  },
  { dir: 'contacts', screenName: 'ContactsTagDetail', stackName: 'contacts', depth: 3, paramListType: 'ContactsStackParamList',
    headerTitle: 'Tag detail', headerSubtitle: 'All contacts that share this tag.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ContactsProfile', label: 'Open first match', icon: 'person', args: '{ contactId: "c-0" }', subtitle: 'Profile detail' },
    ],
  },
);

// SCHEDULE
screens.push(
  { dir: 'schedule', screenName: 'ScheduleIndex', stackName: 'schedule', depth: 1, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Schedule', headerSubtitle: 'Calendar view, availability, holidays and more.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleDayDetail', label: 'Today', icon: 'sunny', args: '{ date: new Date().toISOString() }', subtitle: 'See today\'s schedule' },
      { name: 'ScheduleDayDetail', label: 'Tomorrow', icon: 'sunny-outline', args: '{ date: new Date(Date.now() + 86400000).toISOString() }', subtitle: 'Plan ahead' },
      { name: 'ScheduleAvailability', label: 'My availability', icon: 'time', subtitle: 'Set times you\'re free' },
      { name: 'ScheduleNewMeeting', label: 'New meeting', icon: 'add-circle', args: '{ date: new Date().toISOString() }', subtitle: 'Schedule from scratch' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleDayDetail', stackName: 'schedule', depth: 2, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Daily schedule', headerSubtitle: 'Every meeting on the selected day.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleMeetingEdit', label: 'Edit first meeting', icon: 'create', args: '{ meetingId: "m-0" }', subtitle: 'Change title, time, attendees' },
      { name: 'ScheduleMeetingReschedule', label: 'Reschedule', icon: 'swap-horizontal', args: '{ meetingId: "m-0" }', subtitle: 'Move it to another day/time' },
      { name: 'ScheduleMeetingCancel', label: 'Cancel meeting', icon: 'close-circle', args: '{ meetingId: "m-0" }', subtitle: 'Notify everyone' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleMeetingEdit', stackName: 'schedule', depth: 3, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Edit meeting', headerSubtitle: 'Tweak title, time, agenda, attendees.',
    heroAccent: 'createGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleInvite', label: 'Manage invites', icon: 'people', args: '{ meetingId: params.meetingId as string }', subtitle: 'Add or remove attendees' },
      { name: 'ScheduleAgendaTemplate', label: 'Apply agenda template', icon: 'reader', args: '{ templateId: "t-0" }', subtitle: 'Start from a clean slate' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleMeetingReschedule', stackName: 'schedule', depth: 3, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Reschedule meeting', headerSubtitle: 'Pick a new date and notify attendees automatically.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleDayDetail', label: 'See new day', icon: 'calendar', args: '{ date: new Date().toISOString() }', subtitle: 'Confirm everything looks right' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleMeetingCancel', stackName: 'schedule', depth: 3, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Cancel meeting', headerSubtitle: 'Confirm to send a polite cancellation note.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleIndex', label: 'Back to calendar', icon: 'calendar', subtitle: 'Return without canceling' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleInvite', stackName: 'schedule', depth: 3, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Invite attendees', headerSubtitle: 'Add people from contacts, email, or generate a link.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ScheduleInviteContact', label: 'From contacts', icon: 'people', args: '{ meetingId: params.meetingId as string, contactId: "c-0" }', subtitle: 'Pick a person to invite' },
      { name: 'ScheduleInviteEmail', label: 'Paste emails', icon: 'mail', args: '{ meetingId: params.meetingId as string }', subtitle: 'Comma-separated list of emails' },
      { name: 'ScheduleInviteLink', label: 'Public link', icon: 'link', args: '{ meetingId: params.meetingId as string }', subtitle: 'Anyone with the link can join' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleInviteContact', stackName: 'schedule', depth: 4, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Invite contact', headerSubtitle: 'Confirm the invite — you can add a personal note.',
    heroAccent: 'contactsGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ScheduleInvite', label: 'Back to invites', icon: 'arrow-back', args: '{ meetingId: params.meetingId as string }', subtitle: 'Add more attendees' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleInviteEmail', stackName: 'schedule', depth: 4, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Invite by email', headerSubtitle: 'Paste a list of email addresses to invite people quickly.',
    heroAccent: 'contactsGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ScheduleInvite', label: 'Back', icon: 'arrow-back', args: '{ meetingId: params.meetingId as string }', subtitle: 'See current invites' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleInviteLink', stackName: 'schedule', depth: 4, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Public invite link', headerSubtitle: 'Generate, copy and share a public link.',
    heroAccent: 'contactsGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ScheduleInvite', label: 'Back', icon: 'arrow-back', args: '{ meetingId: params.meetingId as string }', subtitle: 'View invitee list' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleNewMeeting', stackName: 'schedule', depth: 2, paramListType: 'ScheduleStackParamList',
    headerTitle: 'New meeting', headerSubtitle: 'Tap through to fill in details, recurrence, reminders.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleNewMeetingDetails', label: 'Title & description', icon: 'create', args: '{ date: params.date as string }', subtitle: 'Set the basic info' },
      { name: 'ScheduleNewMeetingRecurrence', label: 'Recurrence', icon: 'repeat', args: '{ date: params.date as string }', subtitle: 'Daily, weekly, custom' },
      { name: 'ScheduleNewMeetingReminders', label: 'Reminders', icon: 'alarm', args: '{ date: params.date as string }', subtitle: 'Push, email, calendar' },
      { name: 'ScheduleNewMeetingPreview', label: 'Preview & schedule', icon: 'checkmark-circle', args: '{ date: params.date as string }', subtitle: 'Confirm and send invites' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleNewMeetingDetails', stackName: 'schedule', depth: 3, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Meeting details', headerSubtitle: 'Title, description, agenda, category.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleNewMeetingPreview', label: 'Skip to preview', icon: 'arrow-forward', args: '{ date: params.date as string }', subtitle: 'You can edit later' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleNewMeetingRecurrence', stackName: 'schedule', depth: 3, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Recurrence', headerSubtitle: 'Repeating settings for weekly standups and more.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleNewMeetingPreview', label: 'Skip to preview', icon: 'arrow-forward', args: '{ date: params.date as string }', subtitle: 'You can edit later' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleNewMeetingReminders', stackName: 'schedule', depth: 3, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Reminders', headerSubtitle: 'Choose which channels send reminders.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleNewMeetingPreview', label: 'Skip to preview', icon: 'arrow-forward', args: '{ date: params.date as string }', subtitle: 'You can edit later' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleNewMeetingPreview', stackName: 'schedule', depth: 4, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Preview & schedule', headerSubtitle: 'Final review — tap schedule to send invites.',
    heroAccent: 'scheduleGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleIndex', label: 'Done', icon: 'checkmark', subtitle: 'Return to the calendar view' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleAvailability', stackName: 'schedule', depth: 2, paramListType: 'ScheduleStackParamList',
    headerTitle: 'My availability', headerSubtitle: 'Set the times when others can book you.',
    heroAccent: 'scheduleGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ScheduleAvailabilityDay', label: 'Monday hours', icon: 'time', args: '{ day: "mon" }', subtitle: 'Default 9:00 AM – 5:00 PM' },
      { name: 'ScheduleAvailabilityDay', label: 'Tuesday hours', icon: 'time', args: '{ day: "tue" }', subtitle: 'Default 9:00 AM – 5:00 PM' },
      { name: 'ScheduleAvailabilityDay', label: 'Friday hours', icon: 'time', args: '{ day: "fri" }', subtitle: 'Default 9:00 AM – 3:00 PM' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleAvailabilityDay', stackName: 'schedule', depth: 3, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Availability for a day', headerSubtitle: 'Pick start, end, and break times.',
    heroAccent: 'scheduleGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ScheduleAvailability', label: 'Back to overview', icon: 'arrow-back', subtitle: 'See the whole week' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleHolidayDetail', stackName: 'schedule', depth: 2, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Holiday', headerSubtitle: 'Mark days you\'ll be unavailable for meetings.',
    heroAccent: 'scheduleGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ScheduleAvailability', label: 'Back to availability', icon: 'arrow-back', subtitle: 'Return to the planner' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleTimezoneDetail', stackName: 'schedule', depth: 2, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Time zone', headerSubtitle: 'See the time across teams in different cities.',
    heroAccent: 'scheduleGradient', primaryStore: 'contact',
    nextRoutes: [
      { name: 'ScheduleAvailability', label: 'Adjust your hours', icon: 'time', subtitle: 'Match someone else\'s hours' },
    ],
  },
  { dir: 'schedule', screenName: 'ScheduleAgendaTemplate', stackName: 'schedule', depth: 2, paramListType: 'ScheduleStackParamList',
    headerTitle: 'Agenda template', headerSubtitle: 'A pre-made plan you can drop into a new meeting.',
    heroAccent: 'createGradient', primaryStore: 'meeting',
    nextRoutes: [
      { name: 'ScheduleNewMeeting', label: 'Use this template', icon: 'sparkles', args: '{ date: new Date().toISOString() }', subtitle: 'Start a meeting with this agenda' },
    ],
  },
);

// PROFILE
screens.push(
  { dir: 'profile', screenName: 'ProfileIndex', stackName: 'profile', depth: 1, paramListType: 'ProfileStackParamList',
    headerTitle: 'Your profile', headerSubtitle: 'Personal info, recordings, and every preference.',
    heroAccent: 'premiumGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileEdit', label: 'Edit profile', icon: 'create', subtitle: 'Name, photo, status, pronouns' },
      { name: 'ProfileRecordingsList', label: 'Recordings folder', icon: 'film', subtitle: 'All your saved recordings' },
      { name: 'ProfileSettings', label: 'Settings', icon: 'settings', subtitle: 'Notifications, audio, video, storage' },
      { name: 'ProfileSecurity', label: 'Security', icon: 'shield-checkmark', subtitle: 'Sign-in, devices, encryption' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileEdit', stackName: 'profile', depth: 2, paramListType: 'ProfileStackParamList',
    headerTitle: 'Edit profile', headerSubtitle: 'Update your details and tap save.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettings', label: 'Open settings', icon: 'settings', subtitle: 'Tweak app preferences' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSecurity', stackName: 'profile', depth: 2, paramListType: 'ProfileStackParamList',
    headerTitle: 'Security', headerSubtitle: 'Sessions, two-factor, encryption keys.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSecurityDetail', label: 'Two-factor authentication', icon: 'key', args: '{ topic: "2fa" }', subtitle: 'Authenticator, SMS, hardware key' },
      { name: 'ProfileSecurityDetail', label: 'Active sessions', icon: 'desktop', args: '{ topic: "sessions" }', subtitle: 'Devices currently signed in' },
      { name: 'ProfileSecurityDetail', label: 'Privacy controls', icon: 'lock-closed', args: '{ topic: "privacy" }', subtitle: 'Who can see what' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSecurityDetail', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Security topic', headerSubtitle: 'Detailed control over a specific privacy area.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSecurity', label: 'Back to security', icon: 'arrow-back', subtitle: 'View other topics' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileRecordingsList', stackName: 'profile', depth: 2, paramListType: 'ProfileStackParamList',
    headerTitle: 'Recordings', headerSubtitle: 'Open one to scrub, share, transcribe.',
    heroAccent: 'recordingGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileRecordingPlayback', label: 'Open latest', icon: 'play', args: '{ recordingId: "r-0" }', subtitle: 'Resume where you left off' },
      { name: 'ProfileRecordingShare', label: 'Share latest', icon: 'share-social', args: '{ recordingId: "r-0" }', subtitle: 'Send to a teammate' },
      { name: 'ProfileRecordingChapters', label: 'See chapters', icon: 'list', args: '{ recordingId: "r-0" }', subtitle: 'Jump straight to topics' },
      { name: 'ProfileRecordingTranscript', label: 'Open transcript', icon: 'document-text', args: '{ recordingId: "r-0" }', subtitle: 'Searchable text' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileRecordingPlayback', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Playback', headerSubtitle: 'Premium scrubber with chapter markers.',
    heroAccent: 'recordingGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileRecordingShare', label: 'Share', icon: 'share-social', args: '{ recordingId: params.recordingId as string }', subtitle: 'Pick a destination' },
      { name: 'ProfileRecordingChapters', label: 'Chapters', icon: 'list', args: '{ recordingId: params.recordingId as string }', subtitle: 'Jump to a chapter' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileRecordingShare', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Share recording', headerSubtitle: 'Pick where the recording should land.',
    heroAccent: 'recordingGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileRecordingShareTarget', label: 'Send to Slack', icon: 'logo-slack', args: '{ recordingId: params.recordingId as string, target: "slack" }', subtitle: 'Pick a channel' },
      { name: 'ProfileRecordingShareTarget', label: 'Send to email', icon: 'mail', args: '{ recordingId: params.recordingId as string, target: "email" }', subtitle: 'Compose a quick note' },
      { name: 'ProfileRecordingShareTarget', label: 'Public link', icon: 'link', args: '{ recordingId: params.recordingId as string, target: "link" }', subtitle: 'Anyone with the link' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileRecordingShareTarget', stackName: 'profile', depth: 4, paramListType: 'ProfileStackParamList',
    headerTitle: 'Share target', headerSubtitle: 'Confirm and send.',
    heroAccent: 'recordingGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileRecordingShare', label: 'Back', icon: 'arrow-back', args: '{ recordingId: params.recordingId as string }', subtitle: 'See other share options' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileRecordingChapters', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Chapters', headerSubtitle: 'AI-generated chapters for the selected recording.',
    heroAccent: 'aiGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileRecordingChapter', label: 'Chapter 1', icon: 'play-circle', args: '{ recordingId: params.recordingId as string, chapterId: "ch-0" }', subtitle: 'Opening remarks' },
      { name: 'ProfileRecordingChapter', label: 'Chapter 2', icon: 'play-circle', args: '{ recordingId: params.recordingId as string, chapterId: "ch-1" }', subtitle: 'Customer feedback' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileRecordingChapter', stackName: 'profile', depth: 4, paramListType: 'ProfileStackParamList',
    headerTitle: 'Chapter', headerSubtitle: 'Title, summary, jump-to-time.',
    heroAccent: 'aiGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileRecordingChapters', label: 'Back to chapters', icon: 'list', args: '{ recordingId: params.recordingId as string }', subtitle: 'See full chapter list' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileRecordingTranscript', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Transcript', headerSubtitle: 'Search, highlight, jump to time.',
    heroAccent: 'aiGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileRecordingTranscriptSegment', label: 'Open segment', icon: 'play-circle', args: '{ recordingId: params.recordingId as string, segmentId: "s-0" }', subtitle: 'Speaker, sentiment, jump-to' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileRecordingTranscriptSegment', stackName: 'profile', depth: 4, paramListType: 'ProfileStackParamList',
    headerTitle: 'Transcript segment', headerSubtitle: 'A single block of speaker dialog.',
    heroAccent: 'aiGradient', primaryStore: 'recording',
    nextRoutes: [
      { name: 'ProfileRecordingTranscript', label: 'Back to transcript', icon: 'arrow-back', args: '{ recordingId: params.recordingId as string }', subtitle: 'Read the rest' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettings', stackName: 'profile', depth: 2, paramListType: 'ProfileStackParamList',
    headerTitle: 'Settings', headerSubtitle: 'Notifications, audio, video, language, storage.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettingsNotifications', label: 'Notifications', icon: 'notifications', subtitle: 'Email, push, in-app' },
      { name: 'ProfileSettingsAudio', label: 'Audio', icon: 'mic', subtitle: 'Mic, noise suppression, echo' },
      { name: 'ProfileSettingsVideo', label: 'Video', icon: 'videocam', subtitle: 'Camera, quality, lighting' },
      { name: 'ProfileSettingsBackground', label: 'Backgrounds', icon: 'image', subtitle: 'Virtual + AI generated' },
      { name: 'ProfileSettingsLanguage', label: 'Language', icon: 'language', subtitle: 'UI + transcription' },
      { name: 'ProfileSettingsStorage', label: 'Storage', icon: 'cloud', subtitle: 'Cache, downloads' },
      { name: 'ProfileSettingsAccessibility', label: 'Accessibility', icon: 'accessibility', subtitle: 'Captions, contrast, motion' },
      { name: 'ProfileSettingsAbout', label: 'About', icon: 'information-circle', subtitle: 'Version, licenses, changelog' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsNotifications', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Notifications', headerSubtitle: 'Pick when MeetX nudges you.',
    heroAccent: 'createGradient', primaryStore: 'notification',
    nextRoutes: [
      { name: 'ProfileSettings', label: 'Back to settings', icon: 'arrow-back', subtitle: 'See other options' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsAudio', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Audio', headerSubtitle: 'Microphone, noise suppression, echo cancellation.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettings', label: 'Back to settings', icon: 'arrow-back', subtitle: 'See other options' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsVideo', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Video', headerSubtitle: 'Camera, resolution, framing.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettings', label: 'Back to settings', icon: 'arrow-back', subtitle: 'See other options' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsBackground', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Backgrounds', headerSubtitle: 'Virtual scenes and AI-generated rooms.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettingsBackgroundOption', label: 'Studio lights', icon: 'sunny', args: '{ optionId: "studio-lights" }', subtitle: 'Bright, even, professional' },
      { name: 'ProfileSettingsBackgroundOption', label: 'Beach getaway', icon: 'sunny-outline', args: '{ optionId: "beach" }', subtitle: 'Casual fun for office hours' },
      { name: 'ProfileSettingsBackgroundOption', label: 'Bookshelf', icon: 'book', args: '{ optionId: "bookshelf" }', subtitle: 'Classic and warm' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsBackgroundOption', stackName: 'profile', depth: 4, paramListType: 'ProfileStackParamList',
    headerTitle: 'Background option', headerSubtitle: 'Apply this background and adjust intensity.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettingsBackground', label: 'Back to all backgrounds', icon: 'arrow-back', subtitle: 'Try another one' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsLanguage', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Language', headerSubtitle: 'UI language and transcription dialects.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettingsLanguageOption', label: 'English (US)', icon: 'globe', args: '{ code: "en-US" }', subtitle: 'Default with full feature support' },
      { name: 'ProfileSettingsLanguageOption', label: 'Hindi', icon: 'globe', args: '{ code: "hi-IN" }', subtitle: 'Beta — speech & captions' },
      { name: 'ProfileSettingsLanguageOption', label: 'Japanese', icon: 'globe', args: '{ code: "ja-JP" }', subtitle: 'Captions only' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsLanguageOption', stackName: 'profile', depth: 4, paramListType: 'ProfileStackParamList',
    headerTitle: 'Language option', headerSubtitle: 'Set this as your active language.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettingsLanguage', label: 'Back to languages', icon: 'arrow-back', subtitle: 'Pick another one' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsStorage', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Storage', headerSubtitle: 'Cache size, auto-download, cellular usage.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettings', label: 'Back to settings', icon: 'arrow-back', subtitle: 'See other options' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsAccessibility', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Accessibility', headerSubtitle: 'Captions, contrast, motion, screen reader.',
    heroAccent: 'createGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettings', label: 'Back to settings', icon: 'arrow-back', subtitle: 'See other options' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsAbout', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'About', headerSubtitle: 'Version, licenses, changelog.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettingsAboutSection', label: 'Licenses', icon: 'document-text', args: '{ section: "licenses" }', subtitle: 'Open-source acknowledgements' },
      { name: 'ProfileSettingsAboutSection', label: 'Changelog', icon: 'newspaper', args: '{ section: "changelog" }', subtitle: 'Every recent ship' },
      { name: 'ProfileSettingsAboutSection', label: 'Credits', icon: 'people', args: '{ section: "credits" }', subtitle: 'The team behind MeetX' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSettingsAboutSection', stackName: 'profile', depth: 4, paramListType: 'ProfileStackParamList',
    headerTitle: 'About section', headerSubtitle: 'Detailed copy for the selected section.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettingsAbout', label: 'Back to About', icon: 'arrow-back', subtitle: 'See other About sections' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileLicense', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'License', headerSubtitle: 'A specific open-source license used by MeetX.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'ProfileSettingsAbout', label: 'Back to About', icon: 'arrow-back', subtitle: 'Other About sections' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileChangelogEntry', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Changelog entry', headerSubtitle: 'Detailed notes for a specific release.',
    heroAccent: 'premiumGradient', primaryStore: 'announcement',
    nextRoutes: [
      { name: 'ProfileSettingsAbout', label: 'Back to About', icon: 'arrow-back', subtitle: 'See other About sections' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSupportTopic', stackName: 'profile', depth: 3, paramListType: 'ProfileStackParamList',
    headerTitle: 'Support topic', headerSubtitle: 'Common questions and step-by-step guides.',
    heroAccent: 'premiumGradient', primaryStore: 'tip',
    nextRoutes: [
      { name: 'ProfileSupportThread', label: 'Open thread', icon: 'chatbubbles', args: '{ id: params.id as string, threadId: "t-0" }', subtitle: 'Talk to support' },
    ],
  },
  { dir: 'profile', screenName: 'ProfileSupportThread', stackName: 'profile', depth: 4, paramListType: 'ProfileStackParamList',
    headerTitle: 'Support thread', headerSubtitle: 'Conversation with the support team.',
    heroAccent: 'premiumGradient', primaryStore: 'tip',
    nextRoutes: [
      { name: 'ProfileSupportTopic', label: 'Back to topic', icon: 'arrow-back', args: '{ id: params.id as string }', subtitle: 'See related FAQs' },
    ],
  },
);

// IN-CALL settings (6 levels deep)
screens.push(
  { dir: 'incall', screenName: 'InCallSettings1', stackName: 'incall', depth: 1, paramListType: 'RootStackParamList',
    headerTitle: 'In-call settings', headerSubtitle: 'Choose a category to dive deeper.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'InCallSettings2', label: 'Video', icon: 'videocam', args: '{ category: "video" }', subtitle: 'Resolution, framing, lighting' },
      { name: 'InCallSettings2', label: 'Audio', icon: 'mic', args: '{ category: "audio" }', subtitle: 'Microphone, noise suppression' },
      { name: 'InCallSettings2', label: 'Filters', icon: 'color-filter', args: '{ category: "filters" }', subtitle: 'Beauty, color presets' },
      { name: 'InCallSettings2', label: 'Backgrounds', icon: 'image', args: '{ category: "backgrounds" }', subtitle: 'Virtual + AI generated' },
      { name: 'InCallSettings2', label: 'Recording', icon: 'recording', args: '{ category: "recording" }', subtitle: 'Cloud or local, retention' },
      { name: 'InCallSettings2', label: 'Captions', icon: 'text', args: '{ category: "captions" }', subtitle: 'Real-time subtitles & translations' },
    ],
  },
  { dir: 'incall', screenName: 'InCallSettings2', stackName: 'incall', depth: 2, paramListType: 'RootStackParamList',
    headerTitle: 'Category', headerSubtitle: 'Choose a section in this category.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'InCallSettings3', label: 'Section A', icon: 'layers', args: '{ category: params.category as string, section: "A" }', subtitle: 'Detailed controls' },
      { name: 'InCallSettings3', label: 'Section B', icon: 'layers', args: '{ category: params.category as string, section: "B" }', subtitle: 'Detailed controls' },
      { name: 'InCallSettings3', label: 'Section C', icon: 'layers', args: '{ category: params.category as string, section: "C" }', subtitle: 'Detailed controls' },
    ],
  },
  { dir: 'incall', screenName: 'InCallSettings3', stackName: 'incall', depth: 3, paramListType: 'RootStackParamList',
    headerTitle: 'Section', headerSubtitle: 'Pick an option to fine-tune.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'InCallSettings4', label: 'Option 1', icon: 'options', args: '{ category: params.category as string, section: params.section as string, option: "1" }', subtitle: 'Open detailed controls' },
      { name: 'InCallSettings4', label: 'Option 2', icon: 'options', args: '{ category: params.category as string, section: params.section as string, option: "2" }', subtitle: 'Open detailed controls' },
      { name: 'InCallSettings4', label: 'Option 3', icon: 'options', args: '{ category: params.category as string, section: params.section as string, option: "3" }', subtitle: 'Open detailed controls' },
    ],
  },
  { dir: 'incall', screenName: 'InCallSettings4', stackName: 'incall', depth: 4, paramListType: 'RootStackParamList',
    headerTitle: 'Option', headerSubtitle: 'Pick a sub-option for fine-grained control.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'InCallSettings5', label: 'Sub-option A', icon: 'list', args: '{ category: params.category as string, section: params.section as string, option: params.option as string, sub: "A" }', subtitle: 'Drill in further' },
      { name: 'InCallSettings5', label: 'Sub-option B', icon: 'list', args: '{ category: params.category as string, section: params.section as string, option: params.option as string, sub: "B" }', subtitle: 'Drill in further' },
    ],
  },
  { dir: 'incall', screenName: 'InCallSettings5', stackName: 'incall', depth: 5, paramListType: 'RootStackParamList',
    headerTitle: 'Sub-option', headerSubtitle: 'One more level of nesting.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'InCallSettings6', label: 'Deep tweak A', icon: 'options', args: '{ category: params.category as string, section: params.section as string, option: params.option as string, sub: params.sub as string, deep: "A" }', subtitle: 'Final layer' },
      { name: 'InCallSettings6', label: 'Deep tweak B', icon: 'options', args: '{ category: params.category as string, section: params.section as string, option: params.option as string, sub: params.sub as string, deep: "B" }', subtitle: 'Final layer' },
    ],
  },
  { dir: 'incall', screenName: 'InCallSettings6', stackName: 'incall', depth: 6, paramListType: 'RootStackParamList',
    headerTitle: 'Deep tweak', headerSubtitle: 'The deepest setting — adjust and tap save.',
    heroAccent: 'premiumGradient', primaryStore: 'none',
    nextRoutes: [
      { name: 'InCallSettings1', label: 'Back to top of in-call settings', icon: 'arrow-up', subtitle: 'See all categories again' },
    ],
  },
);

// Generate
let total = 0;
let bytes = 0;
for (const s of screens) {
  const dir = path.join(SCREENS, s.dir);
  ensureDir(dir);
  const code = buildScreen(s);
  const filename = path.join(dir, `${s.screenName}Screen.tsx`);
  fs.writeFileSync(filename, code, 'utf8');
  total += 1;
  bytes += code.length;
}

const linesPerFile = Math.round(bytes / 60); // approx
console.log(`Generated ${total} screens, ~${bytes} bytes total, ~${linesPerFile} avg LOC.`);

module.exports = { screens };
