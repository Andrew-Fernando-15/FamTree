import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { ContactAdminView } from './ContactAdminView';
import './auth.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'login' | 'register' | 'forgot-password' | 'contact-admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultView = 'login',
}) => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot-password' | 'contact-admin'>(defaultView);

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
            {currentView === 'register' && 'Create Your FamTree Account'}
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
            onSwitchToRegister={() => setCurrentView('register')}
            onContactAdminClick={() => setCurrentView('contact-admin')}
          />
        )}

        {currentView === 'register' && (
          <RegistrationForm
            onSwitchToLogin={() => setCurrentView('login')}
            onContactAdminClick={() => setCurrentView('contact-admin')}
            onComplete={handleClose}
          />
        )}

        {currentView === 'forgot-password' && (
          <ForgotPasswordModal
            onBackToLogin={() => setCurrentView('login')}
            onContactAdminClick={() => setCurrentView('contact-admin')}
          />
        )}

        {currentView === 'contact-admin' && (
          <ContactAdminView
            initialCategory="lost_credentials"
            reason="If your account is not linked or your registered phone and email channels are inaccessible, please reach out to your family administrator directly (FR-09, FR-11)."
            onBack={() => setCurrentView('login')}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};
