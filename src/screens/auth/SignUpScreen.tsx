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
import {signUpSchema, SignUpFormData, safeZodResolver} from '../../utils/validation';
import {colors, shadows, borderRadius} from '../../theme';
import type {AuthStackParamList, RootStackParamList} from '../../types';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SignUpScreen: React.FC = () => {
  const authNavigation = useNavigation<AuthNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const signUp = useAuthStore(state => state.signUp);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);

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
      // Auth First: New users go to Wizard
      rootNavigation.reset({
        index: 0,
        routes: [{name: 'Wizard'}],
      });
    } catch (err) {
      // Error is handled by the store and displayed via error state
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoGradient}>
                <Text style={styles.logoIcon}>✨</Text>
              </View>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us to unlock personalized offers tailored just for you.
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
              name="username"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Username"
                  placeholder="Choose a username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Mobile Phone"
                  placeholder="+1234567890"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label="Password"
                  placeholder="Create a strong password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                  autoComplete="new-password"
                />
              )}
            />

            <View style={styles.passwordHints}>
              <Text style={styles.hintTitle}>Password requirements:</Text>
              <Text style={styles.hint}>• At least 8 characters</Text>
              <Text style={styles.hint}>• One uppercase & lowercase letter</Text>
              <Text style={styles.hint}>• One number & special character</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
              loading={isLoading}
            />
            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text style={styles.loginLink} onPress={handleLogin}>
                Log in
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.accent.primary,
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
  passwordHints: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: 14,
    marginTop: 12,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  footer: {
    paddingVertical: 24,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: 15,
    color: colors.accent.primary,
    fontWeight: '600',
  },
});
