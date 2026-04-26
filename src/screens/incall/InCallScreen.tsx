import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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

import { AnimatedPressable } from '@/components/AnimatedPressable';
import { GradientButton } from '@/components/GradientButton';
import { Avatar } from '@/components/Avatar';
import { Tag } from '@/components/Tag';
import { useTheme } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store/AppStore';
import { useHaptics } from '@/hooks/useHaptics';
import { formatDuration } from '@/utils/format';
import type { RootStackParamList } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'InCall'>;
type Route = RouteProp<RootStackParamList, 'InCall'>;

const REACTIONS = ['👍', '❤️', '😂', '🎉', '🚀', '👏'];

export default function InCallScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const meetingId = route.params?.meetingId ?? 'm-0';
  const { theme } = useTheme();
  const { state, meetingById, participantsForMeeting } = useAppStore();
  const { impact, notify, select } = useHaptics();
  const insets = useSafeAreaInsets();

  const [micOn, setMicOn] = useState(state.preferences.defaultMicOn);
  const [cameraOn, setCameraOn] = useState(state.preferences.defaultCameraOn);
  const [speaker, setSpeaker] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [activeLayout, setActiveLayout] = useState<'gallery' | 'speaker' | 'sidebar' | 'shared'>('gallery');
  const [recording, setRecording] = useState(true);
  const [duration, setDuration] = useState(63);

  const meeting = meetingById(meetingId) ?? state.meetings[0]!;
  const participants = useMemo(() => {
    return [
      { id: 'me', name: state.profile.name, initials: state.profile.initials, avatarColor: state.profile.avatarColor, role: 'host' as const, online: true, micOn, cameraOn, handRaised: false },
      ...participantsForMeeting(meeting.id).map((c) => ({
        id: c.id,
        name: c.name,
        initials: c.initials,
        avatarColor: c.avatarColor,
        role: 'attendee' as const,
        online: true,
        micOn: Math.random() > 0.4,
        cameraOn: Math.random() > 0.5,
        handRaised: Math.random() > 0.85,
      })),
    ].slice(0, 12);
  }, [participantsForMeeting, meeting.id, state.profile, micOn, cameraOn]);

  useEffect(() => {
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulse]);
  const recordingDotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.4, 1]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.85, 1.1]) }],
  }));

  const onLeave = useCallback(() => {
    impact('heavy');
    navigation.goBack();
  }, [impact, navigation]);

  const onSwitchLayout = useCallback(() => {
    select();
    setActiveLayout((l) => {
      switch (l) {
        case 'gallery': return 'speaker';
        case 'speaker': return 'sidebar';
        case 'sidebar': return 'shared';
        case 'shared': return 'gallery';
      }
    });
  }, [select]);

  return (
    <View style={[styles.root, { backgroundColor: '#020308' }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#020308', '#0E1424', '#1F2746']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.headerRow, { paddingTop: insets.top + 12 }]}>
        <BlurView intensity={50} tint="dark" style={styles.headerPill}>
          <Animated.View style={[styles.recordingDot, recordingDotStyle]} />
          <Text style={styles.headerLabel}>{recording ? 'REC' : 'LIVE'} • {formatDuration(duration)}</Text>
          <Text style={[styles.headerLabel, { color: 'rgba(255,255,255,0.65)' }]}>{meeting.title}</Text>
        </BlurView>
        <AnimatedPressable
          onPress={() => navigation.navigate('InCallSettings1')}
          hapticStyle="light"
          containerStyle={styles.headerIconButton}
        >
          <Ionicons name="settings" size={20} color="#FFFFFF" />
        </AnimatedPressable>
        <AnimatedPressable
          onPress={onSwitchLayout}
          hapticStyle="light"
          containerStyle={styles.headerIconButton}
        >
          <Ionicons name="grid" size={20} color="#FFFFFF" />
        </AnimatedPressable>
      </View>

      <View style={styles.gridArea}>
        {participants.slice(0, 6).map((p, idx) => (
          <View
            key={p.id}
            style={[styles.tile, { backgroundColor: 'rgba(255,255,255,0.06)' }]}
          >
            {p.cameraOn ? (
              <LinearGradient
                colors={[p.avatarColor + '99', '#0E1424']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View style={styles.tileNoCamera}>
                <Avatar initials={p.initials} color={p.avatarColor} size={64} />
              </View>
            )}
            <View style={styles.tileLabelRow}>
              <View style={styles.tileLabelPill}>
                <Ionicons name={p.micOn ? 'mic' : 'mic-off'} size={12} color="#FFFFFF" />
                <Text style={styles.tileLabel}>{p.name.split(' ')[0]}{p.role === 'host' ? ' (host)' : ''}</Text>
              </View>
              {p.handRaised ? (
                <View style={[styles.tileLabelPill, { backgroundColor: 'rgba(255,200,0,0.7)' }]}>
                  <Text style={[styles.tileLabel, { color: '#0E1424' }]}>✋</Text>
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 16 }]}>
        <BlurView intensity={45} tint="dark" style={styles.actionBarBlur}>
          <ActionButton
            icon={micOn ? 'mic' : 'mic-off'}
            label={micOn ? 'Mute' : 'Unmute'}
            active={micOn}
            danger={!micOn}
            onPress={() => {
              setMicOn((v) => !v);
              impact('light');
            }}
          />
          <ActionButton
            icon={cameraOn ? 'videocam' : 'videocam-off'}
            label={cameraOn ? 'Camera' : 'Off'}
            active={cameraOn}
            danger={!cameraOn}
            onPress={() => {
              setCameraOn((v) => !v);
              impact('light');
            }}
          />
          <ActionButton
            icon={speaker ? 'volume-high' : 'volume-mute'}
            label={speaker ? 'Speaker' : 'Earpiece'}
            active={speaker}
            onPress={() => {
              setSpeaker((v) => !v);
              select();
            }}
          />
          <ActionButton
            icon="happy"
            label="React"
            onPress={() => {
              setReactionPickerOpen((v) => !v);
              select();
            }}
          />
          <ActionButton
            icon="chatbubble"
            label="Chat"
            badge={chatOpen ? undefined : 4}
            onPress={() => setChatOpen((v) => !v)}
          />
          <ActionButton
            icon="people"
            label="People"
            badge={participants.length}
            onPress={() => setParticipantsOpen((v) => !v)}
          />
          <View style={{ flex: 1 }} />
          <AnimatedPressable
            onPress={onLeave}
            hapticStyle="heavy"
            containerStyle={[styles.leaveButton, { backgroundColor: theme.colors.danger }]}
          >
            <Ionicons name="call" size={20} color="#FFFFFF" />
            <Text style={[styles.leaveLabel]}>Leave</Text>
          </AnimatedPressable>
        </BlurView>
      </View>

      {reactionPickerOpen ? (
        <BlurView intensity={50} tint="dark" style={styles.reactionRow}>
          {REACTIONS.map((r) => (
            <AnimatedPressable
              key={r}
              onPress={() => {
                setReactionPickerOpen(false);
                notify('success');
              }}
              hapticStyle="light"
              containerStyle={styles.reactionBubble}
            >
              <Text style={styles.reactionEmoji}>{r}</Text>
            </AnimatedPressable>
          ))}
        </BlurView>
      ) : null}
    </View>
  );
}

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
  danger?: boolean;
  badge?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onPress, active, danger, badge }) => {
  return (
    <AnimatedPressable
      onPress={onPress}
      hapticStyle="light"
      scale={0.92}
      containerStyle={styles.actionButton}
    >
      <View
        style={[
          styles.actionBubble,
          {
            backgroundColor: danger ? '#FB7185' : active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
          },
        ]}
      >
        <Ionicons name={icon} size={20} color="#FFFFFF" />
        {badge !== undefined ? (
          <View style={styles.actionBadge}>
            <Text style={styles.actionBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  headerPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FB7185',
  },
  headerLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    aspectRatio: 0.9,
    borderRadius: 22,
    overflow: 'hidden',
  },
  tileNoCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,20,36,0.85)',
  },
  tileLabelRow: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileLabelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  tileLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  actionBar: {
    paddingHorizontal: 12,
  },
  actionBarBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,28,48,0.55)',
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  actionBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FB7185',
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    minHeight: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 6,
  },
  leaveLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  reactionRow: {
    position: 'absolute',
    bottom: 116,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,28,48,0.6)',
  },
  reactionBubble: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  reactionEmoji: {
    fontSize: 22,
  },
});
