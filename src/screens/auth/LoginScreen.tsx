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
import {loginSchema, LoginFormData, safeZodResolver} from '../../utils/validation';
import type {AuthStackParamList, RootStackParamList} from '../../types';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen: React.FC = () => {
  const authNavigation = useNavigation<AuthNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

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
      // Navigate to Result screen on success
      rootNavigation.reset({
        index: 0,
        routes: [{name: 'Result'}],
      });
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
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.lockIcon}>
              <Text style={styles.lockEmoji}>🔐</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to access your account and view your offers.
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
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
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lockEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    paddingVertical: 24,
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signUpLink: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
});
