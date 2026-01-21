import React from 'react';
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
import {SafeAreaWrapper, Input, Button} from '../../shared/ui';
import {useSessionStore} from '../../state/useSessionStore';
import {useOnboardingStore} from '../../state/useOnboardingStore';
import {signUpSchema, SignUpFormData, safeZodResolver} from '../../lib/schemas';
import {colors, shadows, borderRadius} from '../../design';
import type {AuthStackParamList, RootStackParamList} from '../../types';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SignUpScreen: React.FC = () => {
  const authNavigation = useNavigation<AuthNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const signUp = useSessionStore(state => state.signUp);
  const isLoading = useSessionStore(state => state.isLoading);
  const error = useSessionStore(state => state.error);
  const clearError = useSessionStore(state => state.clearError);
  const resetWizard = useOnboardingStore(state => state.resetWizard);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<SignUpFormData>({
    resolver: safeZodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      clearError();
      await signUp(data);
      // Reset wizard data for new user
      resetWizard();
      rootNavigation.reset({
        index: 0,
        routes: [{name: 'Wizard'}],
      });
    } catch (err) {
      // Error handled by store
    }
  };

  const handleLogin = () => {
    authNavigation.navigate('Login');
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
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleLogin}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🚀 Join 10K+ users</Text>
            </View>
            <Text style={styles.title}>Get Started</Text>
            <Text style={styles.subtitle}>
              Create your account in seconds and unlock amazing deals
            </Text>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorEmoji}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="username"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.fieldIcon}>👤</Text>
                    <Text style={styles.fieldLabel}>Username</Text>
                  </View>
                  <Input
                    placeholder="Pick a unique username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.username?.message}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.fieldIcon}>✉️</Text>
                    <Text style={styles.fieldLabel}>Email Address</Text>
                  </View>
                  <Input
                    placeholder="name@company.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.fieldIcon}>📱</Text>
                    <Text style={styles.fieldLabel}>Phone Number</Text>
                  </View>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.fieldIcon}>🔐</Text>
                    <Text style={styles.fieldLabel}>Password</Text>
                  </View>
                  <Input
                    placeholder="Min. 8 characters"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry
                    autoComplete="new-password"
                  />
                </View>
              )}
            />

            {/* Password Strength */}
            <View style={styles.strengthCard}>
              <Text style={styles.strengthTitle}>Strong password includes:</Text>
              <View style={styles.strengthRow}>
                <View style={styles.strengthItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.strengthText}>8+ characters</Text>
                </View>
                <View style={styles.strengthItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.strengthText}>Uppercase</Text>
                </View>
              </View>
              <View style={styles.strengthRow}>
                <View style={styles.strengthItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.strengthText}>Numbers</Text>
                </View>
                <View style={styles.strengthItem}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.strengthText}>Symbols</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading}
              activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Text>
              {!isLoading && <Text style={styles.submitArrow}>→</Text>}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already a member? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Sign in here</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    marginTop: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  backArrow: {
    fontSize: 22,
    color: colors.text.primary,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 13,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.muted,
    lineHeight: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 16,
  },
  errorEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  strengthCard: {
    backgroundColor: colors.accent.primary + '10',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.accent.primary + '20',
  },
  strengthTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent.primary,
    marginBottom: 12,
  },
  strengthRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  strengthItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 12,
    color: colors.accent.primary,
    marginRight: 6,
    fontWeight: '700',
  },
  strengthText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  actionContainer: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  submitButtonDisabled: {
    backgroundColor: colors.border.default,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  submitArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: colors.text.muted,
  },
  loginLink: {
    fontSize: 15,
    color: colors.accent.primary,
    fontWeight: '700',
  },
});
