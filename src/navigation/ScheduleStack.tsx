import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ScheduleStackParamList } from '@/types';

import ScheduleIndexScreen from '@/screens/schedule/ScheduleIndexScreen';
import ScheduleDayDetailScreen from '@/screens/schedule/ScheduleDayDetailScreen';
import ScheduleMeetingEditScreen from '@/screens/schedule/ScheduleMeetingEditScreen';
import ScheduleMeetingRescheduleScreen from '@/screens/schedule/ScheduleMeetingRescheduleScreen';
import ScheduleMeetingCancelScreen from '@/screens/schedule/ScheduleMeetingCancelScreen';
import ScheduleInviteScreen from '@/screens/schedule/ScheduleInviteScreen';
import ScheduleInviteContactScreen from '@/screens/schedule/ScheduleInviteContactScreen';
import ScheduleInviteEmailScreen from '@/screens/schedule/ScheduleInviteEmailScreen';
import ScheduleInviteLinkScreen from '@/screens/schedule/ScheduleInviteLinkScreen';
import ScheduleNewMeetingScreen from '@/screens/schedule/ScheduleNewMeetingScreen';
import ScheduleNewMeetingDetailsScreen from '@/screens/schedule/ScheduleNewMeetingDetailsScreen';
import ScheduleNewMeetingRecurrenceScreen from '@/screens/schedule/ScheduleNewMeetingRecurrenceScreen';
import ScheduleNewMeetingRemindersScreen from '@/screens/schedule/ScheduleNewMeetingRemindersScreen';
import ScheduleNewMeetingPreviewScreen from '@/screens/schedule/ScheduleNewMeetingPreviewScreen';
import ScheduleAvailabilityScreen from '@/screens/schedule/ScheduleAvailabilityScreen';
import ScheduleAvailabilityDayScreen from '@/screens/schedule/ScheduleAvailabilityDayScreen';
import ScheduleHolidayDetailScreen from '@/screens/schedule/ScheduleHolidayDetailScreen';
import ScheduleTimezoneDetailScreen from '@/screens/schedule/ScheduleTimezoneDetailScreen';
import ScheduleAgendaTemplateScreen from '@/screens/schedule/ScheduleAgendaTemplateScreen';

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ScheduleIndex" component={ScheduleIndexScreen} />
      <Stack.Screen name="ScheduleDayDetail" component={ScheduleDayDetailScreen} />
      <Stack.Screen name="ScheduleMeetingEdit" component={ScheduleMeetingEditScreen} />
      <Stack.Screen name="ScheduleMeetingReschedule" component={ScheduleMeetingRescheduleScreen} />
      <Stack.Screen name="ScheduleMeetingCancel" component={ScheduleMeetingCancelScreen} />
      <Stack.Screen name="ScheduleInvite" component={ScheduleInviteScreen} />
      <Stack.Screen name="ScheduleInviteContact" component={ScheduleInviteContactScreen} />
      <Stack.Screen name="ScheduleInviteEmail" component={ScheduleInviteEmailScreen} />
      <Stack.Screen name="ScheduleInviteLink" component={ScheduleInviteLinkScreen} />
      <Stack.Screen name="ScheduleNewMeeting" component={ScheduleNewMeetingScreen} />
      <Stack.Screen name="ScheduleNewMeetingDetails" component={ScheduleNewMeetingDetailsScreen} />
      <Stack.Screen name="ScheduleNewMeetingRecurrence" component={ScheduleNewMeetingRecurrenceScreen} />
      <Stack.Screen name="ScheduleNewMeetingReminders" component={ScheduleNewMeetingRemindersScreen} />
      <Stack.Screen name="ScheduleNewMeetingPreview" component={ScheduleNewMeetingPreviewScreen} />
      <Stack.Screen name="ScheduleAvailability" component={ScheduleAvailabilityScreen} />
      <Stack.Screen name="ScheduleAvailabilityDay" component={ScheduleAvailabilityDayScreen} />
      <Stack.Screen name="ScheduleHolidayDetail" component={ScheduleHolidayDetailScreen} />
      <Stack.Screen name="ScheduleTimezoneDetail" component={ScheduleTimezoneDetailScreen} />
      <Stack.Screen name="ScheduleAgendaTemplate" component={ScheduleAgendaTemplateScreen} />
    </Stack.Navigator>
  );
}
