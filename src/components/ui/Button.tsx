import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.button];

    switch (variant) {
      case 'secondary':
        baseStyles.push(styles.buttonSecondary);
        break;
      case 'outline':
        baseStyles.push(styles.buttonOutline);
        break;
      default:
        baseStyles.push(styles.buttonPrimary);
    }

    if (isDisabled) {
      baseStyles.push(styles.buttonDisabled);
    }

    if (style) {
      baseStyles.push(style);
    }

    return baseStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyles: TextStyle[] = [styles.buttonText];

    switch (variant) {
      case 'outline':
        baseStyles.push(styles.buttonTextOutline);
        break;
      default:
        baseStyles.push(styles.buttonTextDefault);
    }

    if (isDisabled) {
      baseStyles.push(styles.buttonTextDisabled);
    }

    if (textStyle) {
      baseStyles.push(textStyle);
    }

    return baseStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled}}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#4F46E5' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonPrimary: {
    backgroundColor: '#4F46E5',
  },
  buttonSecondary: {
    backgroundColor: '#6B7280',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    borderColor: '#D1D5DB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDefault: {
    color: '#FFFFFF',
  },
  buttonTextOutline: {
    color: '#4F46E5',
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
});
