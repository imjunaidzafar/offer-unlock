import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from './storage';
import type {AuthState, SignUpData, LoginData, User} from '../types';

// Hydration state
let authHydrated = false;
const authHydrationListeners: Array<() => void> = [];

export const onAuthHydration = (callback: () => void) => {
  if (authHydrated) {
    callback();
  } else {
    authHydrationListeners.push(callback);
  }
};

export const isAuthHydrated = () => authHydrated;

// Mock API delay
const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database with persistence
import {storage} from './storage';

const USERS_STORAGE_KEY = 'mock-users-db';

// Load users from storage
const loadMockUsers = (): Map<string, {user: User; password: string}> => {
  try {
    const stored = storage.getString(USERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
  } catch (e) {
    // Ignore errors, start with empty map
  }
  return new Map();
};

// Save users to storage
const saveMockUsers = (users: Map<string, {user: User; password: string}>) => {
  const obj = Object.fromEntries(users);
  storage.set(USERS_STORAGE_KEY, JSON.stringify(obj));
};

const mockUsers = loadMockUsers();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signUp: async (data: SignUpData) => {
        set({isLoading: true, error: null});

        try {
          // Simulate network delay
          await mockDelay(1000);

          // Check if username already exists
          if (mockUsers.has(data.username.toLowerCase())) {
            throw new Error('Username already taken');
          }

          // Check if email already exists
          const emailExists = Array.from(mockUsers.values()).some(
            (u) => u.user.email.toLowerCase() === data.email.toLowerCase(),
          );
          if (emailExists) {
            throw new Error('Email already registered');
          }

          // Create new user
          const newUser: User = {
            id: `user_${Date.now()}`,
            username: data.username,
            email: data.email,
            phone: data.phone,
          };

          // Store in mock database
          mockUsers.set(data.username.toLowerCase(), {
            user: newUser,
            password: data.password,
          });
          saveMockUsers(mockUsers);

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Sign up failed. Please try again.';
          set({isLoading: false, error: message});
          throw error;
        }
      },

      login: async (data: LoginData) => {
        set({isLoading: true, error: null});

        try {
          // Simulate network delay
          await mockDelay(1000);

          // Find user by username or email
          let foundEntry: {user: User; password: string} | undefined;

          // Check by username
          foundEntry = mockUsers.get(data.emailOrUsername.toLowerCase());

          // If not found, check by email
          if (!foundEntry) {
            foundEntry = Array.from(mockUsers.values()).find(
              (u) => u.user.email.toLowerCase() === data.emailOrUsername.toLowerCase(),
            );
          }

          if (!foundEntry) {
            throw new Error('Invalid credentials');
          }

          if (foundEntry.password !== data.password) {
            throw new Error('Invalid credentials');
          }

          set({
            user: foundEntry.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
          set({isLoading: false, error: message});
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      deleteAccount: () => {
        const currentUser = get().user;
        if (currentUser) {
          // Remove user from mock database
          mockUsers.delete(currentUser.username.toLowerCase());
          saveMockUsers(mockUsers);
        }
        // Clear auth state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({error: null});
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        authHydrated = true;
        authHydrationListeners.forEach(listener => listener());
        authHydrationListeners.length = 0;
      },
    },
  ),
);

// Selector hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
