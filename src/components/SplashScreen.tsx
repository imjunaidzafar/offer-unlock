import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {colors} from '../theme';

const {width} = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onAnimationComplete}) => {
  // Animation values
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(-10);

  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(15);

  const shimmerPosition = useSharedValue(-width);

  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo animation - scale up with bounce
    logoOpacity.value = withTiming(1, {duration: 400});
    logoScale.value = withSequence(
      withSpring(1.1, {damping: 8, stiffness: 100}),
      withSpring(1, {damping: 12, stiffness: 150}),
    );
    logoRotation.value = withSpring(0, {damping: 10, stiffness: 80});

    // Title animation - fade in and slide up
    titleOpacity.value = withDelay(
      400,
      withTiming(1, {duration: 500, easing: Easing.out(Easing.ease)}),
    );
    titleTranslateY.value = withDelay(
      400,
      withSpring(0, {damping: 15, stiffness: 100}),
    );

    // Subtitle animation
    subtitleOpacity.value = withDelay(
      600,
      withTiming(1, {duration: 400, easing: Easing.out(Easing.ease)}),
    );
    subtitleTranslateY.value = withDelay(
      600,
      withSpring(0, {damping: 15, stiffness: 100}),
    );

    // Shimmer effect
    shimmerPosition.value = withDelay(
      800,
      withTiming(width, {duration: 1000, easing: Easing.inOut(Easing.ease)}),
    );

    // Fade out and complete
    const timer = setTimeout(() => {
      containerOpacity.value = withTiming(0, {duration: 400}, (finished) => {
        if (finished) {
          runOnJS(onAnimationComplete)();
        }
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, [
    logoScale,
    logoOpacity,
    logoRotation,
    titleOpacity,
    titleTranslateY,
    subtitleOpacity,
    subtitleTranslateY,
    shimmerPosition,
    containerOpacity,
    onAnimationComplete,
  ]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      {scale: logoScale.value},
      {rotate: `${logoRotation.value}deg`},
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{translateY: titleTranslateY.value}],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{translateY: subtitleTranslateY.value}],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background gradient simulation with layers */}
      <View style={styles.backgroundGradient}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              {/* Shield shape with lock icon */}
              <View style={styles.shieldBackground}>
                <View style={styles.lockBody}>
                  <View style={styles.lockShackle} />
                  <View style={styles.lockKeyhole} />
                  <View style={styles.lockKeyholeSlot} />
                </View>
              </View>
              {/* Sparkle */}
              <View style={styles.sparkle}>
                <Text style={styles.sparkleIcon}>✦</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* App name */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.title}>Offer</Text>
          <Text style={styles.titleAccent}>Unlock</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Unlock Exclusive Offers
        </Animated.Text>
      </View>

      {/* Loading indicator */}
      <View style={styles.footer}>
        <View style={styles.loadingDots}>
          <LoadingDot delay={0} />
          <LoadingDot delay={150} />
          <LoadingDot delay={300} />
        </View>
      </View>
    </Animated.View>
  );
};

// Animated loading dot component
const LoadingDot: React.FC<{delay: number}> = ({delay}) => {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    const animate = () => {
      scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1, {duration: 400}),
          withTiming(0.6, {duration: 400}),
        ),
      );
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, {duration: 400}),
          withTiming(0.4, {duration: 400}),
        ),
      );
    };

    animate();
    const interval = setInterval(animate, 800);
    return () => clearInterval(interval);
  }, [scale, opacity, delay]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, dotStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accent.primary,
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#8B5CF6',
    opacity: 0.5,
  },
  gradientLayer2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#6D28D9',
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoOuter: {
    width: 140,
    height: 140,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoInner: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shieldBackground: {
    width: 80,
    height: 90,
    backgroundColor: colors.accent.primary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  lockBody: {
    width: 40,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    alignItems: 'center',
    position: 'relative',
  },
  lockShackle: {
    position: 'absolute',
    top: -16,
    left: 6,
    width: 28,
    height: 20,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 5,
    borderBottomWidth: 0,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  lockKeyhole: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.primary,
    marginTop: 8,
  },
  lockKeyholeSlot: {
    width: 4,
    height: 10,
    backgroundColor: colors.accent.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -2,
  },
  sparkle: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  sparkleIcon: {
    fontSize: 24,
    color: '#F59E0B',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  titleAccent: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 80,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});
