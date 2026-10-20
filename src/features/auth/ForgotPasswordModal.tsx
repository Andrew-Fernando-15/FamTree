import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './auth.css';

interface ForgotPasswordModalProps {
  onBackToLogin: () => void;
  onContactAdminClick?: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onBackToLogin,
  onContactAdminClick,
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetPassword(email);
    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error.message || 'Failed to send recovery link. Please try again.');
    } else {
      setSuccessMessage('Password reset link sent! Check your inbox to recover access.');
    }
  };

  return (
    <div className="auth-body">
      <p className="auth-subtitle">
        Account recovery uses your registered email channel (FR-11). Enter your email to receive a secure password reset link.
      </p>

      {successMessage && (
        <div className="auth-alert auth-alert-success" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

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

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="recovery-email">
            Registered Email Address
          </label>
          <input
            id="recovery-email"
            type="email"
            className="form-input"
            placeholder="e.g. your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            id="btn-recovery-submit"
          >
            {isSubmitting ? 'Sending Link...' : 'Send Recovery Link'}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onBackToLogin}
          >
            ← Back to Sign In
          </button>
        </div>
      </form>

      {/* Fallback Notice for FR-11 */}
      <div style={{ marginTop: 'var(--space-2)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Both registered email and phone inaccessible?
        </p>
        {onContactAdminClick && (
          <button
            type="button"
            className="auth-text-link"
            style={{ fontSize: '0.8125rem', marginTop: '4px' }}
            onClick={onContactAdminClick}
          >
            Contact Family Admin (FR-11) →
          </button>
        )}
      </div>
    </div>
  );
};
