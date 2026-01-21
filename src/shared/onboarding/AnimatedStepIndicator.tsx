import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import {colors} from '../../design';

interface AnimatedStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

interface StepIndicatorProps {
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  label: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  stepNumber,
  isActive,
  isCompleted,
  label,
}) => {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.2, {damping: 8, stiffness: 180}, () => {
        scale.value = withSpring(1, {damping: 12, stiffness: 100});
      });
      glowOpacity.value = withTiming(1, {duration: 300});
    } else {
      glowOpacity.value = withTiming(0, {duration: 200});
    }

    backgroundColor.value = withTiming(isCompleted ? 1 : isActive ? 0.5 : 0, {
      duration: 350,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isActive, isCompleted, scale, backgroundColor, glowOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    backgroundColor: interpolateColor(
      backgroundColor.value,
      [0, 0.5, 1],
      ['#D1FAE5', '#34D399', '#10B981'],
    ),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{scale: interpolate(glowOpacity.value, [0, 1], [0.8, 1.4])}],
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      backgroundColor.value,
      [0, 0.5, 1],
      ['#059669', '#FFFFFF', '#FFFFFF'],
    ),
  }));

  return (
    <View style={styles.stepIndicatorContainer}>
      <View style={styles.stepWrapper}>
        <Animated.View style={[styles.stepGlow, glowStyle]} />
        <Animated.View style={[styles.stepCircle, animatedStyle]}>
          <Animated.Text style={[styles.stepNumber, textStyle]}>
            {isCompleted ? '✓' : stepNumber}
          </Animated.Text>
        </Animated.View>
      </View>
      <Text
        style={[
          styles.stepLabel,
          isActive && styles.stepLabelActive,
          isCompleted && styles.stepLabelCompleted,
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

export const AnimatedStepIndicator: React.FC<AnimatedStepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = useSharedValue(0);
  const shimmerPosition = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring((currentStep - 1) / (totalSteps - 1), {
      damping: 18,
      stiffness: 90,
      mass: 0.8,
    });

    // Shimmer animation
    shimmerPosition.value = 0;
    shimmerPosition.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [currentStep, totalSteps, progress, shimmerPosition]);

  const progressBarStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [0, 100]);

    return {
      width: `${width}%`,
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: interpolate(shimmerPosition.value, [0, 1], [-100, 200])}],
      opacity: interpolate(shimmerPosition.value, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]),
    };
  });

  const stepLabels = ['Personal', 'Financial', 'Preferences'];

  return (
    <View style={styles.container}>
      {/* Progress Track */}
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <Animated.View style={[styles.progressFill, progressBarStyle]}>
            <Animated.View style={[styles.shimmer, shimmerStyle]} />
          </Animated.View>
        </View>
      </View>

      {/* Step Indicators */}
      <View style={styles.stepsRow}>
        {stepLabels.map((label, index) => (
          <StepIndicator
            key={index}
            stepNumber={index + 1}
            isActive={currentStep === index + 1}
            isCompleted={currentStep > index + 1}
            label={label}
          />
        ))}
      </View>

      {/* Progress Badge */}
      <View style={styles.progressBadge}>
        <Text style={styles.progressBadgeText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    shadowColor: '#059669',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  trackContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  track: {
    height: 6,
    backgroundColor: '#D1FAE5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{skewX: '-20deg'}],
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    opacity: 0.3,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepLabel: {
    marginTop: 10,
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#10B981',
    fontWeight: '700',
  },
  stepLabelCompleted: {
    color: '#059669',
    fontWeight: '600',
  },
  progressBadge: {
    alignSelf: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  progressBadgeText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
});
