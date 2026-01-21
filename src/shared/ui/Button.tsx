import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, shadows, borderRadius} from '../../design';

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
          color={variant === 'outline' ? colors.accent.primary : colors.text.inverse}
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
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonPrimary: {
    backgroundColor: colors.accent.primary,
    ...shadows.md,
  },
  buttonSecondary: {
    backgroundColor: colors.text.secondary,
    ...shadows.sm,
  },
  buttonOutline: {
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.border.default,
    borderColor: colors.border.default,
    ...shadows.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDefault: {
    color: colors.text.inverse,
  },
  buttonTextOutline: {
    color: colors.accent.primary,
  },
  buttonTextDisabled: {
    color: colors.text.muted,
  },
});
