import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ViewStyle,
} from 'react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  error,
  containerStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, error ? styles.labelError : undefined]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.selectButton,
          error ? styles.selectButtonError : styles.selectButtonDefault,
        ]}
        onPress={() => setIsOpen(true)}
        accessibilityLabel={`${label}, ${selectedOption?.label || placeholder}`}
        accessibilityRole="button">
        <Text
          style={[
            styles.selectText,
            !selectedOption && styles.placeholderText,
          ]}>
          {selectedOption?.label || placeholder}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}>
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  selectButtonDefault: {
    borderColor: '#D1D5DB',
  },
  selectButtonError: {
    borderColor: '#EF4444',
  },
  selectText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionSelected: {
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#4F46E5',
    fontWeight: '500',
  },
});
