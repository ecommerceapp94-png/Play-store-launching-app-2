// Shared types for MeetX Ultra Pro
// Every screen in the app references the types declared in this file. Keeping
// them strongly typed lets us safely navigate between hundreds of screens.

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ---------------------------------------------------------------------------
// Domain entities
// ---------------------------------------------------------------------------

export type ID = string;

export type ISODate = string;

export interface Participant {
  id: ID;
  name: string;
  email: string;
  role: 'host' | 'co-host' | 'presenter' | 'attendee' | 'guest';
  avatarColor: string;
  initials: string;
  online: boolean;
  micOn: boolean;
  cameraOn: boolean;
  handRaised: boolean;
  reaction?: string;
  joinedAt?: ISODate;
}

export interface Meeting {
  id: ID;
  title: string;
  description: string;
  startsAt: ISODate;
  durationMinutes: number;
  hostId: ID;
  hostName: string;
  participantIds: ID[];
  roomCode: string;
  passcode?: string;
  recurring: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  category: 'team' | 'client' | 'training' | 'webinar' | '1-on-1' | 'social' | 'all-hands';
  tags: string[];
  agenda: AgendaItem[];
  reminders: Reminder[];
  shareLink: string;
  isLocked: boolean;
  isWaitingRoomEnabled: boolean;
  recordingId?: ID;
  thumbnailColor: string;
}

export interface AgendaItem {
  id: ID;
  title: string;
  durationMinutes: number;
  ownerId?: ID;
  notes?: string;
  done: boolean;
}

export interface Reminder {
  id: ID;
  minutesBefore: number;
  channel: 'push' | 'email' | 'sms' | 'in-app';
}

export interface Contact {
  id: ID;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  department: string;
  city: string;
  country: string;
  timeZone: string;
  avatarColor: string;
  initials: string;
  favorite: boolean;
  blocked: boolean;
  tags: string[];
  notes: string;
  recentMeetings: ID[];
  socials: Record<string, string>;
}

export interface Recording {
  id: ID;
  title: string;
  meetingId?: ID;
  durationSeconds: number;
  sizeMB: number;
  createdAt: ISODate;
  storage: 'local' | 'cloud';
  thumbnailColor: string;
  hasTranscript: boolean;
  hasChapters: boolean;
  watched: boolean;
}

export interface ChatMessage {
  id: ID;
  meetingId: ID;
  senderId: ID;
  senderName: string;
  content: string;
  sentAt: ISODate;
  reactions: { emoji: string; by: ID }[];
  attachmentName?: string;
}

export interface Notification {
  id: ID;
  type: 'meeting' | 'contact' | 'recording' | 'system';
  title: string;
  body: string;
  createdAt: ISODate;
  read: boolean;
  ctaScreen?: string;
}

// ---------------------------------------------------------------------------
// Persisted preferences
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  defaultMicOn: boolean;
  defaultCameraOn: boolean;
  videoQuality: 'auto' | '360p' | '720p' | '1080p' | '4k';
  noiseSuppression: 'off' | 'low' | 'medium' | 'high';
  echoCancellation: boolean;
  beautyFilter: number;
  blurBackground: boolean;
  virtualBackgroundId?: string;
  language: string;
  region: string;
  notifications: {
    meetingStarting: boolean;
    meetingInvites: boolean;
    chatMentions: boolean;
    recordingReady: boolean;
    weeklyDigest: boolean;
  };
  storage: {
    autoDownloadRecordings: boolean;
    cellularUploads: boolean;
    cacheSizeMB: number;
  };
}

export interface UserProfile {
  id: ID;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  bio: string;
  avatarColor: string;
  initials: string;
  status: 'available' | 'busy' | 'away' | 'do-not-disturb';
  pronouns?: string;
  timeZone: string;
}

// ---------------------------------------------------------------------------
// Navigation param lists
// ---------------------------------------------------------------------------

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  InCall: { meetingId: ID } | undefined;
  InCallSettings1: undefined;
  InCallSettings2: { category: string };
  InCallSettings3: { category: string; section: string };
  InCallSettings4: { category: string; section: string; option: string };
  InCallSettings5: { category: string; section: string; option: string; sub: string };
  InCallSettings6: { category: string; section: string; option: string; sub: string; deep: string };
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  MeetingsTab: NavigatorScreenParams<MeetingsStackParamList>;
  ContactsTab: NavigatorScreenParams<ContactsStackParamList>;
  ScheduleTab: NavigatorScreenParams<ScheduleStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  HomeIndex: undefined;
  HomeJoinFlow: undefined;
  HomeJoinKeypad: undefined;
  HomeMeetingControlsPreview: { code: string };
  HomeAdvancedSettings: { code: string };
  HomeCreateFlow: undefined;
  HomeCreateOptions: undefined;
  HomeCreateInvite: { meetingId: ID };
  HomeCreateScheduling: { meetingId: ID };
  HomeQuickJoinDetail: { code: string };
  HomeRecentRoom: { code: string };
  HomeFavoriteRoom: { roomId: ID };
  HomeRoomHistoryItem: { code: string; index: number };
  HomeAnnouncementDetail: { id: ID };
  HomeTipDetail: { id: ID };
  HomeStatusDetail: { region: string };
  HomeFeatureSpotlight: { feature: string };
  HomeIntegrationDetail: { integrationId: string };
  HomeWhatsNewDetail: { id: ID };
  HomePromoDetail: { id: ID };
  HomeCommunityPost: { id: ID };
};

