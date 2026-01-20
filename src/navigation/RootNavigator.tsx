import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types';
import {WizardStack} from './WizardStack';
import {AuthStack} from './AuthStack';
import {ResultScreen} from '../screens/wizard/ResultScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {CompareScreen} from '../screens/CompareScreen';
import {SupportScreen} from '../screens/SupportScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import {useWizardStore, isWizardHydrated, onWizardHydration} from '../store/useWizardStore';
import {useAuthStore, isAuthHydrated, onAuthHydration} from '../store/useAuthStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isWizardCompleted = useWizardStore(state => state.isCompleted);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkHydration = () => {
      if (isAuthHydrated() && isWizardHydrated()) {
        setIsReady(true);
      }
    };

    checkHydration();
    onAuthHydration(checkHydration);
    onWizardHydration(checkHydration);

    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return null;
  }

  // Auth First Flow:
  // - If authenticated AND wizard completed -> Home (returning user)
  // - If authenticated but wizard NOT completed -> Wizard
  // - If NOT authenticated -> Auth (Login/SignUp)

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
        component={ResultScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
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
