import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MeetingsStackParamList } from '@/types';

import MeetingsIndexScreen from '@/screens/meetings/MeetingsIndexScreen';
import MeetingsUpcomingDetailScreen from '@/screens/meetings/MeetingsUpcomingDetailScreen';
import MeetingsPastDetailScreen from '@/screens/meetings/MeetingsPastDetailScreen';
import MeetingsParticipantsListScreen from '@/screens/meetings/MeetingsParticipantsListScreen';
import MeetingsParticipantProfileScreen from '@/screens/meetings/MeetingsParticipantProfileScreen';
import MeetingsAgendaScreen from '@/screens/meetings/MeetingsAgendaScreen';
import MeetingsAgendaItemScreen from '@/screens/meetings/MeetingsAgendaItemScreen';
import MeetingsRecordingsScreen from '@/screens/meetings/MeetingsRecordingsScreen';
import MeetingsRecordingPlaybackScreen from '@/screens/meetings/MeetingsRecordingPlaybackScreen';
import MeetingsTranscriptScreen from '@/screens/meetings/MeetingsTranscriptScreen';
import MeetingsTranscriptSegmentScreen from '@/screens/meetings/MeetingsTranscriptSegmentScreen';
import MeetingsChatScreen from '@/screens/meetings/MeetingsChatScreen';
import MeetingsChatThreadScreen from '@/screens/meetings/MeetingsChatThreadScreen';
import MeetingsAttachmentsScreen from '@/screens/meetings/MeetingsAttachmentsScreen';
import MeetingsAttachmentDetailScreen from '@/screens/meetings/MeetingsAttachmentDetailScreen';
import MeetingsAnalyticsScreen from '@/screens/meetings/MeetingsAnalyticsScreen';
import MeetingsExportShareScreen from '@/screens/meetings/MeetingsExportShareScreen';
import MeetingsFollowUpScreen from '@/screens/meetings/MeetingsFollowUpScreen';
import MeetingsTaskScreen from '@/screens/meetings/MeetingsTaskScreen';

const Stack = createNativeStackNavigator<MeetingsStackParamList>();

export default function MeetingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MeetingsIndex" component={MeetingsIndexScreen} />
      <Stack.Screen name="MeetingsUpcomingDetail" component={MeetingsUpcomingDetailScreen} />
      <Stack.Screen name="MeetingsPastDetail" component={MeetingsPastDetailScreen} />
      <Stack.Screen name="MeetingsParticipantsList" component={MeetingsParticipantsListScreen} />
      <Stack.Screen name="MeetingsParticipantProfile" component={MeetingsParticipantProfileScreen} />
      <Stack.Screen name="MeetingsAgenda" component={MeetingsAgendaScreen} />
      <Stack.Screen name="MeetingsAgendaItem" component={MeetingsAgendaItemScreen} />
      <Stack.Screen name="MeetingsRecordings" component={MeetingsRecordingsScreen} />
      <Stack.Screen name="MeetingsRecordingPlayback" component={MeetingsRecordingPlaybackScreen} />
      <Stack.Screen name="MeetingsTranscript" component={MeetingsTranscriptScreen} />
      <Stack.Screen name="MeetingsTranscriptSegment" component={MeetingsTranscriptSegmentScreen} />
      <Stack.Screen name="MeetingsChat" component={MeetingsChatScreen} />
      <Stack.Screen name="MeetingsChatThread" component={MeetingsChatThreadScreen} />
      <Stack.Screen name="MeetingsAttachments" component={MeetingsAttachmentsScreen} />
      <Stack.Screen name="MeetingsAttachmentDetail" component={MeetingsAttachmentDetailScreen} />
      <Stack.Screen name="MeetingsAnalytics" component={MeetingsAnalyticsScreen} />
      <Stack.Screen name="MeetingsExportShare" component={MeetingsExportShareScreen} />
      <Stack.Screen name="MeetingsFollowUp" component={MeetingsFollowUpScreen} />
      <Stack.Screen name="MeetingsTask" component={MeetingsTaskScreen} />
    </Stack.Navigator>
  );
}
