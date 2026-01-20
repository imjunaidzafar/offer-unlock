import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {SafeAreaWrapper, Button, Select, Checkbox} from '../../components/ui';
import {FluidProgressBar} from '../../components/wizard/FluidProgressBar';
import {useWizardStore, useStep3Data} from '../../store/useWizardStore';
import {step3Schema, Step3FormData, safeZodResolver} from '../../utils/validation';
import {colors, shadows, borderRadius} from '../../theme';
import type {WizardStackParamList, RootStackParamList, Step3Data} from '../../types';

type WizardNavigationProp = NativeStackNavigationProp<WizardStackParamList, 'Step3'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const offerTypeOptions = [
  {label: 'Personal Loan', value: 'loan'},
  {label: 'Credit Card', value: 'credit-card'},
  {label: 'Insurance', value: 'insurance'},
];

const contactPreferenceOptions = [
  {label: 'Email', value: 'email'},
  {label: 'Phone', value: 'phone'},
  {label: 'Both', value: 'both'},
];

export const Step3Preferences: React.FC = () => {
  const wizardNavigation = useNavigation<WizardNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const step3Data = useStep3Data();
  const updateStep3 = useWizardStore(state => state.updateStep3);
  const setCurrentStep = useWizardStore(state => state.setCurrentStep);
  const completeWizard = useWizardStore(state => state.completeWizard);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    watch,
  } = useForm<Step3FormData>({
    resolver: safeZodResolver(step3Schema),
    defaultValues: {
      offerType: step3Data.offerType,
      contactPreference: step3Data.contactPreference,
      termsAccepted: step3Data.termsAccepted || undefined,
    },
    mode: 'onTouched',
  });

  // Auto-save form data on change
  const watchedValues = watch();
  const watchedValuesRef = React.useRef(watchedValues);

  useEffect(() => {
    const hasChanged =
      watchedValuesRef.current.offerType !== watchedValues.offerType ||
      watchedValuesRef.current.contactPreference !== watchedValues.contactPreference ||
      watchedValuesRef.current.termsAccepted !== watchedValues.termsAccepted;

    if (hasChanged) {
      watchedValuesRef.current = watchedValues;
      updateStep3(watchedValues as Step3Data);
    }
  }, [watchedValues, updateStep3]);

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const onSubmit = (data: Step3FormData) => {
    updateStep3(data as Step3Data);
    completeWizard();
    // Navigate to Result screen (Auth First pattern)
    rootNavigation.reset({
      index: 0,
      routes: [{name: 'Result'}],
    });
  };

  const handleBack = () => {
    wizardNavigation.goBack();
  };

  return (
    <SafeAreaWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <FluidProgressBar currentStep={3} totalSteps={3} />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🎯</Text>
            </View>
            <Text style={styles.title}>Almost There!</Text>
            <Text style={styles.subtitle}>
              Tell us your preferences and unlock your personalized offer.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Controller
              control={control}
              name="offerType"
              render={({field: {onChange, value}}) => (
                <Select
                  label="What type of offer interests you?"
                  options={offerTypeOptions}
                  value={value || ''}
                  onValueChange={onChange}
                  placeholder="Select offer type"
                  error={errors.offerType?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="contactPreference"
              render={({field: {onChange, value}}) => (
                <Select
                  label="How should we contact you?"
                  options={contactPreferenceOptions}
                  value={value || ''}
                  onValueChange={onChange}
                  placeholder="Select contact preference"
                  error={errors.contactPreference?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="termsAccepted"
              render={({field: {onChange, value}}) => (
                <Checkbox
                  label={
                    <Text style={styles.termsText}>
                      I agree to the{' '}
                      <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                      <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                  }
                  checked={value === true}
                  onPress={() => onChange(!value)}
                  error={errors.termsAccepted?.message}
                />
              )}
            />
          </View>

          {/* Success Preview */}
          <View style={styles.previewCard}>
            <Text style={styles.previewIcon}>🎁</Text>
            <View style={styles.previewContent}>
              <Text style={styles.previewTitle}>Your offer is ready!</Text>
              <Text style={styles.previewText}>
                Complete this step to unlock exclusive deals tailored just for you.
              </Text>
            </View>
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
            title="Unlock My Offer"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: colors.gradient.end,
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
  termsText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: borderRadius.md,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  previewIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 2,
  },
  previewText: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
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
