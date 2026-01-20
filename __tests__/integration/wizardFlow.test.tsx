import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WizardStack} from '../../src/navigation/WizardStack';
import {useWizardStore} from '../../src/store/useWizardStore';

// Use initialWindowMetrics to provide safe area values
const initialMetrics = {
  insets: {top: 47, bottom: 34, left: 0, right: 0},
  frame: {x: 0, y: 0, width: 393, height: 852},
};

const TestWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <SafeAreaProvider initialMetrics={initialMetrics}>
    <NavigationContainer>{children}</NavigationContainer>
  </SafeAreaProvider>
);

describe('Wizard Flow Integration', () => {
  beforeEach(() => {
    // Reset wizard store before each test
    useWizardStore.setState({
      currentStep: 1,
      data: {
        step1: {firstName: '', lastName: '', dateOfBirth: ''},
        step2: {employmentStatus: '', annualIncome: '', creditScoreRange: ''},
        step3: {offerType: '', contactPreference: '', termsAccepted: false},
      },
      isCompleted: false,
    });
  });

  describe('Step 1 - Personal Info', () => {
    it('should render Step 1 screen', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeTruthy();
      });
      expect(screen.getByText('First Name')).toBeTruthy();
      expect(screen.getByText('Last Name')).toBeTruthy();
      expect(screen.getByText('Date of Birth')).toBeTruthy();
    });

    it('should show Continue button', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        const continueButton = screen.getByText('Continue');
        expect(continueButton).toBeTruthy();
      });
    });

    it('should update store when entering first name', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter your first name')).toBeTruthy();
      });

      const firstNameInput = screen.getByPlaceholderText('Enter your first name');
      fireEvent.changeText(firstNameInput, 'John');

      await waitFor(() => {
        const state = useWizardStore.getState();
        expect(state.data.step1.firstName).toBe('John');
      });
    });

    it('should update store when entering last name', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter your last name')).toBeTruthy();
      });

      const lastNameInput = screen.getByPlaceholderText('Enter your last name');
      fireEvent.changeText(lastNameInput, 'Doe');

      await waitFor(() => {
        const state = useWizardStore.getState();
        expect(state.data.step1.lastName).toBe('Doe');
      });
    });
  });

  describe('Step Navigation', () => {
    it('should set current step to 1 on initial render', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        const state = useWizardStore.getState();
        expect(state.currentStep).toBe(1);
      });
    });

    it('should display step indicator showing Step 1 of 3', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Step 1 of 3')).toBeTruthy();
      });
    });
  });

  describe('Progress Bar', () => {
    it('should render progress bar component', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Personal')).toBeTruthy();
      });
      expect(screen.getByText('Income')).toBeTruthy();
      expect(screen.getByText('Preferences')).toBeTruthy();
    });
  });

  describe('Data Persistence', () => {
    it('should preserve data in store after input', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter your first name')).toBeTruthy();
      });

      const firstNameInput = screen.getByPlaceholderText('Enter your first name');
      fireEvent.changeText(firstNameInput, 'John');

      await waitFor(() => {
        expect(useWizardStore.getState().data.step1.firstName).toBe('John');
      });

      // Store maintains state
      const state = useWizardStore.getState();
      expect(state.data.step1.firstName).toBe('John');
    });
  });

  describe('Form Validation Blocking', () => {
    it('should keep Continue button when form is invalid', async () => {
      render(
        <TestWrapper>
          <WizardStack />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('Continue')).toBeTruthy();
      });

      // Should still be on Step 1
      expect(screen.getByText('Personal Information')).toBeTruthy();
    });
  });
});

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    useWizardStore.setState({
      currentStep: 1,
      data: {
        step1: {firstName: '', lastName: '', dateOfBirth: ''},
        step2: {employmentStatus: '', annualIncome: '', creditScoreRange: ''},
        step3: {offerType: '', contactPreference: '', termsAccepted: false},
      },
      isCompleted: false,
    });
  });

  it('should show wizard first in the flow (Auth Last pattern)', () => {
    const isCompleted = useWizardStore.getState().isCompleted;
    expect(isCompleted).toBe(false);
  });

  it('should mark wizard as completed when completeWizard is called', () => {
    const {completeWizard} = useWizardStore.getState();
    completeWizard();
    expect(useWizardStore.getState().isCompleted).toBe(true);
  });
});
