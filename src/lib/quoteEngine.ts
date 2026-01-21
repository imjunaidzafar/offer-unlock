import type {Step2Data, Step3Data} from '../types';

// APR rates by credit score
const CREDIT_SCORE_APR: Record<string, {loan: number; creditCard: number}> = {
  excellent: {loan: 5.9, creditCard: 14.9},
  good: {loan: 8.9, creditCard: 17.9},
  fair: {loan: 12.9, creditCard: 21.9},
  poor: {loan: 18.9, creditCard: 24.9},
  '': {loan: 12.9, creditCard: 21.9}, // Default
};

const EMPLOYMENT_MULTIPLIER: Record<string, number> = {
  employed: 1.0,
  'self-employed': 0.85,
  retired: 0.7,
  unemployed: 0.3,
  '': 0.5, // Default
};

const INSURANCE_BASE_RATE: Record<string, number> = {
  excellent: 19,
  good: 29,
  fair: 45,
  poor: 65,
  '': 39, // Default
};

export interface LoanOffer {
  type: 'loan';
  title: string;
  maxAmount: number;
  approvedAmount: number;
  apr: number;
  monthlyPayment: number;
  term: number; // months
  icon: string;
}

export interface CreditCardOffer {
  type: 'credit-card';
  title: string;
  creditLimit: number;
  introApr: number;
  regularApr: number;
  introPeriod: number; // months
  cashBack: number; // percentage
  icon: string;
}

export interface InsuranceOffer {
  type: 'insurance';
  title: string;
  coverageAmount: number;
  monthlyPremium: number;
  termYears: number;
  icon: string;
}

export type CalculatedOffer = LoanOffer | CreditCardOffer | InsuranceOffer;

const parseIncome = (incomeStr: string): number => {
  if (!incomeStr) return 0;
  const cleaned = incomeStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyDecimal = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  termMonths: number,
): number => {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;

  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return Math.round(payment * 100) / 100;
};

export const calculateLoanOffer = (
  step2Data: Step2Data,
): LoanOffer => {
  const income = parseIncome(step2Data.annualIncome);
  const creditScore = step2Data.creditScoreRange || '';
  const employment = step2Data.employmentStatus || '';

  const baseLoanAmount = income * 0.3;
  const multiplier = EMPLOYMENT_MULTIPLIER[employment] || 0.5;
  const maxAmount = Math.min(baseLoanAmount * multiplier, 50000);
  const approvedAmount = Math.round(maxAmount / 1000) * 1000;
  const apr = CREDIT_SCORE_APR[creditScore]?.loan || 12.9;
  const term = approvedAmount <= 10000 ? 36 : approvedAmount <= 25000 ? 48 : 60;
  const monthlyPayment = calculateMonthlyPayment(approvedAmount, apr, term);

  return {
    type: 'loan',
    title: 'Personal Loan',
    maxAmount: 50000,
    approvedAmount: Math.max(approvedAmount, 5000), // Minimum $5,000
    apr,
    monthlyPayment: Math.max(approvedAmount, 5000) === 5000
      ? calculateMonthlyPayment(5000, apr, term)
      : monthlyPayment,
    term,
    icon: '💰',
  };
};

export const calculateCreditCardOffer = (
  step2Data: Step2Data,
): CreditCardOffer => {
  const income = parseIncome(step2Data.annualIncome);
  const creditScore = step2Data.creditScoreRange || '';
  const employment = step2Data.employmentStatus || '';

  const baseLimit = income * 0.15;
  const multiplier = EMPLOYMENT_MULTIPLIER[employment] || 0.5;
  const calculatedLimit = Math.min(baseLimit * multiplier, 25000);
  const creditLimit = Math.round(calculatedLimit / 500) * 500;
  const regularApr = CREDIT_SCORE_APR[creditScore]?.creditCard || 21.9;

  let introApr = 0;
  let introPeriod = 0;
  let cashBack = 1;

  if (creditScore === 'excellent') {
    introApr = 0;
    introPeriod = 21;
    cashBack = 2;
  } else if (creditScore === 'good') {
    introApr = 0;
    introPeriod = 15;
    cashBack = 1.5;
  } else if (creditScore === 'fair') {
    introApr = 0;
    introPeriod = 12;
    cashBack = 1;
  } else {
    introApr = regularApr; // No intro period for poor credit
    introPeriod = 0;
    cashBack = 0.5;
  }

  return {
    type: 'credit-card',
    title: 'Premium Credit Card',
    creditLimit: Math.max(creditLimit, 5000), // Minimum $5,000
    introApr,
    regularApr,
    introPeriod,
    cashBack,
    icon: '💳',
  };
};

