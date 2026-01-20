import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types';
import {WizardStack} from './WizardStack';
import {AuthStack} from './AuthStack';
import {ResultScreen} from '../screens/wizard/ResultScreen';
import {useWizardStore} from '../store/useWizardStore';
import {useAuthStore} from '../store/useAuthStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isWizardCompleted = useWizardStore((state) => state.isCompleted);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentStep = useWizardStore((state) => state.currentStep);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure stores are hydrated
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null; // Or a splash screen
  }

  // Flow: Wizard -> Auth -> Result
  // If wizard is completed AND authenticated, show Result
  // If wizard is completed but NOT authenticated, show Auth
  // Otherwise, show Wizard

  const getInitialRoute = (): keyof RootStackParamList => {
    if (isWizardCompleted && isAuthenticated) {
      return 'Result';
    }
    if (isWizardCompleted) {
      return 'Auth';
    }
    return 'Wizard';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Wizard" component={WizardStack} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          gestureEnabled: false, // Prevent going back
        }}
      />
    </Stack.Navigator>
  );
};
