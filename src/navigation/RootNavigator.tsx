import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './HomeStack';
import MeetingsStack from './MeetingsStack';
import ContactsStack from './ContactsStack';
import ScheduleStack from './ScheduleStack';
import ProfileStack from './ProfileStack';

import InCallScreen from '@/screens/incall/InCallScreen';
import InCallSettings1Screen from '@/screens/incall/InCallSettings1Screen';
import InCallSettings2Screen from '@/screens/incall/InCallSettings2Screen';
import InCallSettings3Screen from '@/screens/incall/InCallSettings3Screen';
import InCallSettings4Screen from '@/screens/incall/InCallSettings4Screen';
import InCallSettings5Screen from '@/screens/incall/InCallSettings5Screen';
import InCallSettings6Screen from '@/screens/incall/InCallSettings6Screen';

import { GlassTabBar } from '@/components/TabBar';
import { AIFloatingButton } from '@/components/AIFloatingButton';
import { View } from 'react-native';
import type { RootStackParamList, RootTabParamList } from '@/types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const TabsNavigator: React.FC = () => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="MeetingsTab" component={MeetingsStack} />
      <Tab.Screen name="ContactsTab" component={ContactsStack} />
      <Tab.Screen name="ScheduleTab" component={ScheduleStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
    <AIFloatingButton />
  </View>
);

export default function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <RootStack.Screen name="Tabs" component={TabsNavigator} />
      <RootStack.Screen name="InCall" component={InCallScreen} options={{ presentation: 'fullScreenModal' }} />
      <RootStack.Screen name="InCallSettings1" component={InCallSettings1Screen} />
      <RootStack.Screen name="InCallSettings2" component={InCallSettings2Screen} />
      <RootStack.Screen name="InCallSettings3" component={InCallSettings3Screen} />
      <RootStack.Screen name="InCallSettings4" component={InCallSettings4Screen} />
      <RootStack.Screen name="InCallSettings5" component={InCallSettings5Screen} />
      <RootStack.Screen name="InCallSettings6" component={InCallSettings6Screen} />
    </RootStack.Navigator>
  );
}