export type MeetingsStackParamList = {
  MeetingsIndex: undefined;
  MeetingsUpcomingDetail: { meetingId: ID };
  MeetingsPastDetail: { meetingId: ID };
  MeetingsParticipantsList: { meetingId: ID };
  MeetingsParticipantProfile: { meetingId: ID; participantId: ID };
  MeetingsAgenda: { meetingId: ID };
  MeetingsAgendaItem: { meetingId: ID; itemId: ID };
  MeetingsRecordings: { meetingId: ID };
  MeetingsRecordingPlayback: { recordingId: ID };
  MeetingsTranscript: { meetingId: ID };
  MeetingsTranscriptSegment: { meetingId: ID; segmentId: ID };
  MeetingsChat: { meetingId: ID };
  MeetingsChatThread: { meetingId: ID; messageId: ID };
  MeetingsAttachments: { meetingId: ID };
  MeetingsAttachmentDetail: { meetingId: ID; attachmentId: ID };
  MeetingsAnalytics: { meetingId: ID };
  MeetingsExportShare: { meetingId: ID };
  MeetingsFollowUp: { meetingId: ID };
  MeetingsTask: { meetingId: ID; taskId: ID };
};

export type ContactsStackParamList = {
  ContactsIndex: undefined;
  ContactsAlphaSection: { letter: string };
  ContactsProfile: { contactId: ID };
  ContactsScheduleMeeting: { contactId: ID };
  ContactsScheduleConfirm: { contactId: ID; date: ISODate };
  ContactsOptions: { contactId: ID };
  ContactsEdit: { contactId: ID };
  ContactsBlock: { contactId: ID };
  ContactsDelete: { contactId: ID };
  ContactsSharedFiles: { contactId: ID };
  ContactsSharedFile: { contactId: ID; fileId: ID };
  ContactsRecentMeetings: { contactId: ID };
  ContactsAddNew: undefined;
  ContactsImport: undefined;
  ContactsImportSource: { source: string };
  ContactsGroups: undefined;
  ContactsGroupDetail: { groupId: ID };
  ContactsGroupMembers: { groupId: ID };
  ContactsTagDetail: { tag: string };
  ContactsCallHistoryItem: { contactId: ID; index: number };
};

export type ScheduleStackParamList = {
  ScheduleIndex: undefined;
  ScheduleDayDetail: { date: ISODate };
  ScheduleMeetingEdit: { meetingId: ID };
  ScheduleMeetingReschedule: { meetingId: ID };
  ScheduleMeetingCancel: { meetingId: ID };
  ScheduleInvite: { meetingId: ID };
  ScheduleInviteContact: { meetingId: ID; contactId: ID };
  ScheduleInviteEmail: { meetingId: ID };
  ScheduleInviteLink: { meetingId: ID };
  ScheduleNewMeeting: { date: ISODate };
  ScheduleNewMeetingDetails: { date: ISODate };
  ScheduleNewMeetingRecurrence: { date: ISODate };
  ScheduleNewMeetingReminders: { date: ISODate };
  ScheduleNewMeetingPreview: { date: ISODate };
  ScheduleAvailability: undefined;
  ScheduleAvailabilityDay: { day: string };
  ScheduleHolidayDetail: { id: ID };
  ScheduleTimezoneDetail: { tz: string };
  ScheduleAgendaTemplate: { templateId: ID };
};

export type ProfileStackParamList = {
  ProfileIndex: undefined;
  ProfileEdit: undefined;
  ProfileSecurity: undefined;
  ProfileSecurityDetail: { topic: string };
  ProfileRecordingsList: undefined;
  ProfileRecordingPlayback: { recordingId: ID };
  ProfileRecordingShare: { recordingId: ID };
  ProfileRecordingShareTarget: { recordingId: ID; target: string };
  ProfileRecordingChapters: { recordingId: ID };
  ProfileRecordingChapter: { recordingId: ID; chapterId: ID };
  ProfileRecordingTranscript: { recordingId: ID };
  ProfileRecordingTranscriptSegment: { recordingId: ID; segmentId: ID };
  ProfileSettings: undefined;
  ProfileSettingsNotifications: undefined;
  ProfileSettingsAudio: undefined;
  ProfileSettingsVideo: undefined;
  ProfileSettingsBackground: undefined;
  ProfileSettingsBackgroundOption: { optionId: string };
  ProfileSettingsLanguage: undefined;
  ProfileSettingsLanguageOption: { code: string };
  ProfileSettingsStorage: undefined;
  ProfileSettingsAccessibility: undefined;
  ProfileSettingsAbout: undefined;
  ProfileSettingsAboutSection: { section: string };
  ProfileLicense: { id: string };
  ProfileChangelogEntry: { id: string };
  ProfileSupportTopic: { id: string };
  ProfileSupportThread: { id: string; threadId: string };
};

// ---------------------------------------------------------------------------
// Convenience screen-prop aliases (one per screen; boring but useful)
// ---------------------------------------------------------------------------

export type RootStackProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type RootTabProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;

export type HomeStackProps<T extends keyof HomeStackParamList> = NativeStackScreenProps<HomeStackParamList, T>;
export type MeetingsStackProps<T extends keyof MeetingsStackParamList> = NativeStackScreenProps<MeetingsStackParamList, T>;
export type ContactsStackProps<T extends keyof ContactsStackParamList> = NativeStackScreenProps<ContactsStackParamList, T>;
export type ScheduleStackProps<T extends keyof ScheduleStackParamList> = NativeStackScreenProps<ScheduleStackParamList, T>;
export type ProfileStackProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<ProfileStackParamList, T>;
