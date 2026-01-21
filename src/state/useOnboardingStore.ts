import {create} from 'zustand';
import {persist, createJSONStorage, PersistOptions} from 'zustand/middleware';
import {zustandStorage} from './storage';
import type {WizardState, Step1Data, Step2Data, Step3Data, WizardData} from '../types';

let onboardingHydrated = false;
const onboardingHydrationListeners: Array<() => void> = [];

export const onOnboardingHydration = (callback: () => void) => {
  if (onboardingHydrated) {
    callback();
  } else {
    onboardingHydrationListeners.push(callback);
  }
};

export const isOnboardingHydrated = () => onboardingHydrated;

const initialData: WizardData = {
  step1: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  },
  step2: {
    employmentStatus: '',
    annualIncome: '',
    creditScoreRange: '',
  },
  step3: {
    offerType: '',
    contactPreference: '',
    termsAccepted: false,
  },
};

export const useOnboardingStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: initialData,
      isCompleted: false,

      setCurrentStep: (step: number) => {
        set({currentStep: step});
      },

      updateStep1: (data: Partial<Step1Data>) => {
        set((state) => ({
          data: {
            ...state.data,
            step1: {...state.data.step1, ...data},
          },
        }));
      },

      updateStep2: (data: Partial<Step2Data>) => {
        set((state) => ({
          data: {
            ...state.data,
            step2: {...state.data.step2, ...data},
          },
        }));
      },

      updateStep3: (data: Partial<Step3Data>) => {
        set((state) => ({
          data: {
            ...state.data,
            step3: {...state.data.step3, ...data},
          },
        }));
      },

      completeWizard: () => {
        set({isCompleted: true});
      },

      resetWizard: () => {
        set({
          currentStep: 1,
          data: initialData,
          isCompleted: false,
        });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
        isCompleted: state.isCompleted,
      }),
      onRehydrateStorage: () => (state) => {
        onboardingHydrated = true;
        onboardingHydrationListeners.forEach(listener => listener());
        onboardingHydrationListeners.length = 0;
      },
    },
  ),
);

export const useOnboardingStep = () => useOnboardingStore((state) => state.currentStep);
export const useOnboardingData = () => useOnboardingStore((state) => state.data);
export const useStep1Data = () => useOnboardingStore((state) => state.data.step1);
export const useStep2Data = () => useOnboardingStore((state) => state.data.step2);
export const useStep3Data = () => useOnboardingStore((state) => state.data.step3);
export const useOnboardingCompleted = () => useOnboardingStore((state) => state.isCompleted);
export const isOnboardingCompletedSync = () => useOnboardingStore.getState().isCompleted;
