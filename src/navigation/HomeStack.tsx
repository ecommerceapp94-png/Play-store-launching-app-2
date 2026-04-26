import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/types';

import HomeIndexScreen from '@/screens/home/HomeIndexScreen';
import HomeJoinFlowScreen from '@/screens/home/HomeJoinFlowScreen';
import HomeJoinKeypadScreen from '@/screens/home/HomeJoinKeypadScreen';
import HomeMeetingControlsPreviewScreen from '@/screens/home/HomeMeetingControlsPreviewScreen';
import HomeAdvancedSettingsScreen from '@/screens/home/HomeAdvancedSettingsScreen';
import HomeCreateFlowScreen from '@/screens/home/HomeCreateFlowScreen';
import HomeCreateOptionsScreen from '@/screens/home/HomeCreateOptionsScreen';
import HomeCreateInviteScreen from '@/screens/home/HomeCreateInviteScreen';
import HomeCreateSchedulingScreen from '@/screens/home/HomeCreateSchedulingScreen';
import HomeQuickJoinDetailScreen from '@/screens/home/HomeQuickJoinDetailScreen';
import HomeRecentRoomScreen from '@/screens/home/HomeRecentRoomScreen';
import HomeFavoriteRoomScreen from '@/screens/home/HomeFavoriteRoomScreen';
import HomeRoomHistoryItemScreen from '@/screens/home/HomeRoomHistoryItemScreen';
import HomeAnnouncementDetailScreen from '@/screens/home/HomeAnnouncementDetailScreen';
import HomeTipDetailScreen from '@/screens/home/HomeTipDetailScreen';
import HomeStatusDetailScreen from '@/screens/home/HomeStatusDetailScreen';
import HomeFeatureSpotlightScreen from '@/screens/home/HomeFeatureSpotlightScreen';
import HomeIntegrationDetailScreen from '@/screens/home/HomeIntegrationDetailScreen';
import HomeWhatsNewDetailScreen from '@/screens/home/HomeWhatsNewDetailScreen';
import HomePromoDetailScreen from '@/screens/home/HomePromoDetailScreen';
import HomeCommunityPostScreen from '@/screens/home/HomeCommunityPostScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="HomeIndex" component={HomeIndexScreen} />
      <Stack.Screen name="HomeJoinFlow" component={HomeJoinFlowScreen} />
      <Stack.Screen name="HomeJoinKeypad" component={HomeJoinKeypadScreen} />
      <Stack.Screen name="HomeMeetingControlsPreview" component={HomeMeetingControlsPreviewScreen} />
      <Stack.Screen name="HomeAdvancedSettings" component={HomeAdvancedSettingsScreen} />
      <Stack.Screen name="HomeCreateFlow" component={HomeCreateFlowScreen} />
      <Stack.Screen name="HomeCreateOptions" component={HomeCreateOptionsScreen} />
      <Stack.Screen name="HomeCreateInvite" component={HomeCreateInviteScreen} />
      <Stack.Screen name="HomeCreateScheduling" component={HomeCreateSchedulingScreen} />
      <Stack.Screen name="HomeQuickJoinDetail" component={HomeQuickJoinDetailScreen} />
      <Stack.Screen name="HomeRecentRoom" component={HomeRecentRoomScreen} />
      <Stack.Screen name="HomeFavoriteRoom" component={HomeFavoriteRoomScreen} />
      <Stack.Screen name="HomeRoomHistoryItem" component={HomeRoomHistoryItemScreen} />
      <Stack.Screen name="HomeAnnouncementDetail" component={HomeAnnouncementDetailScreen} />
      <Stack.Screen name="HomeTipDetail" component={HomeTipDetailScreen} />
      <Stack.Screen name="HomeStatusDetail" component={HomeStatusDetailScreen} />
      <Stack.Screen name="HomeFeatureSpotlight" component={HomeFeatureSpotlightScreen} />
      <Stack.Screen name="HomeIntegrationDetail" component={HomeIntegrationDetailScreen} />
      <Stack.Screen name="HomeWhatsNewDetail" component={HomeWhatsNewDetailScreen} />
      <Stack.Screen name="HomePromoDetail" component={HomePromoDetailScreen} />
      <Stack.Screen name="HomeCommunityPost" component={HomeCommunityPostScreen} />
    </Stack.Navigator>
  );
}
