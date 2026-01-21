import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SafeAreaWrapper, Input, Button} from '../../shared/ui';
import {AnimatedStepIndicator} from '../../shared/onboarding/AnimatedStepIndicator';
import {useOnboardingStore, useStep1Data} from '../../state/useOnboardingStore';
import {useSessionStore} from '../../state/useSessionStore';
import {step1Schema, Step1FormData, safeZodResolver} from '../../lib/schemas';
import {colors, shadows, borderRadius} from '../../design';
import type {WizardStackParamList, RootStackParamList} from '../../types';

type WizardNavigationProp = NativeStackNavigationProp<WizardStackParamList, 'Step1'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PersonalDetailsScreen: React.FC = () => {
  const wizardNavigation = useNavigation<WizardNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const step1Data = useStep1Data();
  const updateStep1 = useOnboardingStore(state => state.updateStep1);
  const setCurrentStep = useOnboardingStore(state => state.setCurrentStep);
  const resetWizard = useOnboardingStore(state => state.resetWizard);
  const logout = useSessionStore(state => state.logout);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    watch,
    setValue,
  } = useForm<Step1FormData>({
    resolver: safeZodResolver(step1Schema),
    defaultValues: {
      firstName: step1Data.firstName,
      lastName: step1Data.lastName,
      dateOfBirth: step1Data.dateOfBirth,
    },
    mode: 'onTouched',
  });

  // Auto-save form data on change
  const watchedValues = watch();
  const watchedValuesRef = React.useRef(watchedValues);

  useEffect(() => {
    const hasChanged =
      watchedValuesRef.current.firstName !== watchedValues.firstName ||
      watchedValuesRef.current.lastName !== watchedValues.lastName ||
      watchedValuesRef.current.dateOfBirth !== watchedValues.dateOfBirth;

    if (hasChanged) {
      watchedValuesRef.current = watchedValues;
      updateStep1(watchedValues);
    }
  }, [watchedValues, updateStep1]);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const onSubmit = (data: Step1FormData) => {
    updateStep1(data);
    wizardNavigation.navigate('Step2');
  };

  const handleBack = () => {
    // Go back to auth (logout user)
    logout();
    resetWizard();
    rootNavigation.reset({
      index: 0,
      routes: [{name: 'Auth'}],
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setValue('dateOfBirth', selectedDate.toISOString().split('T')[0], {
        shouldValidate: true,
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <AnimatedStepIndicator currentStep={1} totalSteps={3} />

          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>👤</Text>
              </View>
              <Text style={styles.title}>Personal Information</Text>
              <Text style={styles.subtitle}>
                Tell us a bit about yourself to unlock your personalized offer.
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Controller
                control={control}
                name="firstName"
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                    autoCapitalize="words"
                    autoComplete="family-name"
                  />
                )}
              />

              <Controller
                control={control}
                name="dateOfBirth"
                render={({field: {value}}) => (
                  <View style={styles.dateContainer}>
                    <Text
                      style={[
                        styles.dateLabel,
                        errors.dateOfBirth && styles.dateLabelError,
                      ]}>
                      Date of Birth
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        errors.dateOfBirth && styles.dateButtonError,
                      ]}
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.7}
                      accessibilityLabel="Select date of birth"
                      accessibilityRole="button">
                      <Text
                        style={[
                          styles.dateText,
                          !value && styles.datePlaceholder,
                        ]}>
                        {value ? formatDate(value) : 'Select your date of birth'}
                      </Text>
                      <Text style={styles.calendarIcon}>📅</Text>
                    </TouchableOpacity>
                    {errors.dateOfBirth && (
                      <Text style={styles.errorText}>
                        {errors.dateOfBirth.message}
                      </Text>
                    )}
                    {showDatePicker && Platform.OS === 'ios' && (
                      <View style={styles.datePickerContainer}>
                        <View style={styles.datePickerHeader}>
                          <TouchableOpacity
                            onPress={() => setShowDatePicker(false)}
                            style={styles.datePickerDoneButton}>
                            <Text style={styles.datePickerDoneText}>Done</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={value ? new Date(value) : getMaxDate()}
                          mode="date"
                          display="spinner"
                          onChange={handleDateChange}
                          maximumDate={getMaxDate()}
                          style={styles.datePicker}
                        />
                      </View>
                    )}
                  </View>
                )}
              />

              {showDatePicker && Platform.OS !== 'ios' && (
                <DateTimePicker
                  value={
                    watchedValues.dateOfBirth
                      ? new Date(watchedValues.dateOfBirth)
                      : getMaxDate()
                  }
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={getMaxDate()}
                />
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              style={styles.backButton}
            />
            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              style={styles.continueButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.gradient.start,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.md,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: 20,
    ...shadows.md,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 6,
  },
  dateLabelError: {
    color: colors.error,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    borderColor: colors.border.default,
    backgroundColor: colors.background.card,
  },
  dateButtonError: {
    borderColor: colors.error,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  datePlaceholder: {
    color: colors.text.muted,
  },
  calendarIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  datePickerContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  datePickerHeader: {
    backgroundColor: colors.background.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    alignItems: 'flex-end',
  },
  datePickerDoneButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.sm,
  },
  datePickerDoneText: {
    color: colors.text.inverse,
    fontWeight: '600',
    fontSize: 14,
  },
  datePicker: {
    height: 180,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});
