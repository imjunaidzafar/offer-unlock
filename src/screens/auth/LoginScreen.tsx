import React from 'react';
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
import {SafeAreaWrapper, Input, Button} from '../../components/ui';
import {useAuthStore} from '../../store/useAuthStore';
import {useWizardStore} from '../../store/useWizardStore';
import {loginSchema, LoginFormData, safeZodResolver} from '../../utils/validation';
import {colors, shadows, borderRadius} from '../../theme';
import type {AuthStackParamList, RootStackParamList} from '../../types';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen: React.FC = () => {
  const authNavigation = useNavigation<AuthNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);
  const isWizardCompleted = useWizardStore(state => state.isCompleted);

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
      // Auth First: Navigate based on wizard completion status
      if (isWizardCompleted) {
        // Returning user who completed wizard - go to Home
        rootNavigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      } else {
        // User needs to complete wizard
        rootNavigation.reset({
          index: 0,
          routes: [{name: 'Wizard'}],
        });
      }
    } catch (err) {
      // Error is handled by the store and displayed via error state
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
          {/* Header with gradient accent */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoGradient}>
                <Text style={styles.logoIcon}>🔐</Text>
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to access your account and view your personalized offers.
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.formCard}>
            <Controller
              control={control}
              name="emailOrUsername"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Email or Username"
                  placeholder="Enter your email or username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.emailOrUsername?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                  autoComplete="current-password"
                />
              )}
            />

            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </View>

          <View style={styles.footer}>
            <Button
              title="Log In"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              loading={isLoading}
            />
            <View style={styles.signUpPrompt}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <Text style={styles.signUpLink} onPress={handleSignUp}>
                Sign up
              </Text>
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
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.gradient.start,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  logoIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: borderRadius.md,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: 20,
    ...shadows.md,
  },
  forgotPassword: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    paddingVertical: 24,
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  signUpLink: {
    fontSize: 15,
    color: colors.accent.primary,
    fontWeight: '600',
  },
});
