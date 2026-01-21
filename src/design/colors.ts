// Modern emerald/teal design system
export const colors = {
  // Primary gradient
  gradient: {
    start: '#059669', // Emerald
    middle: '#0D9488', // Teal
    end: '#0F766E', // Dark teal
  },

  // Accent palette
  accent: {
    primary: '#10B981', // Emerald 500
    secondary: '#14B8A6', // Teal 500
    gold: '#F59E0B', // Amber for highlights
    coral: '#F97316', // Orange accent
  },

  // Semantic
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#06B6D4',

  // Text
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Backgrounds
  background: {
    primary: '#F0FDF4', // Light mint
    secondary: '#ECFDF5',
    card: '#FFFFFF',
    dark: '#064E3B',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },

  // Borders
  border: {
    default: '#D1FAE5',
    focus: '#10B981',
    error: '#EF4444',
  },
};

export const gradients = {
  primary: ['#059669', '#0D9488'],
  secondary: ['#10B981', '#14B8A6'],
  warm: ['#F59E0B', '#F97316'],
  dark: ['#064E3B', '#065F46'],
  card: ['#FFFFFF', '#F0FDF4'],
  auth: ['#059669', '#0D9488', '#0F766E'],
};

export const shadows = {
  sm: {
    shadowColor: '#059669',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#059669',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#059669',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
