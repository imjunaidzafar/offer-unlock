import {
  step1Schema,
  step2Schema,
  step3Schema,
  signUpSchema,
  loginSchema,
} from '../../src/lib/schemas';

describe('Validation Schemas', () => {
  describe('Step 1 - Personal Info Schema', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
    };

    it('should pass with valid data', () => {
      const result = step1Schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with empty first name', () => {
      const result = step1Schema.safeParse({...validData, firstName: ''});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('First name');
      }
    });

    it('should fail with first name less than 2 characters', () => {
      const result = step1Schema.safeParse({...validData, firstName: 'A'});
      expect(result.success).toBe(false);
    });

    it('should fail with invalid characters in first name', () => {
      const result = step1Schema.safeParse({...validData, firstName: 'John123'});
      expect(result.success).toBe(false);
    });

    it('should allow hyphenated names', () => {
      const result = step1Schema.safeParse({...validData, firstName: 'Mary-Jane'});
      expect(result.success).toBe(true);
    });

    it('should allow apostrophes in names', () => {
      const result = step1Schema.safeParse({...validData, lastName: "O'Brien"});
      expect(result.success).toBe(true);
    });

    it('should fail with empty date of birth', () => {
      const result = step1Schema.safeParse({...validData, dateOfBirth: ''});
      expect(result.success).toBe(false);
    });

    it('should fail if user is under 18', () => {
      const today = new Date();
      const underageDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
      const result = step1Schema.safeParse({
        ...validData,
        dateOfBirth: underageDate.toISOString().split('T')[0],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('18 years old');
      }
    });

    it('should fail with future date of birth', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = step1Schema.safeParse({
        ...validData,
        dateOfBirth: futureDate.toISOString().split('T')[0],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Step 2 - Income Details Schema', () => {
    const validData = {
      employmentStatus: 'employed' as const,
      annualIncome: '75000',
      creditScoreRange: 'good' as const,
    };

    it('should pass with valid data', () => {
      const result = step2Schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid employment status', () => {
      const result = step2Schema.safeParse({...validData, employmentStatus: 'invalid'});
      expect(result.success).toBe(false);
    });

    it('should accept all valid employment statuses', () => {
      const statuses = ['employed', 'self-employed', 'unemployed', 'retired'] as const;
      statuses.forEach((status) => {
        const result = step2Schema.safeParse({...validData, employmentStatus: status});
        expect(result.success).toBe(true);
      });
    });

    it('should fail with empty annual income', () => {
      const result = step2Schema.safeParse({...validData, annualIncome: ''});
      expect(result.success).toBe(false);
    });

    it('should accept income with commas', () => {
      const result = step2Schema.safeParse({...validData, annualIncome: '75,000'});
      expect(result.success).toBe(true);
    });

    it('should fail with invalid credit score range', () => {
      const result = step2Schema.safeParse({...validData, creditScoreRange: 'invalid'});
      expect(result.success).toBe(false);
    });

    it('should accept all valid credit score ranges', () => {
      const ranges = ['excellent', 'good', 'fair', 'poor'] as const;
      ranges.forEach((range) => {
        const result = step2Schema.safeParse({...validData, creditScoreRange: range});
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Step 3 - Preferences Schema', () => {
    const validData = {
      offerType: 'loan' as const,
      contactPreference: 'email' as const,
      termsAccepted: true as const,
    };

    it('should pass with valid data', () => {
      const result = step3Schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with invalid offer type', () => {
      const result = step3Schema.safeParse({...validData, offerType: 'invalid'});
      expect(result.success).toBe(false);
    });

    it('should accept all valid offer types', () => {
      const types = ['loan', 'credit-card', 'insurance'] as const;
      types.forEach((type) => {
        const result = step3Schema.safeParse({...validData, offerType: type});
        expect(result.success).toBe(true);
      });
    });

    it('should fail with invalid contact preference', () => {
      const result = step3Schema.safeParse({...validData, contactPreference: 'invalid'});
      expect(result.success).toBe(false);
    });

    it('should accept all valid contact preferences', () => {
      const prefs = ['email', 'phone', 'both'] as const;
      prefs.forEach((pref) => {
        const result = step3Schema.safeParse({...validData, contactPreference: pref});
        expect(result.success).toBe(true);
      });
    });

    it('should fail when terms not accepted', () => {
      const result = step3Schema.safeParse({...validData, termsAccepted: false});
      expect(result.success).toBe(false);
    });
  });

  describe('Sign Up Schema', () => {
    const validData = {
      username: 'john_doe',
      email: 'john@example.com',
      phone: '+1234567890',
      password: 'Password1!',
    };

    it('should pass with valid data', () => {
      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    // Username tests
    it('should fail with username less than 3 characters', () => {
      const result = signUpSchema.safeParse({...validData, username: 'ab'});
      expect(result.success).toBe(false);
    });

    it('should fail with username more than 20 characters', () => {
      const result = signUpSchema.safeParse({...validData, username: 'a'.repeat(21)});
      expect(result.success).toBe(false);
    });

    it('should fail with special characters in username', () => {
      const result = signUpSchema.safeParse({...validData, username: 'john@doe'});
      expect(result.success).toBe(false);
    });

    it('should allow underscores in username', () => {
      const result = signUpSchema.safeParse({...validData, username: 'john_doe_123'});
      expect(result.success).toBe(true);
    });

    // Email tests
    it('should fail with invalid email format', () => {
      const invalidEmails = ['notanemail', 'missing@domain', '@nodomain.com', 'spaces in@email.com'];
      invalidEmails.forEach((email) => {
        const result = signUpSchema.safeParse({...validData, email});
        expect(result.success).toBe(false);
      });
    });

    it('should pass with valid email formats', () => {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'user+tag@example.org'];
      validEmails.forEach((email) => {
        const result = signUpSchema.safeParse({...validData, email});
        expect(result.success).toBe(true);
      });
    });

    // Phone tests
    it('should fail with invalid phone format', () => {
      const invalidPhones = ['notaphone', 'abc', 'phone@123', '++1234567890'];
      invalidPhones.forEach((phone) => {
        const result = signUpSchema.safeParse({...validData, phone});
        expect(result.success).toBe(false);
      });
    });

    it('should pass with valid phone format', () => {
      const validPhones = ['+1234567890', '+12025551234', '+447911123456'];
      validPhones.forEach((phone) => {
        const result = signUpSchema.safeParse({...validData, phone});
        expect(result.success).toBe(true);
      });
    });

    // Password tests
    it('should fail with password less than 8 characters', () => {
      const result = signUpSchema.safeParse({...validData, password: 'Short1!'});
      expect(result.success).toBe(false);
    });

    it('should fail without uppercase letter', () => {
      const result = signUpSchema.safeParse({...validData, password: 'password1!'});
      expect(result.success).toBe(false);
    });

    it('should fail without lowercase letter', () => {
      const result = signUpSchema.safeParse({...validData, password: 'PASSWORD1!'});
      expect(result.success).toBe(false);
    });

    it('should fail without number', () => {
      const result = signUpSchema.safeParse({...validData, password: 'Password!'});
      expect(result.success).toBe(false);
    });

    it('should fail without special character', () => {
      const result = signUpSchema.safeParse({...validData, password: 'Password1'});
      expect(result.success).toBe(false);
    });
  });

  describe('Login Schema', () => {
    const validData = {
      emailOrUsername: 'john@example.com',
      password: 'Password1!',
    };

    it('should pass with valid data', () => {
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with empty email/username', () => {
      const result = loginSchema.safeParse({...validData, emailOrUsername: ''});
      expect(result.success).toBe(false);
    });

    it('should fail with empty password', () => {
      const result = loginSchema.safeParse({...validData, password: ''});
      expect(result.success).toBe(false);
    });

    it('should accept username as identifier', () => {
      const result = loginSchema.safeParse({...validData, emailOrUsername: 'john_doe'});
      expect(result.success).toBe(true);
    });
  });
});
