import React from 'react';
import {StyleSheet, ViewStyle, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  backgroundColor = '#F9FAFB',
  edges = ['top', 'bottom', 'left', 'right'],
}) => {
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor}, style]}
      edges={edges}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
