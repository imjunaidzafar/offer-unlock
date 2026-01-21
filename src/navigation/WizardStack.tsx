import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {WizardStackParamList} from '../types';
import {PersonalDetailsScreen} from '../features/onboarding/PersonalDetailsScreen';
import {FinancialInfoScreen} from '../features/onboarding/FinancialInfoScreen';
import {PreferencesScreen} from '../features/onboarding/PreferencesScreen';

const Stack = createNativeStackNavigator<WizardStackParamList>();

export const WizardStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Step1" component={PersonalDetailsScreen} />
      <Stack.Screen name="Step2" component={FinancialInfoScreen} />
      <Stack.Screen name="Step3" component={PreferencesScreen} />
    </Stack.Navigator>
  );
};
