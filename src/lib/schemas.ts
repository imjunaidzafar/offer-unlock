import {z} from 'zod';
import type {FieldErrors, Resolver} from 'react-hook-form';

// Custom zodResolver that uses safeParse to avoid unhandled promise rejections
export function safeZodResolver<T extends z.ZodType<any, any>>(
  schema: T,
): Resolver<z.infer<T>> {
  return async (values): Promise<{values: z.infer<T>; errors: FieldErrors<z.infer<T>>}> => {
    const result = schema.safeParse(values);
    if (result.success) {
      return {values: result.data, errors: {} as FieldErrors<z.infer<T>>};
    }

    const errors: FieldErrors<z.infer<T>> = {} as FieldErrors<z.infer<T>>;
    for (const issue of result.error.issues) {
      const path = issue.path.join('.') as keyof z.infer<T>;
      if (!errors[path]) {
        (errors as any)[path] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }

    return {values: {} as z.infer<T>, errors};
  };
}

// Step 1 - Personal Info Schema
export const step1Schema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      (date) => {
        if (!date) return true; // Allow empty during typing
        const dob = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        return age >= 18;
      },
      {message: 'You must be at least 18 years old'},
    )
    .refine(
      (date) => {
        if (!date) return true; // Allow empty during typing
        const dob = new Date(date);
        const today = new Date();
        return dob <= today;
      },
      {message: 'Date of birth cannot be in the future'},
    ),
});

// Employment status values
const employmentStatusValues = ['employed', 'self-employed', 'unemployed', 'retired'] as const;
// Credit score values
const creditScoreValues = ['excellent', 'good', 'fair', 'poor'] as const;

// Step 2 - Income Details Schema
export const step2Schema = z.object({
  employmentStatus: z
    .string()
    .min(1, 'Please select an employment status')
    .refine(
      (val) => employmentStatusValues.includes(val as typeof employmentStatusValues[number]),
      {message: 'Please select an employment status'},
    ),
  annualIncome: z
    .string()
    .min(1, 'Annual income is required')
    .refine(
      (val) => {
        const num = parseFloat(val.replace(/[,$]/g, ''));
        return !isNaN(num) && num >= 0;
      },
      {message: 'Please enter a valid income amount'},
    ),
  creditScoreRange: z
    .string()
    .min(1, 'Please select a credit score range')
    .refine(
      (val) => creditScoreValues.includes(val as typeof creditScoreValues[number]),
      {message: 'Please select a credit score range'},
    ),
});

// Offer type values
const offerTypeValues = ['loan', 'credit-card', 'insurance'] as const;
// Contact preference values
const contactPreferenceValues = ['email', 'phone', 'both'] as const;

// Step 3 - Preferences Schema
export const step3Schema = z.object({
  offerType: z
    .string()
    .min(1, 'Please select an offer type')
    .refine(
      (val) => offerTypeValues.includes(val as typeof offerTypeValues[number]),
      {message: 'Please select an offer type'},
    ),
  contactPreference: z
    .string()
    .min(1, 'Please select a contact preference')
    .refine(
      (val) => contactPreferenceValues.includes(val as typeof contactPreferenceValues[number]),
      {message: 'Please select a contact preference'},
    ),
  termsAccepted: z.literal(true, {
    error: 'You must accept the terms and conditions',
  }),
});

// Sign Up Schema
export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      'Please enter a valid phone number (E.164 format, e.g., +1234567890)',
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character',
    ),
});

// Login Schema
export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Email or username is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

// Type exports for form usage
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
