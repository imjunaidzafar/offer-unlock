import React, {useState, useCallback} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import {RootNavigator} from './src/navigation/RootNavigator';
import {SplashScreen} from './src/components/SplashScreen';

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer
          onReady={() => {
            BootSplash.hide({fade: true});
          }}>
          <RootNavigator />
        </NavigationContainer>
        {showSplash && <SplashScreen onAnimationComplete={handleSplashComplete} />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
