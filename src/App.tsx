import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './features/auth';
import { DashboardView } from './features/dashboard';
import { LandingPage } from './features/landing';
import { getAdminContactInfo } from './services/familyMatchingService';
import type { AdminContact } from './features/familyTree/types';
import './App.css';

export const App: React.FC = () => {
  const { user, member, account, logout, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register' | 'contact-admin'>('login');
  const [adminContact, setAdminContact] = useState<AdminContact | null>(null);

  useEffect(() => {
    getAdminContactInfo().then(setAdminContact);
  }, []);

  const openAuth = (view: 'login' | 'register' | 'contact-admin') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const displayName = member?.name
    ? `${member.name} ${member.surname}`
    : user?.email?.split('@')[0] || 'Member';

  // If user is authenticated, render the dedicated member dashboard workspace
  if (user) {
    return (
      <div className="app-container" id="app-root">
        {/* Authenticated Header */}
        <header className="app-header" id="stage1-header">
          <div className="header-content">
            <div className="brand-badge-group">
              <a href="/" className="brand-logo" id="brand-logo-link">
                <svg
                  className="logo-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="5" r="3" />
                  <circle cx="6" cy="19" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M12 8v4" />
                  <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
                </svg>
                <span className="brand-title">FamTree</span>
              </a>
              <span className="stage-pill" id="stage-badge">Private Heritage Network</span>
            </div>

            <div className="header-actions">
              <div className="user-session-group" id="user-session-nav">
                <button
                  type="button"
                  className="docs-link"
                  onClick={() => openAuth('contact-admin')}
                  id="btn-nav-contact-admin-logged"
                  style={{ cursor: 'pointer', fontWeight: 500 }}
                >
                  <span>Contact Admin</span>
                </button>
                <div className="user-badge" id="user-badge">
                  <span className="user-avatar-dot"></span>
                  <span>{displayName}</span>
                  <span className="user-role-tag">{account?.role || 'member'}</span>
                </div>
                <button
                  type="button"
                  className="btn-signout"
                  onClick={() => logout()}
                  disabled={isLoading}
                  id="btn-signout"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Authenticated Member Dashboard (FR-12) */}
        <main className="main-content" id="main-content">
          <DashboardView
            onOpenFamilyTree={() => alert('Family tree canvas navigation will activate in Stage 13 & 14!')}
            onOpenProfile={() => alert('Profile & visibility controls will activate in Stage 16!')}
            onOpenContactAdmin={() => openAuth('contact-admin')}
            onOpenAdminConsole={() => alert('Admin console will activate in Stage 17!')}
          />
        </main>

        {/* Auth Modal Dialog for logged-in inquiries */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultView={authModalView}
        />

        {/* Authenticated Footer */}
        <footer className="app-footer" id="app-footer">
          <p>Family use only · © 2026 FamTree</p>
        </footer>
      </div>
    );
  }

  // Public visitor: Render the upgraded premium Landing Page
  return (
    <>
      <LandingPage
        onOpenLogin={() => openAuth('login')}
        onOpenRegister={() => openAuth('register')}
        onOpenContactAdmin={() => openAuth('contact-admin')}
        adminWhatsApp={adminContact?.whatsapp_number || '+1234567890'}
        adminEmail={adminContact?.support_email || 'admin@gmail.com'}
      />

      {/* Auth Modal Dialog (Sign In / Register / Contact Admin) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </>
  );
};

export default App;
