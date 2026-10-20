import React, { useState } from 'react';
import type { AgeCategory, RegistrationFormData } from './types';
import './auth.css';

interface RegistrationFormProps {
  onSuccess?: (data: RegistrationFormData) => void;
  onSwitchToLogin: () => void;
  onContactAdminClick?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  onContactAdminClick,
}) => {
  // Step: 1 = Identity, 2 = Contact & Age Rule, 3 = Password
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    fatherName: '',
    motherName: '',
    surname: '',
    ageCategory: null,
    phone: '',
    primaryEmail: '',
    secondaryEmail: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const updateField = (field: keyof RegistrationFormData, value: string | AgeCategory | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  // Step 1 Validation
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.surname.trim()) {
      setErrorMessage('Your name and surname are required to proceed.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  // Step 2 Validation (FR-03 Age Rule)
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ageCategory) {
      setErrorMessage('Please select your age category to determine required contact verification.');
      return;
    }

    if (formData.ageCategory === 'under_15') {
      setErrorMessage('Account creation is not permitted for users under 15 years old (FR-03).');
      return;
    }

    // Phone is required for all allowed categories (15-49 and 50+)
    if (!formData.phone.trim()) {
      setErrorMessage('Phone number is required for account verification.');
      return;
    }

    // Primary email is required for 15-49; optional for 50+
    if (formData.ageCategory === '15_to_49' && !formData.primaryEmail.trim()) {
      setErrorMessage('Email address is required for members between 15 and 49 years old.');
      return;
    }

    setErrorMessage(null);
    setStep(3);
  };

  // Step 3 Validation & Submit (FR-01)
  const handleSubmitStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password) {
      setErrorMessage('Password is required.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setErrorMessage(null);
    setIsSuccess(true);
    onSuccess?.(formData);
  };

  return (
    <div className="auth-body">
      {/* Wizard Step Progress (FR-02) */}
      <div className="step-wizard" aria-label="Registration Progress">
        <div className={`step-node ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
          <span className="step-label">Identity</span>
        </div>
        <div className={`step-node ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
          <div className="step-circle">{step > 2 ? '✓' : '2'}</div>
          <span className="step-label">Contact</span>
        </div>
        <div className={`step-node ${step === 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span className="step-label">Security</span>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="auth-alert auth-alert-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success State */}
      {isSuccess ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', textAlign: 'center' }}>
          <div className="auth-alert auth-alert-success" role="status">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div>
              <strong>Registration Details Recorded!</strong>
              <p style={{ marginTop: '2px', fontSize: '0.8125rem' }}>
                Your identity basics, contact channels ({formData.phone}
                {formData.primaryEmail ? `, ${formData.primaryEmail}` : ''}), and credentials have been staged.
              </p>
            </div>
          </div>

          <p className="auth-subtitle">
            Next: Contact channel verification codes will be dispatched and verified in <strong>Stage 8</strong>.
          </p>

          <button
            type="button"
            className="btn-primary"
            onClick={onSwitchToLogin}
          >
            Go to Sign In
          </button>
        </div>
      ) : (
        <>
          {/* STEP 1: IDENTITY BASICS */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="auth-form" noValidate>
              <p className="auth-subtitle">
                Enter your identity basics (FR-01, FR-02). Date of birth is not requested during registration.
              </p>

              <div className="name-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">
                    1. First Name *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Aaron"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-father-name">
                    2. Father&apos;s Name
                  </label>
                  <input
                    id="reg-father-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Charles"
                    value={formData.fatherName}
                    onChange={(e) => updateField('fatherName', e.target.value)}
                    autoComplete="additional-name"
                  />
                </div>
              </div>

              <div className="name-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-mother-name">
                    3. Mother&apos;s Name
                  </label>
                  <input
                    id="reg-mother-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Diana"
                    value={formData.motherName}
                    onChange={(e) => updateField('motherName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-surname">
                    4. Surname *
                  </label>
                  <input
                    id="reg-surname"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Fernando"
                    value={formData.surname}
                    onChange={(e) => updateField('surname', e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="wizard-actions">
                <button
                  type="button"
                  className="auth-text-link"
                  onClick={onSwitchToLogin}
                >
                  Already have an account? Sign In
                </button>

                <button type="submit" className="btn-primary" style={{ width: 'auto', minWidth: '130px' }}>
                  Next: Contact →
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: AGE RULE & CONTACT */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="auth-form" noValidate>
              <div className="form-group">
                <label className="form-label">Select Age Category * (FR-03)</label>
                <div className="age-cards-grid">
                  <div
                    className={`age-choice-card ${formData.ageCategory === 'under_15' ? 'selected' : ''}`}
                    onClick={() => updateField('ageCategory', 'under_15')}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="age-title">Under 15</span>
                    <span className="age-subtext">No account (FR-03)</span>
                  </div>

                  <div
                    className={`age-choice-card ${formData.ageCategory === '15_to_49' ? 'selected' : ''}`}
                    onClick={() => updateField('ageCategory', '15_to_49')}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="age-title">15 – 49</span>
                    <span className="age-subtext">Phone & Email req.</span>
                  </div>

                  <div
                    className={`age-choice-card ${formData.ageCategory === '50_plus' ? 'selected' : ''}`}
                    onClick={() => updateField('ageCategory', '50_plus')}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="age-title">50+</span>
                    <span className="age-subtext">Phone req., Email opt.</span>
                  </div>
                </div>
              </div>

              {/* Under-15 Rejection Notice (FR-03) */}
              {formData.ageCategory === 'under_15' && (
                <div className="auth-alert auth-alert-warning" role="alert">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <strong>Under-15 Account Restriction (FR-03)</strong>
                    <p style={{ marginTop: '2px', fontSize: '0.8125rem' }}>
                      Users under 15 cannot create independent accounts. Tree members under 15 are maintained in the family tree by their parents or administrators.
                    </p>
                    {onContactAdminClick && (
                      <button
                        type="button"
                        className="auth-text-link"
                        onClick={onContactAdminClick}
                        style={{ marginTop: '4px', display: 'inline-block' }}
                      >
                        Contact Family Administrator →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Inputs for Permitted Age Categories */}
              {formData.ageCategory && formData.ageCategory !== 'under_15' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-phone">
                      Mobile Phone Number * (Required)
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      className="form-input"
                      placeholder="e.g. +1 555 0100"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-email">
                      Primary Email Address {formData.ageCategory === '15_to_49' ? '* (Required)' : '(Optional for 50+)'}
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      className="form-input"
                      placeholder="e.g. your.email@example.com"
                      value={formData.primaryEmail}
                      onChange={(e) => updateField('primaryEmail', e.target.value)}
                      autoComplete="email"
                      required={formData.ageCategory === '15_to_49'}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-secondary-email">
                      Second Email Address (Optional)
                    </label>
                    <input
                      id="reg-secondary-email"
                      type="email"
                      className="form-input"
                      placeholder="e.g. backup.email@example.com"
                      value={formData.secondaryEmail}
                      onChange={(e) => updateField('secondaryEmail', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="wizard-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                  style={{ width: 'auto' }}
                >
                  ← Back to Identity
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: 'auto', minWidth: '130px' }}
                  disabled={formData.ageCategory === 'under_15'}
                >
                  Next: Password →
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SECURITY & PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleSubmitStep3} className="auth-form" noValidate>
              <p className="auth-subtitle">
                Create a secure password for your FamTree account (FR-01). Minimum 8 characters.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password * (Minimum 8 characters)
                </label>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm-password">
                  Re-enter Password *
                </label>
                <input
                  id="reg-confirm-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  autoComplete="new-password"
                  required
                />
                {formData.confirmPassword && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: formData.password === formData.confirmPassword ? '#34d399' : '#f87171',
                      marginTop: '2px',
                    }}
                  >
                    {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </span>
                )}
              </div>

              <div className="wizard-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(2)}
                  style={{ width: 'auto' }}
                >
                  ← Back to Contact
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: 'auto', minWidth: '150px' }}
                  id="btn-register-submit"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};
