// Design tokens for modern gradient-based UI
export const colors = {
  // Gradient colors
  gradient: {
    start: '#667eea', // Indigo
    middle: '#764ba2', // Purple
    end: '#f093fb', // Pink
  },

  // Accent colors
  accent: {
    primary: '#7C3AED', // Purple (new primary)
    blue: '#4F46E5', // Original
    pink: '#EC4899',
    cyan: '#06B6D4',
  },

  // Semantic colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',

  // Text colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Background colors
  background: {
    primary: '#F9FAFB',
    secondary: '#F3F4F6',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Border colors
  border: {
    default: '#E5E7EB',
    focus: '#7C3AED',
    error: '#EF4444',
  },
};

export const gradients = {
  primary: ['#667eea', '#764ba2'],
  secondary: ['#f093fb', '#f5576c'],
  auth: ['#667eea', '#764ba2', '#f093fb'],
  card: ['#FFFFFF', '#F9FAFB'],
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
