import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onAnimationComplete}) => {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const lockRotation = useSharedValue(-10);

  const ring1Scale = useSharedValue(0.8);
  const ring1Opacity = useSharedValue(0);
  const ring2Scale = useSharedValue(0.8);
  const ring2Opacity = useSharedValue(0);
  const ring3Scale = useSharedValue(0.8);
  const ring3Opacity = useSharedValue(0);

  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  const subtitleOpacity = useSharedValue(0);

  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, {duration: 500});
    logoScale.value = withSpring(1, {damping: 12, stiffness: 100});
    lockRotation.value = withSpring(0, {damping: 15, stiffness: 80});

    // Pulsing rings - staggered
    ring1Opacity.value = withDelay(200, withRepeat(
      withSequence(
        withTiming(0.7, {duration: 1000}),
        withTiming(0, {duration: 1000})
      ), -1, false
    ));
    ring1Scale.value = withDelay(200, withRepeat(
      withSequence(
        withTiming(1.4, {duration: 2000}),
        withTiming(0.8, {duration: 0})
      ), -1, false
    ));

    ring2Opacity.value = withDelay(500, withRepeat(
      withSequence(
        withTiming(0.5, {duration: 1000}),
        withTiming(0, {duration: 1000})
      ), -1, false
    ));
    ring2Scale.value = withDelay(500, withRepeat(
      withSequence(
        withTiming(1.6, {duration: 2000}),
        withTiming(0.8, {duration: 0})
      ), -1, false
    ));

    ring3Opacity.value = withDelay(800, withRepeat(
      withSequence(
        withTiming(0.3, {duration: 1000}),
        withTiming(0, {duration: 1000})
      ), -1, false
    ));
    ring3Scale.value = withDelay(800, withRepeat(
      withSequence(
        withTiming(1.8, {duration: 2000}),
        withTiming(0.8, {duration: 0})
      ), -1, false
    ));

    // Checkmark badge pop
    checkOpacity.value = withDelay(600, withTiming(1, {duration: 300}));
    checkScale.value = withDelay(600, withSpring(1, {damping: 8, stiffness: 200}));

    // Title slide up
    titleOpacity.value = withDelay(400, withTiming(1, {duration: 600}));
    titleTranslateY.value = withDelay(400, withSpring(0, {damping: 15, stiffness: 90}));

    // Subtitle fade
    subtitleOpacity.value = withDelay(700, withTiming(1, {duration: 500}));

    // Fade out
    const timer = setTimeout(() => {
      containerOpacity.value = withTiming(0, {duration: 400}, (finished) => {
        if (finished) {
          runOnJS(onAnimationComplete)();
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{scale: logoScale.value}],
  }));

  const lockStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${lockRotation.value}deg`}],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1Opacity.value,
    transform: [{scale: ring1Scale.value}],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: ring2Opacity.value,
    transform: [{scale: ring2Scale.value}],
  }));

  const ring3Style = useAnimatedStyle(() => ({
    opacity: ring3Opacity.value,
    transform: [{scale: ring3Scale.value}],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{scale: checkScale.value}],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{translateY: titleTranslateY.value}],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background */}
      <View style={styles.background}>
        <View style={styles.bgGradient} />
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
        <View style={styles.bgCircle3} />
      </View>

      <View style={styles.content}>
        {/* Logo with rings */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          {/* Pulsing Rings */}
          <Animated.View style={[styles.ring, styles.ring3, ring3Style]} />
          <Animated.View style={[styles.ring, styles.ring2, ring2Style]} />
          <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />

          {/* Main Logo Circle */}
          <View style={styles.logoOuterCircle}>
            <View style={styles.logoInnerCircle}>
              <Animated.View style={lockStyle}>
                {/* Unlock Icon */}
                <View style={styles.lockIcon}>
                  {/* Lock shackle (open) */}
                  <View style={styles.shackleContainer}>
                    <View style={styles.shackle} />
                    <View style={styles.shackleOpen} />
                  </View>
                  {/* Lock body */}
                  <View style={styles.lockBody}>
                    <View style={styles.keyhole} />
                  </View>
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Checkmark Badge */}
          <Animated.View style={[styles.checkBadge, checkStyle]}>
            <Text style={styles.checkIcon}>✓</Text>
          </Animated.View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.titleLight}>Offer</Text>
          <Text style={styles.titleBold}>ly</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Your Premium Offers, Instantly
        </Animated.Text>
      </View>

      {/* Bottom dots loader */}
      <View style={styles.loaderContainer}>
        <LoadingDots />
      </View>
    </Animated.View>
  );
};

const LoadingDots: React.FC = () => {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    dot1.value = withRepeat(withSequence(
      withTiming(1, {duration: 400}),
      withTiming(0.3, {duration: 400})
    ), -1, false);

    dot2.value = withDelay(150, withRepeat(withSequence(
      withTiming(1, {duration: 400}),
      withTiming(0.3, {duration: 400})
    ), -1, false));

    dot3.value = withDelay(300, withRepeat(withSequence(
      withTiming(1, {duration: 400}),
      withTiming(0.3, {duration: 400})
    ), -1, false));
  }, []);

  const dot1Style = useAnimatedStyle(() => ({opacity: dot1.value, transform: [{scale: 0.8 + dot1.value * 0.4}]}));
  const dot2Style = useAnimatedStyle(() => ({opacity: dot2.value, transform: [{scale: 0.8 + dot2.value * 0.4}]}));
  const dot3Style = useAnimatedStyle(() => ({opacity: dot3.value, transform: [{scale: 0.8 + dot3.value * 0.4}]}));

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#059669',
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#047857',
    opacity: 0.5,
  },
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#10B981',
    opacity: 0.3,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#34D399',
    opacity: 0.25,
  },
  bgCircle3: {
    position: 'absolute',
    top: '40%',
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#065F46',
    opacity: 0.4,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  ring: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  ring1: {
    width: 140,
    height: 140,
  },
  ring2: {
    width: 160,
    height: 160,
  },
  ring3: {
    width: 180,
    height: 180,
  },
  logoOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoInnerCircle: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#047857',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  lockIcon: {
    alignItems: 'center',
  },
  shackleContainer: {
    width: 32,
    height: 22,
    position: 'relative',
  },
  shackle: {
    position: 'absolute',
    left: 4,
    width: 24,
    height: 22,
    borderWidth: 4,
    borderColor: '#059669',
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  shackleOpen: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 4,
    height: 14,
    backgroundColor: '#059669',
    borderTopRightRadius: 2,
    transform: [{rotate: '15deg'}, {translateX: 4}, {translateY: -2}],
  },
  lockBody: {
    width: 36,
    height: 28,
    backgroundColor: '#059669',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },
  keyhole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginTop: -2,
  },
  checkBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#059669',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  titleLight: {
    fontSize: 36,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  titleBold: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
    fontWeight: '500',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});
