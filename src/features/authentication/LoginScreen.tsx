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
import {loginSchema, LoginFormData, safeZodResolver} from '../../lib/schemas';
import {colors, shadows, borderRadius} from '../../design';
import type {AuthStackParamList, RootStackParamList} from '../../types';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen: React.FC = () => {
  const authNavigation = useNavigation<AuthNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const login = useSessionStore(state => state.login);
  const isLoading = useSessionStore(state => state.isLoading);
  const error = useSessionStore(state => state.error);
  const clearError = useSessionStore(state => state.clearError);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<LoginFormData>({
    resolver: safeZodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data);
      const wizardCompleted = useOnboardingStore.getState().isCompleted;
      if (wizardCompleted) {
        rootNavigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      } else {
        rootNavigation.reset({
          index: 0,
          routes: [{name: 'Wizard'}],
        });
      }
    } catch (err) {
      // Error handled by store
    }
  };

  const handleSignUp = () => {
    authNavigation.navigate('SignUp');
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
          {/* Decorative top section */}
          <View style={styles.topDecor}>
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <View style={styles.iconBg}>
                <Text style={styles.iconText}>👋</Text>
              </View>
            </View>
            <Text style={styles.greeting}>Hey there!</Text>
            <Text style={styles.title}>Sign in to continue</Text>
            <Text style={styles.subtitle}>
              Access your personalized deals and exclusive offers
            </Text>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorIconText}>!</Text>
              </View>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account</Text>
              <Controller
                control={control}
                name="emailOrUsername"
                render={({field: {onChange, onBlur, value}}) => (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <View style={styles.inputField}>
                      <Input
                        placeholder="Email or username"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.emailOrUsername?.message}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({field: {onChange, onBlur, value}}) => (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <View style={styles.inputField}>
                      <Input
                        placeholder="Your secret password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.password?.message}
                        secureTextEntry
                        autoComplete="current-password"
                      />
                    </View>
                  </View>
                )}
              />
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.signInButton, !isValid && styles.signInButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading}
              activeOpacity={0.8}>
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Signing in...' : 'Continue →'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.createAccountButton} onPress={handleSignUp}>
              <Text style={styles.createAccountText}>Create new account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
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
    backgroundColor: colors.background.primary,
  },
  topDecor: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: 200,
  },
  decorCircle1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.accent.primary,
    opacity: 0.1,
  },
  decorCircle2: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent.secondary,
    opacity: 0.15,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  iconText: {
    fontSize: 28,
  },
  greeting: {
    fontSize: 16,
    color: colors.accent.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.muted,
    lineHeight: 22,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  errorIconText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 14,
  },
  inputField: {
    flex: 1,
  },
  actionSection: {
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    ...shadows.md,
  },
  signInButtonDisabled: {
    backgroundColor: colors.border.default,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.text.muted,
    fontSize: 14,
  },
  createAccountButton: {
    borderWidth: 2,
    borderColor: colors.accent.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.background.card,
  },
  createAccountText: {
    color: colors.accent.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
