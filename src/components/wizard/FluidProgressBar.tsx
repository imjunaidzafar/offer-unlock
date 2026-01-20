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

interface FluidProgressBarProps {
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

  useEffect(() => {
    if (isActive) {
      // Pulse animation when becoming active
      scale.value = withSpring(1.15, {damping: 10, stiffness: 150}, () => {
        scale.value = withSpring(1, {damping: 15, stiffness: 100});
      });
    }

    backgroundColor.value = withTiming(isCompleted ? 1 : isActive ? 0.5 : 0, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isActive, isCompleted, scale, backgroundColor]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    backgroundColor: interpolateColor(
      backgroundColor.value,
      [0, 0.5, 1],
      ['#E5E7EB', '#818CF8', '#4F46E5'],
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      backgroundColor.value,
      [0, 0.5, 1],
      ['#6B7280', '#FFFFFF', '#FFFFFF'],
    ),
  }));

  return (
    <View style={styles.stepIndicatorContainer}>
      <Animated.View style={[styles.stepCircle, animatedStyle]}>
        <Animated.Text style={[styles.stepNumber, textStyle]}>
          {isCompleted ? '✓' : stepNumber}
        </Animated.Text>
      </Animated.View>
      <Text
        style={[
          styles.stepLabel,
          (isActive || isCompleted) ? styles.stepLabelActive : undefined,
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

export const FluidProgressBar: React.FC<FluidProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = useSharedValue(0);
  const waveOffset = useSharedValue(0);

  useEffect(() => {
    // Smooth spring animation for progress
    progress.value = withSpring((currentStep - 1) / (totalSteps - 1), {
      damping: 15,
      stiffness: 80,
      mass: 1,
    });

    // Subtle wave animation
    waveOffset.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [currentStep, totalSteps, progress, waveOffset]);

  const progressBarStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [0, 100]);

    return {
      width: `${width}%`,
      opacity: interpolate(progress.value, [0, 0.1, 1], [0.5, 1, 1]),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const translateX = interpolate(waveOffset.value, [0, 1], [-50, 0]);

    return {
      transform: [{translateX}],
      opacity: interpolate(waveOffset.value, [0, 0.5, 1], [0, 0.8, 0]),
    };
  });

  const stepLabels = ['Personal', 'Income', 'Preferences'];

  return (
    <View style={styles.container}>
      {/* Step indicators row */}
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

      {/* Progress track */}
      <View style={styles.trackWrapper}>
        <View style={styles.track}>
          {/* Filled progress */}
          <Animated.View style={[styles.progressFill, progressBarStyle]}>
            {/* Animated glow effect */}
            <Animated.View style={[styles.progressGlow, glowStyle]} />
          </Animated.View>
        </View>
      </View>

      {/* Progress text */}
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  trackWrapper: {
    paddingHorizontal: 18,
    marginTop: -20,
  },
  track: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  progressGlow: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    zIndex: 1,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepLabel: {
    marginTop: 6,
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#4F46E5',
  },
  progressText: {
    marginTop: 12,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});
