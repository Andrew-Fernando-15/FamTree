import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './auth.css';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPasswordClick: () => void;
  onSwitchToRegister?: () => void;
  onContactAdminClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPasswordClick,
  onSwitchToRegister,
  onContactAdminClick,
}) => {
  const { loginWithNameComponents, loginWithEmail, isLoading } = useAuth();

  // Mode: Name Components (FR-10) vs Direct Email
  const [useEmailMode, setUseEmailMode] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (useEmailMode) {
      if (!email || !password) {
        setErrorMessage('Please enter both your email address and password.');
        return;
      }
      const res = await loginWithEmail(email, password);
      if (res.error) {
        setErrorMessage(res.error.message || 'Login failed. Please check your credentials.');
      } else {
        onSuccess?.();
      }
    } else {
      if (!name.trim() || !surname.trim() || !password) {
        setErrorMessage('Your name, surname, and password are required to log in.');
        return;
      }
      const res = await loginWithNameComponents(name, fatherName, motherName, surname, password);
      if (res.error) {
        setErrorMessage(res.error.message || 'Authentication failed. Please verify your details.');
      } else {
        onSuccess?.();
      }
    }
  };

  return (
    <div className="auth-body">
      <p className="auth-subtitle">
        {useEmailMode
          ? 'Enter your registered email address and password to sign in.'
          : 'FamTree login accepts your 4 family name components in order, followed by your password (FR-10).'}
      </p>

      {/* Quick Sample Tree Credentials helper */}
      <div style={{
        background: 'rgba(5, 150, 105, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '10px',
        padding: '10px 14px',
        marginBottom: '16px',
        fontSize: '0.82rem',
        color: '#a7f3d0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600, color: '#34d399' }}>Sample Tree Credentials</span>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Pass: Password123!</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            type="button"
            className="btn-badge"
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              setUseEmailMode(true);
              setEmail('andrew@gmail.com');
              setPassword('Password123!');
              setErrorMessage(null);
            }}
          >
            Andrew (andrew@gmail.com)
          </button>
          <button
            type="button"
            className="btn-badge"
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#ffffff',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              setUseEmailMode(true);
              setEmail('aaron@gmail.com');
              setPassword('Password123!');
              setErrorMessage(null);
            }}
          >
            Aaron (aaron@gmail.com)
          </button>
          <button
            type="button"
            className="btn-badge"
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              setUseEmailMode(true);
              setEmail('charles@gmail.com');
              setPassword('Password123!');
              setErrorMessage(null);
            }}
          >
            Charles (Admin)
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="auth-alert auth-alert-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <span>{errorMessage}</span>
            {errorMessage.includes('Contact Admin') && onContactAdminClick && (
              <div style={{ marginTop: '4px' }}>
                <button
                  type="button"
                  className="auth-text-link"
                  onClick={onContactAdminClick}
                  style={{ color: '#fca5a5', fontWeight: 600 }}
                >
                  Open Contact Admin →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {useEmailMode ? (
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">
              Registered Email
            </label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              placeholder="e.g. your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        ) : (
          <>
            <div className="name-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="auth-first-name">
                  1. Your Name *
                </label>
                <input
                  id="auth-first-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Aaron"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-father-name">
                  2. Father&apos;s Name
                </label>
                <input
                  id="auth-father-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Charles"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  autoComplete="additional-name"
                />
              </div>
            </div>

            <div className="name-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="auth-mother-name">
                  3. Mother&apos;s Name
                </label>
                <input
                  id="auth-mother-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Diana"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-surname">
                  4. Surname *
                </label>
                <input
                  id="auth-surname"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Fernando"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="auth-password">
            Password *
          </label>
          <input
            id="auth-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="auth-links">
          <button
            type="button"
            className="auth-text-link"
            onClick={onForgotPasswordClick}
          >
            Forgot Password?
          </button>

          <button
            type="button"
            className="auth-text-link"
            onClick={() => {
              setUseEmailMode(!useEmailMode);
              setErrorMessage(null);
            }}
          >
            {useEmailMode ? 'Use Name Components' : 'Use Email Login'}
          </button>
        </div>

        <div className="auth-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            id="btn-login-submit"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <span>Sign In to FamTree</span>
            )}
          </button>

          {onSwitchToRegister && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onSwitchToRegister}
              id="btn-switch-to-register"
            >
              Don&apos;t have an account? Register
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
