import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  secureTextEntry = false,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: any) => {
    setIsFocused(false);
    textInputProps.onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getBorderColor = () => {
    if (error) return '#EF4444';
    if (isFocused) return '#4F46E5';
    return '#D1D5DB';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, error ? styles.labelError : undefined]}>{label}</Text>
      <View style={[styles.inputContainer, {borderColor: getBorderColor()}]}>
        <TextInput
          {...textInputProps}
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor="#9CA3AF"
          accessibilityLabel={label}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeButton}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}>
            <Text style={styles.eyeText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  labelError: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});
