import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {WizardStackParamList} from '../types';
import {Step1PersonalInfo} from '../screens/wizard/Step1PersonalInfo';
import {Step2IncomeDetails} from '../screens/wizard/Step2IncomeDetails';
import {Step3Preferences} from '../screens/wizard/Step3Preferences';

const Stack = createNativeStackNavigator<WizardStackParamList>();

export const WizardStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Step1" component={Step1PersonalInfo} />
      <Stack.Screen name="Step2" component={Step2IncomeDetails} />
      <Stack.Screen name="Step3" component={Step3Preferences} />
    </Stack.Navigator>
  );
};
