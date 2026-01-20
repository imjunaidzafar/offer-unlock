import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {colors, shadows, borderRadius} from '../../theme';

interface CheckboxProps {
  label: string | React.ReactNode;
  checked: boolean;
  onPress: () => void;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onPress,
  error,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        accessibilityRole="checkbox"
        accessibilityState={{checked}}
        accessibilityLabel={typeof label === 'string' ? label : 'checkbox'}>
        <View
          style={[
            styles.checkbox,
            checked ? styles.checkboxChecked : undefined,
            error ? styles.checkboxError : undefined,
          ]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        {typeof label === 'string' ? (
          <Text style={styles.label}>{label}</Text>
        ) : (
          <View style={styles.labelContainer}>{label}</View>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: colors.background.card,
    ...shadows.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  checkboxError: {
    borderColor: colors.error,
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '700',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 22,
  },
  labelContainer: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 38,
  },
});
