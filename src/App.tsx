import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './features/auth';
import { DashboardView } from './features/dashboard';
import './App.css';

export const App: React.FC = () => {
  const { user, member, account, logout, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register' | 'contact-admin'>('login');

  const openAuth = (view: 'login' | 'register' | 'contact-admin') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const displayName = member?.name
    ? `${member.name} ${member.surname}`
    : user?.email?.split('@')[0] || 'Member';

  return (
    <div className="app-container" id="app-root">
      {/* Navigation & Header */}
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
                {/* Family tree node structure icon */}
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
            {user ? (
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
            ) : (
              <div className="brand-badge-group">
                <button
                  type="button"
                  className="docs-link"
                  onClick={() => openAuth('contact-admin')}
                  id="btn-nav-contact-admin"
                  style={{ cursor: 'pointer', fontWeight: 500 }}
                >
                  <span>Contact Admin</span>
                </button>
                <button
                  type="button"
                  className="docs-link"
                  onClick={() => openAuth('login')}
                  id="btn-open-signin"
                  style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-text-primary)' }}
                >
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  className="docs-link"
                  onClick={() => openAuth('register')}
                  id="btn-open-register"
                  style={{
                    cursor: 'pointer',
                    fontWeight: 600,
                    background: 'var(--color-brand-primary)',
                    color: '#ffffff',
                    border: 'none',
                  }}
                >
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content" id="main-content">
        {user ? (
          /* Authenticated Member Dashboard (FR-12) */
          <DashboardView
            onOpenFamilyTree={() => alert('Family tree canvas navigation will activate in Stage 13 & 14!')}
            onOpenProfile={() => alert('Profile & visibility controls will activate in Stage 16!')}
            onOpenContactAdmin={() => openAuth('contact-admin')}
            onOpenAdminConsole={() => alert('Admin console will activate in Stage 17!')}
          />
        ) : (
          <>
            {/* Hero Section */}
            <section className="hero-section" id="hero-section">
              <div className="hero-tag" id="status-pill">
                <span className="status-dot"></span>
                <span>Private & Verified Lineage Registry</span>
              </div>
              <h1 className="hero-title">
                Discover, Connect & Preserve <br />
                <span className="gradient-text">Your Family Heritage</span>
              </h1>
              <p className="hero-subtitle">
                A private, structured digital space to document your ancestry, explore interactive generational trees, and keep family connections alive across generations.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => openAuth('register')}
                  style={{ width: 'auto', padding: '0.85rem 1.85rem', fontSize: '0.9375rem', fontWeight: 600 }}
                  id="hero-register-btn"
                >
                  Join Family Tree (3 Steps) →
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => openAuth('login')}
                  style={{ width: 'auto', padding: '0.85rem 1.6rem', fontSize: '0.9375rem', fontWeight: 600 }}
                  id="hero-signin-btn"
                >
                  Sign In
                </button>
              </div>
            </section>

            {/* Feature Cards Grid */}
            <section className="cards-grid" id="feature-cards">
              <div className="foundation-card" id="card-feature-tree">
                <div className="card-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="5" r="3" />
                    <circle cx="6" cy="19" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="M12 8v4" />
                    <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
                  </svg>
                </div>
                <h2 className="card-title">Interactive Multi-Gen Tree</h2>
                <p className="card-description">
                  Browse and navigate family branches with fluid zoom, pan, and parent-child relationship visual paths.
                </p>
                <div className="card-meta">
                  <span className="card-badge">Visual Canvas</span>
                </div>
              </div>

              <div className="foundation-card" id="card-feature-privacy">
                <div className="card-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h2 className="card-title">Privacy Shield Protection</h2>
                <p className="card-description">
                  Contact channels and personal updates are protected by default, accessible exclusively to confirmed family relatives.
                </p>
                <div className="card-meta">
                  <span className="card-badge">Granular Privacy</span>
                </div>
              </div>

              <div className="foundation-card" id="card-feature-matching">
                <div className="card-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline points="17 11 19 13 23 9" />
                  </svg>
                </div>
                <h2 className="card-title">Preconfigured Lineage Matching</h2>
                <p className="card-description">
                  Tree branch matching validates each member profile to eliminate duplicates and preserve genealogical truth.
                </p>
                <div className="card-meta">
                  <span className="card-badge">FR-22 Linked</span>
                </div>
              </div>

              <div className="foundation-card" id="card-feature-governance">
                <div className="card-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h2 className="card-title">Genealogical Governance</h2>
                <p className="card-description">
                  Level-2 administrators safeguard lineage integrity, ensuring accurate records and secure family branches.
                </p>
                <div className="card-meta">
                  <span className="card-badge">Lineage Security</span>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView={authModalView}
      />

      {/* Footer */}
      <footer className="app-footer" id="app-footer">
        <p>© 2026 FamTree Heritage Network • Private & Verified Family Registry</p>
      </footer>
    </div>
  );
};

export default App;
