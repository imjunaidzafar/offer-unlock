// Fix for Reanimated Animated.View/Text type issues with React 18
import 'react-native-reanimated';

declare module 'react-native-reanimated' {
  interface AnimatedViewProps {
    children?: React.ReactNode;
  }
  interface AnimatedTextProps {
    children?: React.ReactNode;
  }
}
