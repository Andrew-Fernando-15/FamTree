/**
 * FamTree — Authentication & Registration Domain Types
 * Based on FR-01, FR-02, and FR-03 specifications.
 */

export type AgeCategory = 'under_15' | '15_to_49' | '50_plus';

export interface RegistrationFormData {
  // Step 1: Identity Basics
  name: string;
  fatherName: string;
  motherName: string;
  surname: string;

  // Step 2: Age Category & Contact
  ageCategory: AgeCategory | null;
  phone: string;
  primaryEmail: string;
  secondaryEmail: string;

  // Step 3: Password Credentials
  password: string;
  confirmPassword: string;
}

export interface RegistrationValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof RegistrationFormData, string>>;
}
