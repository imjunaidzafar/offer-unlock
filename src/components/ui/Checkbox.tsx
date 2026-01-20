import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

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
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkboxError: {
    borderColor: '#EF4444',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  labelContainer: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 36,
  },
});
