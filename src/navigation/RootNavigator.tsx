import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types';
import {WizardStack} from './WizardStack';
import {AuthStack} from './AuthStack';
import {OfferRevealScreen} from '../features/onboarding/OfferRevealScreen';
import {DashboardScreen} from '../features/DashboardScreen';
import {CompareScreen} from '../features/CompareScreen';
import {SupportScreen} from '../features/SupportScreen';
import {SettingsScreen} from '../features/SettingsScreen';
import {useOnboardingStore, isOnboardingHydrated, onOnboardingHydration} from '../state/useOnboardingStore';
import {useSessionStore, isSessionHydrated, onSessionHydration} from '../state/useSessionStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isWizardCompleted = useOnboardingStore(state => state.isCompleted);
  const isAuthenticated = useSessionStore(state => state.isAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkHydration = () => {
      if (isSessionHydrated() && isOnboardingHydrated()) {
        setIsReady(true);
      }
    };

    checkHydration();
    onSessionHydration(checkHydration);
    onOnboardingHydration(checkHydration);

    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null;
  }

  const getInitialRoute = (): keyof RootStackParamList => {
    if (isAuthenticated && isWizardCompleted) {
      return 'Home';
    }
    if (isAuthenticated) {
      return 'Wizard';
    }
    return 'Auth';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Wizard" component={WizardStack} />
      <Stack.Screen
        name="Result"
        component={OfferRevealScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="Compare" component={CompareScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