export const calculateInsuranceOffer = (
  step2Data: Step2Data,
): InsuranceOffer => {
  const income = parseIncome(step2Data.annualIncome);
  const creditScore = step2Data.creditScoreRange || '';
  const employment = step2Data.employmentStatus || '';

  const baseCoverage = income * 10;
  const multiplier = EMPLOYMENT_MULTIPLIER[employment] || 0.5;
  const calculatedCoverage = Math.min(baseCoverage * multiplier, 1000000);
  const coverageAmount = Math.round(calculatedCoverage / 50000) * 50000;
  const baseRate = INSURANCE_BASE_RATE[creditScore] || 39;
  const monthlyPremium = Math.round((baseRate * (coverageAmount / 100000)) * 100) / 100;
  const termYears = coverageAmount <= 250000 ? 10 : coverageAmount <= 500000 ? 20 : 30;

  return {
    type: 'insurance',
    title: 'Life Insurance',
    coverageAmount: Math.max(coverageAmount, 100000), // Minimum $100,000
    monthlyPremium: Math.max(coverageAmount, 100000) === 100000
      ? baseRate
      : Math.max(monthlyPremium, 15),
    termYears: Math.max(coverageAmount, 100000) === 100000 ? 20 : termYears,
    icon: '🛡️',
  };
};

export const calculateOffer = (
  step2Data: Step2Data,
  step3Data: Step3Data,
): CalculatedOffer => {
  const offerType = step3Data.offerType;

  switch (offerType) {
    case 'loan':
      return calculateLoanOffer(step2Data);
    case 'credit-card':
      return calculateCreditCardOffer(step2Data);
    case 'insurance':
      return calculateInsuranceOffer(step2Data);
    default:
      return calculateLoanOffer(step2Data); // Default to loan
  }
};

export const getOfferSummary = (offer: CalculatedOffer): {
  title: string;
  amount: string;
  rate: string;
  icon: string;
  details: string;
} => {
  switch (offer.type) {
    case 'loan':
      return {
        title: offer.title,
        amount: formatCurrency(offer.approvedAmount),
        rate: `${offer.apr}% APR`,
        icon: offer.icon,
        details: `${offer.term} months • ${formatCurrencyDecimal(offer.monthlyPayment)}/mo`,
      };
    case 'credit-card':
      return {
        title: offer.title,
        amount: `${formatCurrency(offer.creditLimit)} Limit`,
        rate: offer.introPeriod > 0
          ? `${offer.introApr}% Intro APR`
          : `${offer.regularApr}% APR`,
        icon: offer.icon,
        details: offer.introPeriod > 0
          ? `${offer.introPeriod} months intro • ${offer.cashBack}% cash back`
          : `${offer.cashBack}% cash back`,
      };
    case 'insurance':
      return {
        title: offer.title,
        amount: `${formatCurrency(offer.coverageAmount)} Coverage`,
        rate: `${formatCurrencyDecimal(offer.monthlyPremium)}/month`,
        icon: offer.icon,
        details: `${offer.termYears} year term`,
      };
  }
};

export const calculateAllOffers = (
  step2Data: Step2Data,
): {
  loan: LoanOffer;
  creditCard: CreditCardOffer;
  insurance: InsuranceOffer;
} => {
  return {
    loan: calculateLoanOffer(step2Data),
    creditCard: calculateCreditCardOffer(step2Data),
    insurance: calculateInsuranceOffer(step2Data),
  };
};
