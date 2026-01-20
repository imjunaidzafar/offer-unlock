import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {SafeAreaWrapper, Input, Button} from '../../components/ui';
import {useAuthStore} from '../../store/useAuthStore';
import {signUpSchema, SignUpFormData, safeZodResolver} from '../../utils/validation';
import type {AuthStackParamList, RootStackParamList} from '../../types';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SignUpScreen: React.FC = () => {
  const authNavigation = useNavigation<AuthNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();
  const signUp = useAuthStore((state) => state.signUp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

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
      // Navigate to Result screen on success
      rootNavigation.reset({
        index: 0,
        routes: [{name: 'Result'}],
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
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.lockIcon}>
              <Text style={styles.lockEmoji}>🔓</Text>
            </View>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Sign up to unlock your personalized offer and save your progress.
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
              <Text style={styles.hintTitle}>Password must contain:</Text>
              <Text style={styles.hint}>• At least 8 characters</Text>
              <Text style={styles.hint}>• One uppercase letter</Text>
              <Text style={styles.hint}>• One lowercase letter</Text>
              <Text style={styles.hint}>• One number</Text>
              <Text style={styles.hint}>• One special character</Text>
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
  passwordHints: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    paddingVertical: 24,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
});
