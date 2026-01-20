// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native-gesture-handler BEFORE any imports
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn((component) => component),
    Directions: {},
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn(() => null),
    set: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(() => false),
    getAllKeys: jest.fn(() => []),
  })),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    enableScreens: jest.fn(),
    screensEnabled: jest.fn(() => true),
    Screen: View,
    ScreenContainer: View,
    ScreenStack: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    ScreenStackHeaderBackButtonImage: View,
    ScreenStackHeaderRightView: View,
    ScreenStackHeaderLeftView: View,
    ScreenStackHeaderCenterView: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    NativeScreenNavigationContainer: View,
    SearchBar: View,
    FullWindowOverlay: View,
  };
});

// Mock safe area context with proper context value
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const insets = {top: 47, bottom: 34, left: 0, right: 0};
  const frame = {x: 0, y: 0, width: 393, height: 852};

  const SafeAreaContext = React.createContext({
    insets,
    frame,
    onInsetsChange: jest.fn(),
  });

  return {
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: ({children}) => children,
    SafeAreaInsetsContext: SafeAreaContext,
    SafeAreaFrameContext: React.createContext(frame),
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: {insets, frame},
  };
});

// Mock @react-navigation/elements SafeAreaProviderCompat
jest.mock('@react-navigation/elements', () => {
  const React = require('react');
  const actual = jest.requireActual('@react-navigation/elements');
  return {
    ...actual,
    SafeAreaProviderCompat: ({children}) => children,
  };
});

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const MockDateTimePicker = () => null;
  return MockDateTimePicker;
});

// Mock BackHandler
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  addEventListener: jest.fn(() => ({remove: jest.fn()})),
  removeEventListener: jest.fn(),
  exitApp: jest.fn(),
}));

// Mock react-native-bootsplash
jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValue(undefined),
  isVisible: jest.fn().mockResolvedValue(false),
  useHideAnimation: jest.fn().mockReturnValue({
    container: {},
    logo: {source: 0},
    brand: {source: 0},
  }),
}));

// Suppress console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  if (
    args[0]?.includes?.('Animated') ||
    args[0]?.includes?.('useNativeDriver') ||
    args[0]?.includes?.('componentWillReceiveProps') ||
    args[0]?.includes?.('componentWillMount')
  ) {
    return;
  }
  originalWarn(...args);
};

console.error = (...args) => {
  if (
    args[0]?.includes?.('Warning: An update to') ||
    args[0]?.includes?.('act(...)') ||
    args[0]?.includes?.('not wrapped in act')
  ) {
    return;
  }
  originalError(...args);
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
