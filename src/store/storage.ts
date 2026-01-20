import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';

// Create MMKV instance
export const storage = new MMKV({
  id: 'offer-unlock-storage',
});

// Zustand persist storage adapter
export const zustandStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};
