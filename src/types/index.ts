// Wizard Step 1 - Personal Info
export interface Step1Data {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
}

// Wizard Step 2 - Income Details
export type EmploymentStatus = 'employed' | 'self-employed' | 'unemployed' | 'retired';
export type CreditScoreRange = 'excellent' | 'good' | 'fair' | 'poor';

export interface Step2Data {
  employmentStatus: EmploymentStatus | '';
  annualIncome: string;
  creditScoreRange: CreditScoreRange | '';
}

// Wizard Step 3 - Preferences
export type OfferType = 'loan' | 'credit-card' | 'insurance';
export type ContactPreference = 'email' | 'phone' | 'both';

export interface Step3Data {
  offerType: OfferType | '';
  contactPreference: ContactPreference | '';
  termsAccepted: boolean;
}

// Complete Wizard Data
export interface WizardData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
}

// Auth Data
export interface SignUpData {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
}

// Wizard Store State
export interface WizardState {
  currentStep: number;
  data: WizardData;
  isCompleted: boolean;
  setCurrentStep: (step: number) => void;
  updateStep1: (data: Partial<Step1Data>) => void;
  updateStep2: (data: Partial<Step2Data>) => void;
  updateStep3: (data: Partial<Step3Data>) => void;
  completeWizard: () => void;
  resetWizard: () => void;
}

// Auth Store State
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Wizard: undefined;
  Result: undefined;
  Home: undefined;
  Compare: undefined;
  Support: undefined;
  Settings: undefined;
};

export type WizardStackParamList = {
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};
