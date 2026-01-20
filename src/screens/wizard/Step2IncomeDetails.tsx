import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {SafeAreaWrapper, Input, Button, Select} from '../../components/ui';
import {FluidProgressBar} from '../../components/wizard/FluidProgressBar';
import {useWizardStore, useStep2Data} from '../../store/useWizardStore';
import {step2Schema, Step2FormData, safeZodResolver} from '../../utils/validation';
import {colors, shadows, borderRadius} from '../../theme';
import type {WizardStackParamList, Step2Data} from '../../types';

type NavigationProp = NativeStackNavigationProp<WizardStackParamList, 'Step2'>;

const employmentOptions = [
  {label: 'Employed', value: 'employed'},
  {label: 'Self-Employed', value: 'self-employed'},
  {label: 'Unemployed', value: 'unemployed'},
  {label: 'Retired', value: 'retired'},
];

const creditScoreOptions = [
  {label: 'Excellent (750+)', value: 'excellent'},
  {label: 'Good (700-749)', value: 'good'},
  {label: 'Fair (650-699)', value: 'fair'},
  {label: 'Poor (Below 650)', value: 'poor'},
];

export const Step2IncomeDetails: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const step2Data = useStep2Data();
  const updateStep2 = useWizardStore(state => state.updateStep2);
  const setCurrentStep = useWizardStore(state => state.setCurrentStep);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    watch,
  } = useForm<Step2FormData>({
    resolver: safeZodResolver(step2Schema),
    defaultValues: {
      employmentStatus: step2Data.employmentStatus,
      annualIncome: step2Data.annualIncome,
      creditScoreRange: step2Data.creditScoreRange,
    },
    mode: 'onTouched',
  });

  // Auto-save form data on change
  const watchedValues = watch();
  const watchedValuesRef = React.useRef(watchedValues);

  useEffect(() => {
    const hasChanged =
      watchedValuesRef.current.employmentStatus !== watchedValues.employmentStatus ||
      watchedValuesRef.current.annualIncome !== watchedValues.annualIncome ||
      watchedValuesRef.current.creditScoreRange !== watchedValues.creditScoreRange;

    if (hasChanged) {
      watchedValuesRef.current = watchedValues;
      updateStep2(watchedValues as Step2Data);
    }
  }, [watchedValues, updateStep2]);

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const onSubmit = (data: Step2FormData) => {
    updateStep2(data as Step2Data);
    navigation.navigate('Step3');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (!numericValue) return '';

    const parts = numericValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
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
          <FluidProgressBar currentStep={2} totalSteps={3} />

          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>💼</Text>
              </View>
              <Text style={styles.title}>Income Details</Text>
              <Text style={styles.subtitle}>
                Help us understand your financial profile to find the best offers for you.
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Controller
                control={control}
                name="employmentStatus"
                render={({field: {onChange, value}}) => (
                  <Select
                    label="Employment Status"
                    options={employmentOptions}
                    value={value || ''}
                    onValueChange={onChange}
                    placeholder="Select your employment status"
                    error={errors.employmentStatus?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="annualIncome"
                render={({field: {onChange, onBlur, value}}) => (
                  <View style={styles.incomeContainer}>
                    <Input
                      label="Annual Income"
                      placeholder="e.g., 75,000"
                      value={formatCurrency(value)}
                      onChangeText={text => onChange(text.replace(/[^0-9.]/g, ''))}
                      onBlur={onBlur}
                      error={errors.annualIncome?.message}
                      keyboardType="numeric"
                    />
                    <View style={styles.currencyBadge}>
                      <Text style={styles.currencyText}>$</Text>
                    </View>
                  </View>
                )}
              />

              <Controller
                control={control}
                name="creditScoreRange"
                render={({field: {onChange, value}}) => (
                  <Select
                    label="Credit Score Range"
                    options={creditScoreOptions}
                    value={value || ''}
                    onValueChange={onChange}
                    placeholder="Select your credit score range"
                    error={errors.creditScoreRange?.message}
                  />
                )}
              />
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🔒</Text>
              <Text style={styles.infoText}>
                Your information is secure and will only be used to personalize your offer.
              </Text>
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
    backgroundColor: colors.accent.primary,
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
  incomeContainer: {
    position: 'relative',
  },
  currencyBadge: {
    position: 'absolute',
    right: 16,
    top: 38,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    borderRadius: borderRadius.md,
    padding: 14,
    marginTop: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.accent.primary,
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
