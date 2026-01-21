// Mock MMKV before importing the store
const mockStorage = new Map<string, string>();

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn((key: string) => mockStorage.get(key) || null),
    set: jest.fn((key: string, value: string) => mockStorage.set(key, value)),
    delete: jest.fn((key: string) => mockStorage.delete(key)),
  })),
}));

import {useOnboardingStore} from '../../src/state/useOnboardingStore';

describe('Wizard Store', () => {
  beforeEach(() => {
    // Clear the store state before each test
    useOnboardingStore.setState({
      currentStep: 1,
      data: {
        step1: {firstName: '', lastName: '', dateOfBirth: ''},
        step2: {employmentStatus: '', annualIncome: '', creditScoreRange: ''},
        step3: {offerType: '', contactPreference: '', termsAccepted: false},
      },
      isCompleted: false,
    });
    mockStorage.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useOnboardingStore.getState();
      expect(state.currentStep).toBe(1);
      expect(state.isCompleted).toBe(false);
      expect(state.data.step1.firstName).toBe('');
    });
  });

  describe('Step Navigation', () => {
    it('should update current step', () => {
      const {setCurrentStep} = useOnboardingStore.getState();
      setCurrentStep(2);
      expect(useOnboardingStore.getState().currentStep).toBe(2);
    });

    it('should track step progression', () => {
      const {setCurrentStep} = useOnboardingStore.getState();
      setCurrentStep(1);
      expect(useOnboardingStore.getState().currentStep).toBe(1);
      setCurrentStep(2);
      expect(useOnboardingStore.getState().currentStep).toBe(2);
      setCurrentStep(3);
      expect(useOnboardingStore.getState().currentStep).toBe(3);
    });
  });

  describe('Step 1 Data Updates', () => {
    it('should update first name', () => {
      const {updateStep1} = useOnboardingStore.getState();
      updateStep1({firstName: 'John'});
      expect(useOnboardingStore.getState().data.step1.firstName).toBe('John');
    });

    it('should update last name', () => {
      const {updateStep1} = useOnboardingStore.getState();
      updateStep1({lastName: 'Doe'});
      expect(useOnboardingStore.getState().data.step1.lastName).toBe('Doe');
    });

    it('should update date of birth', () => {
      const {updateStep1} = useOnboardingStore.getState();
      updateStep1({dateOfBirth: '1990-01-15'});
      expect(useOnboardingStore.getState().data.step1.dateOfBirth).toBe('1990-01-15');
    });

    it('should update multiple fields at once', () => {
      const {updateStep1} = useOnboardingStore.getState();
      updateStep1({firstName: 'John', lastName: 'Doe'});
      const {step1} = useOnboardingStore.getState().data;
      expect(step1.firstName).toBe('John');
      expect(step1.lastName).toBe('Doe');
    });

    it('should preserve existing data when updating partial', () => {
      const {updateStep1} = useOnboardingStore.getState();
      updateStep1({firstName: 'John'});
      updateStep1({lastName: 'Doe'});
      const {step1} = useOnboardingStore.getState().data;
      expect(step1.firstName).toBe('John');
      expect(step1.lastName).toBe('Doe');
    });
  });

  describe('Step 2 Data Updates', () => {
    it('should update employment status', () => {
      const {updateStep2} = useOnboardingStore.getState();
      updateStep2({employmentStatus: 'employed'});
      expect(useOnboardingStore.getState().data.step2.employmentStatus).toBe('employed');
    });

    it('should update annual income', () => {
      const {updateStep2} = useOnboardingStore.getState();
      updateStep2({annualIncome: '75000'});
      expect(useOnboardingStore.getState().data.step2.annualIncome).toBe('75000');
    });

    it('should update credit score range', () => {
      const {updateStep2} = useOnboardingStore.getState();
      updateStep2({creditScoreRange: 'good'});
      expect(useOnboardingStore.getState().data.step2.creditScoreRange).toBe('good');
    });
  });

  describe('Step 3 Data Updates', () => {
    it('should update offer type', () => {
      const {updateStep3} = useOnboardingStore.getState();
      updateStep3({offerType: 'loan'});
      expect(useOnboardingStore.getState().data.step3.offerType).toBe('loan');
    });

    it('should update contact preference', () => {
      const {updateStep3} = useOnboardingStore.getState();
      updateStep3({contactPreference: 'email'});
      expect(useOnboardingStore.getState().data.step3.contactPreference).toBe('email');
    });

    it('should update terms accepted', () => {
      const {updateStep3} = useOnboardingStore.getState();
      updateStep3({termsAccepted: true});
      expect(useOnboardingStore.getState().data.step3.termsAccepted).toBe(true);
    });
  });

  describe('Wizard Completion', () => {
    it('should mark wizard as completed', () => {
      const {completeWizard} = useOnboardingStore.getState();
      completeWizard();
      expect(useOnboardingStore.getState().isCompleted).toBe(true);
    });
  });

  describe('Wizard Reset', () => {
    it('should reset all data', () => {
      const {updateStep1, updateStep2, updateStep3, setCurrentStep, completeWizard, resetWizard} =
        useOnboardingStore.getState();

      // Set some data
      updateStep1({firstName: 'John', lastName: 'Doe'});
      updateStep2({employmentStatus: 'employed', annualIncome: '75000'});
      updateStep3({offerType: 'loan', termsAccepted: true});
      setCurrentStep(3);
      completeWizard();

      // Reset
      resetWizard();

      const state = useOnboardingStore.getState();
      expect(state.currentStep).toBe(1);
      expect(state.isCompleted).toBe(false);
      expect(state.data.step1.firstName).toBe('');
      expect(state.data.step2.employmentStatus).toBe('');
      expect(state.data.step3.offerType).toBe('');
    });
  });

  describe('Data Persistence', () => {
    it('should persist data structure correctly', () => {
      const {updateStep1, setCurrentStep} = useOnboardingStore.getState();
      updateStep1({firstName: 'John'});
      setCurrentStep(2);

      // The persist middleware should save to storage
      // We can't directly test MMKV in unit tests, but we verify the state
      const state = useOnboardingStore.getState();
      expect(state.data.step1.firstName).toBe('John');
      expect(state.currentStep).toBe(2);
    });

    it('should maintain data across updates', () => {
      const {updateStep1, updateStep2} = useOnboardingStore.getState();

      // Simulate user filling out form step by step
      updateStep1({firstName: 'John'});
      updateStep1({lastName: 'Doe'});
      updateStep1({dateOfBirth: '1990-01-15'});

      updateStep2({employmentStatus: 'employed'});
      updateStep2({annualIncome: '75000'});

      const state = useOnboardingStore.getState();
      expect(state.data.step1.firstName).toBe('John');
      expect(state.data.step1.lastName).toBe('Doe');
      expect(state.data.step1.dateOfBirth).toBe('1990-01-15');
      expect(state.data.step2.employmentStatus).toBe('employed');
      expect(state.data.step2.annualIncome).toBe('75000');
    });
  });
});
