import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import './auth.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'forgot-password' | 'contact-admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultView = 'login',
}) => {
  const [currentView, setCurrentView] = useState<'login' | 'forgot-password' | 'contact-admin'>(defaultView);

  const handleClose = () => {
    setCurrentView(defaultView);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="auth-modal-card">
        {/* Header */}
        <div className="auth-header">
          <h2 className="auth-header-title" id="auth-modal-title">
            {currentView === 'login' && 'Sign In to FamTree'}
            {currentView === 'forgot-password' && 'Account Recovery'}
            {currentView === 'contact-admin' && 'Contact Family Admin'}
          </h2>
          <button
            type="button"
            className="auth-close-btn"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* View Content */}
        {currentView === 'login' && (
          <LoginForm
            onSuccess={handleClose}
            onForgotPasswordClick={() => setCurrentView('forgot-password')}
            onContactAdminClick={() => setCurrentView('contact-admin')}
          />
        )}

        {currentView === 'forgot-password' && (
          <ForgotPasswordModal
            onBackToLogin={() => setCurrentView('login')}
            onContactAdminClick={() => setCurrentView('contact-admin')}
          />
        )}

        {currentView === 'contact-admin' && (
          <div className="auth-body">
            <p className="auth-subtitle">
              If your account is not linked or your registered phone and email channels are inaccessible, please reach out to your family administrator directly (FR-09, FR-11).
            </p>

            <div className="auth-alert auth-alert-success">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <strong>WhatsApp Admin Chat:</strong>
                <p style={{ marginTop: '2px', fontSize: '0.8125rem' }}>
                  Opens directly without prefilled text.
                </p>
              </div>
            </div>

            <div className="auth-actions">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textAlign: 'center', textDecoration: 'none' }}
              >
                Open WhatsApp Chat
              </a>

              <a
                href="mailto:admin@famtree.internal"
                className="btn-secondary"
                style={{ textAlign: 'center', textDecoration: 'none' }}
              >
                Send Email to Admin
              </a>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentView('login')}
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
