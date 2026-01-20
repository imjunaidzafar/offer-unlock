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
import {SafeAreaWrapper, Input, Button} from '../../components/ui';
import {FluidProgressBar} from '../../components/wizard/FluidProgressBar';
import {useWizardStore, useStep1Data} from '../../store/useWizardStore';
import {step1Schema, Step1FormData, safeZodResolver} from '../../utils/validation';
import type {WizardStackParamList} from '../../types';

type NavigationProp = NativeStackNavigationProp<WizardStackParamList, 'Step1'>;

export const Step1PersonalInfo: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const step1Data = useStep1Data();
  const updateStep1 = useWizardStore((state) => state.updateStep1);
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);

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
    // Only update if values actually changed to prevent infinite loops
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
    navigation.navigate('Step2');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On Android, close picker after selection
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
          keyboardShouldPersistTaps="handled">
          <FluidProgressBar currentStep={1} totalSteps={3} />

          <View style={styles.content}>
            <Text style={styles.title}>Personal Information</Text>
            <Text style={styles.subtitle}>
              Tell us a bit about yourself to unlock your personalized offer.
            </Text>

            <View style={styles.form}>
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
                        errors.dateOfBirth ? styles.dateLabelError : undefined,
                      ]}>
                      Date of Birth
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        errors.dateOfBirth ? styles.dateButtonError : undefined,
                      ]}
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.7}
                      accessibilityLabel="Select date of birth"
                      accessibilityRole="button">
                      <Text
                        style={[
                          styles.dateText,
                          !value ? styles.datePlaceholder : undefined,
                        ]}>
                        {value ? formatDate(value) : 'Select your date of birth'}
                      </Text>
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
                          value={
                            value
                              ? new Date(value)
                              : getMaxDate()
                          }
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
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
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
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  dateLabelError: {
    color: '#EF4444',
  },
  dateButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  dateButtonError: {
    borderColor: '#EF4444',
  },
  dateText: {
    fontSize: 16,
    color: '#1F2937',
  },
  datePlaceholder: {
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  datePickerContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  datePickerHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  datePickerDoneButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#4F46E5',
    borderRadius: 6,
  },
  datePickerDoneText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  datePicker: {
    height: 180,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
