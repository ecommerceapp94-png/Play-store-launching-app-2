import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ContactsStackParamList } from '@/types';

import ContactsIndexScreen from '@/screens/contacts/ContactsIndexScreen';
import ContactsAlphaSectionScreen from '@/screens/contacts/ContactsAlphaSectionScreen';
import ContactsProfileScreen from '@/screens/contacts/ContactsProfileScreen';
import ContactsScheduleMeetingScreen from '@/screens/contacts/ContactsScheduleMeetingScreen';
import ContactsScheduleConfirmScreen from '@/screens/contacts/ContactsScheduleConfirmScreen';
import ContactsOptionsScreen from '@/screens/contacts/ContactsOptionsScreen';
import ContactsEditScreen from '@/screens/contacts/ContactsEditScreen';
import ContactsBlockScreen from '@/screens/contacts/ContactsBlockScreen';
import ContactsDeleteScreen from '@/screens/contacts/ContactsDeleteScreen';
import ContactsSharedFilesScreen from '@/screens/contacts/ContactsSharedFilesScreen';
import ContactsSharedFileScreen from '@/screens/contacts/ContactsSharedFileScreen';
import ContactsRecentMeetingsScreen from '@/screens/contacts/ContactsRecentMeetingsScreen';
import ContactsAddNewScreen from '@/screens/contacts/ContactsAddNewScreen';
import ContactsImportScreen from '@/screens/contacts/ContactsImportScreen';
import ContactsImportSourceScreen from '@/screens/contacts/ContactsImportSourceScreen';
import ContactsGroupsScreen from '@/screens/contacts/ContactsGroupsScreen';
import ContactsGroupDetailScreen from '@/screens/contacts/ContactsGroupDetailScreen';
import ContactsGroupMembersScreen from '@/screens/contacts/ContactsGroupMembersScreen';
import ContactsTagDetailScreen from '@/screens/contacts/ContactsTagDetailScreen';
import ContactsCallHistoryItemScreen from '@/screens/contacts/ContactsCallHistoryItemScreen';

const Stack = createNativeStackNavigator<ContactsStackParamList>();

export default function ContactsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ContactsIndex" component={ContactsIndexScreen} />
      <Stack.Screen name="ContactsAlphaSection" component={ContactsAlphaSectionScreen} />
      <Stack.Screen name="ContactsProfile" component={ContactsProfileScreen} />
      <Stack.Screen name="ContactsScheduleMeeting" component={ContactsScheduleMeetingScreen} />
      <Stack.Screen name="ContactsScheduleConfirm" component={ContactsScheduleConfirmScreen} />
      <Stack.Screen name="ContactsOptions" component={ContactsOptionsScreen} />
      <Stack.Screen name="ContactsEdit" component={ContactsEditScreen} />
      <Stack.Screen name="ContactsBlock" component={ContactsBlockScreen} />
      <Stack.Screen name="ContactsDelete" component={ContactsDeleteScreen} />
      <Stack.Screen name="ContactsSharedFiles" component={ContactsSharedFilesScreen} />
      <Stack.Screen name="ContactsSharedFile" component={ContactsSharedFileScreen} />
      <Stack.Screen name="ContactsRecentMeetings" component={ContactsRecentMeetingsScreen} />
      <Stack.Screen name="ContactsAddNew" component={ContactsAddNewScreen} />
      <Stack.Screen name="ContactsImport" component={ContactsImportScreen} />
      <Stack.Screen name="ContactsImportSource" component={ContactsImportSourceScreen} />
      <Stack.Screen name="ContactsGroups" component={ContactsGroupsScreen} />
      <Stack.Screen name="ContactsGroupDetail" component={ContactsGroupDetailScreen} />
      <Stack.Screen name="ContactsGroupMembers" component={ContactsGroupMembersScreen} />
      <Stack.Screen name="ContactsTagDetail" component={ContactsTagDetailScreen} />
      <Stack.Screen name="ContactsCallHistoryItem" component={ContactsCallHistoryItemScreen} />
    </Stack.Navigator>
  );
}
