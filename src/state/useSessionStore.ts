import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from './storage';
import type {AuthState, SignUpData, LoginData, User} from '../types';

let sessionHydrated = false;
const sessionHydrationListeners: Array<() => void> = [];

export const onSessionHydration = (callback: () => void) => {
  if (sessionHydrated) {
    callback();
  } else {
    sessionHydrationListeners.push(callback);
  }
};

export const isSessionHydrated = () => sessionHydrated;

const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import {storage} from './storage';

const USERS_STORAGE_KEY = 'mock-users-db';

const loadMockUsers = (): Map<string, {user: User; password: string}> => {
  try {
    const stored = storage.getString(USERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
  } catch (e) {
    // Ignore errors
  }
  return new Map();
};

const saveMockUsers = (users: Map<string, {user: User; password: string}>) => {
  const obj = Object.fromEntries(users);
  storage.set(USERS_STORAGE_KEY, JSON.stringify(obj));
};

const mockUsers = loadMockUsers();

export const useSessionStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signUp: async (data: SignUpData) => {
        set({isLoading: true, error: null});

        try {
          await mockDelay(1000);

          if (mockUsers.has(data.username.toLowerCase())) {
            throw new Error('Username already taken');
          }

          const emailExists = Array.from(mockUsers.values()).some(
            (u) => u.user.email.toLowerCase() === data.email.toLowerCase(),
          );
          if (emailExists) {
            throw new Error('Email already registered');
          }

          const newUser: User = {
            id: `user_${Date.now()}`,
            username: data.username,
            email: data.email,
            phone: data.phone,
          };

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
          await mockDelay(1000);

          let foundEntry: {user: User; password: string} | undefined;
          foundEntry = mockUsers.get(data.emailOrUsername.toLowerCase());

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
          mockUsers.delete(currentUser.username.toLowerCase());
          saveMockUsers(mockUsers);
        }
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
      name: 'session-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        sessionHydrated = true;
        sessionHydrationListeners.forEach(listener => listener());
        sessionHydrationListeners.length = 0;
      },
    },
  ),
);

export const useUser = () => useSessionStore((state) => state.user);
export const useIsAuthenticated = () => useSessionStore((state) => state.isAuthenticated);
export const useSessionLoading = () => useSessionStore((state) => state.isLoading);
export const useSessionError = () => useSessionStore((state) => state.error);
