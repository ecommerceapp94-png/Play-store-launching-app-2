import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/types';

import ProfileIndexScreen from '@/screens/profile/ProfileIndexScreen';
import ProfileEditScreen from '@/screens/profile/ProfileEditScreen';
import ProfileSecurityScreen from '@/screens/profile/ProfileSecurityScreen';
import ProfileSecurityDetailScreen from '@/screens/profile/ProfileSecurityDetailScreen';
import ProfileRecordingsListScreen from '@/screens/profile/ProfileRecordingsListScreen';
import ProfileRecordingPlaybackScreen from '@/screens/profile/ProfileRecordingPlaybackScreen';
import ProfileRecordingShareScreen from '@/screens/profile/ProfileRecordingShareScreen';
import ProfileRecordingShareTargetScreen from '@/screens/profile/ProfileRecordingShareTargetScreen';
import ProfileRecordingChaptersScreen from '@/screens/profile/ProfileRecordingChaptersScreen';
import ProfileRecordingChapterScreen from '@/screens/profile/ProfileRecordingChapterScreen';
import ProfileRecordingTranscriptScreen from '@/screens/profile/ProfileRecordingTranscriptScreen';
import ProfileRecordingTranscriptSegmentScreen from '@/screens/profile/ProfileRecordingTranscriptSegmentScreen';
import ProfileSettingsScreen from '@/screens/profile/ProfileSettingsScreen';
import ProfileSettingsNotificationsScreen from '@/screens/profile/ProfileSettingsNotificationsScreen';
import ProfileSettingsAudioScreen from '@/screens/profile/ProfileSettingsAudioScreen';
import ProfileSettingsVideoScreen from '@/screens/profile/ProfileSettingsVideoScreen';
import ProfileSettingsBackgroundScreen from '@/screens/profile/ProfileSettingsBackgroundScreen';
import ProfileSettingsBackgroundOptionScreen from '@/screens/profile/ProfileSettingsBackgroundOptionScreen';
import ProfileSettingsLanguageScreen from '@/screens/profile/ProfileSettingsLanguageScreen';
import ProfileSettingsLanguageOptionScreen from '@/screens/profile/ProfileSettingsLanguageOptionScreen';
import ProfileSettingsStorageScreen from '@/screens/profile/ProfileSettingsStorageScreen';
import ProfileSettingsAccessibilityScreen from '@/screens/profile/ProfileSettingsAccessibilityScreen';
import ProfileSettingsAboutScreen from '@/screens/profile/ProfileSettingsAboutScreen';
import ProfileSettingsAboutSectionScreen from '@/screens/profile/ProfileSettingsAboutSectionScreen';
import ProfileLicenseScreen from '@/screens/profile/ProfileLicenseScreen';
import ProfileChangelogEntryScreen from '@/screens/profile/ProfileChangelogEntryScreen';
import ProfileSupportTopicScreen from '@/screens/profile/ProfileSupportTopicScreen';
import ProfileSupportThreadScreen from '@/screens/profile/ProfileSupportThreadScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ProfileIndex" component={ProfileIndexScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="ProfileSecurity" component={ProfileSecurityScreen} />
      <Stack.Screen name="ProfileSecurityDetail" component={ProfileSecurityDetailScreen} />
      <Stack.Screen name="ProfileRecordingsList" component={ProfileRecordingsListScreen} />
      <Stack.Screen name="ProfileRecordingPlayback" component={ProfileRecordingPlaybackScreen} />
      <Stack.Screen name="ProfileRecordingShare" component={ProfileRecordingShareScreen} />
      <Stack.Screen name="ProfileRecordingShareTarget" component={ProfileRecordingShareTargetScreen} />
      <Stack.Screen name="ProfileRecordingChapters" component={ProfileRecordingChaptersScreen} />
      <Stack.Screen name="ProfileRecordingChapter" component={ProfileRecordingChapterScreen} />
      <Stack.Screen name="ProfileRecordingTranscript" component={ProfileRecordingTranscriptScreen} />
      <Stack.Screen name="ProfileRecordingTranscriptSegment" component={ProfileRecordingTranscriptSegmentScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="ProfileSettingsNotifications" component={ProfileSettingsNotificationsScreen} />
      <Stack.Screen name="ProfileSettingsAudio" component={ProfileSettingsAudioScreen} />
      <Stack.Screen name="ProfileSettingsVideo" component={ProfileSettingsVideoScreen} />
      <Stack.Screen name="ProfileSettingsBackground" component={ProfileSettingsBackgroundScreen} />
      <Stack.Screen name="ProfileSettingsBackgroundOption" component={ProfileSettingsBackgroundOptionScreen} />
      <Stack.Screen name="ProfileSettingsLanguage" component={ProfileSettingsLanguageScreen} />
      <Stack.Screen name="ProfileSettingsLanguageOption" component={ProfileSettingsLanguageOptionScreen} />
      <Stack.Screen name="ProfileSettingsStorage" component={ProfileSettingsStorageScreen} />
      <Stack.Screen name="ProfileSettingsAccessibility" component={ProfileSettingsAccessibilityScreen} />
      <Stack.Screen name="ProfileSettingsAbout" component={ProfileSettingsAboutScreen} />
      <Stack.Screen name="ProfileSettingsAboutSection" component={ProfileSettingsAboutSectionScreen} />
      <Stack.Screen name="ProfileLicense" component={ProfileLicenseScreen} />
      <Stack.Screen name="ProfileChangelogEntry" component={ProfileChangelogEntryScreen} />
      <Stack.Screen name="ProfileSupportTopic" component={ProfileSupportTopicScreen} />
      <Stack.Screen name="ProfileSupportThread" component={ProfileSupportThreadScreen} />
    </Stack.Navigator>
  );
}
