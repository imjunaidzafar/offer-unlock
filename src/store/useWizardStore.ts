import {create} from 'zustand';
import {persist, createJSONStorage, PersistOptions} from 'zustand/middleware';
import {zustandStorage} from './storage';
import type {WizardState, Step1Data, Step2Data, Step3Data, WizardData} from '../types';

// Hydration state
let wizardHydrated = false;
const wizardHydrationListeners: Array<() => void> = [];

export const onWizardHydration = (callback: () => void) => {
  if (wizardHydrated) {
    callback();
  } else {
    wizardHydrationListeners.push(callback);
  }
};

export const isWizardHydrated = () => wizardHydrated;

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

export const useWizardStore = create<WizardState>()(
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
      name: 'wizard-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
        isCompleted: state.isCompleted,
      }),
      onRehydrateStorage: () => (state) => {
        wizardHydrated = true;
        wizardHydrationListeners.forEach(listener => listener());
        wizardHydrationListeners.length = 0;
      },
    },
  ),
);

// Selector hooks for better performance
export const useWizardStep = () => useWizardStore((state) => state.currentStep);
export const useWizardData = () => useWizardStore((state) => state.data);
export const useStep1Data = () => useWizardStore((state) => state.data.step1);
export const useStep2Data = () => useWizardStore((state) => state.data.step2);
export const useStep3Data = () => useWizardStore((state) => state.data.step3);
export const useWizardCompleted = () => useWizardStore((state) => state.isCompleted);

// Helper to check if wizard is completed (for use outside React components)
export const isWizardCompletedSync = () => useWizardStore.getState().isCompleted;
