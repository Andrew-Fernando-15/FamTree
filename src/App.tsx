import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './features/auth';
import './App.css';

export const App: React.FC = () => {
  const { user, member, account, logout, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');

  const openAuth = (view: 'login' | 'register') => {
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
            <span className="stage-pill" id="stage-badge">Stage 10: Account Linking</span>
          </div>

          <div className="header-actions">
            {user ? (
              <div className="user-session-group" id="user-session-nav">
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
                <span className="docs-link" id="docs-indicator">
                  <span>/docs</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content" id="main-content">
        {/* Hero Section */}
        <section className="hero-section" id="hero-section">
          <div className="hero-tag" id="status-pill">
            <span className="status-dot"></span>
            <span>Stage 10 Account-to-Member Linking Active</span>
          </div>
          <h1 className="hero-title">
            Private, Structured <br />
            <span className="gradient-text">Digital Family Tree</span>
          </h1>
          <p className="hero-subtitle">
            FamTree connects family members through secure member linking, interactive tree exploration,
            and privacy-controlled profiles. Stage 10 permanently binds accounts to tree profiles with contact synchronization (FR-22).
          </p>

          {/* Quick Registration CTA for Logged-Out Visitors */}
          {!user && (
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => openAuth('register')}
                style={{ width: 'auto', padding: '0.75rem 1.75rem', fontSize: '0.9375rem' }}
                id="hero-register-btn"
              >
                Start Registration (3 Steps) →
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => openAuth('login')}
                style={{ width: 'auto', padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}
                id="hero-signin-btn"
              >
                Sign In
              </button>
            </div>
          )}

          {/* User Active Session Hero Card */}
          {user && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-4) var(--space-6)',
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                maxWidth: '600px',
                width: '100%',
              }}
              id="active-session-banner"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Active Session Verified</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Signed in as <code>{user.email}</code>. Session state persists across refreshes via Supabase Auth.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Foundation Pillars */}
        <section className="cards-grid" id="foundation-cards">
          <div className="foundation-card" id="card-progressive-registration">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h2 className="card-title">Orderly 3-Step Wizard</h2>
            <p className="card-description">
              Presents registration progressively: Identity Basics → Contact & Age Rule → Security (FR-01, FR-02).
            </p>
            <div className="card-meta">
              <span className="card-badge">FR-02 Progressive</span>
            </div>
          </div>

          <div className="foundation-card" id="card-age-rule">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
            </div>
            <h2 className="card-title">Strict Age Rules (FR-03)</h2>
            <p className="card-description">
              Under-15 accounts disallowed; 15-49 requires phone and email; 50+ phone required with email optional.
            </p>
            <div className="card-meta">
              <span className="card-badge">FR-03 Age Rules</span>
            </div>
          </div>

          <div className="foundation-card" id="card-no-dob">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2 className="card-title">Privacy Protection</h2>
            <p className="card-description">
              Date of birth is explicitly excluded from registration, minimizing initial data collection friction.
            </p>
            <div className="card-meta">
              <span className="card-badge">No DOB Collected</span>
            </div>
          </div>

          <div className="foundation-card" id="card-auth-session">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="card-title">Name Auth & RLS</h2>
            <p className="card-description">
              FR-10 Name components login, session persistence, and database-level RLS policies on all tables.
            </p>
            <div className="card-meta">
              <span className="card-badge">Stages 5 & 6 Active</span>
            </div>
          </div>
        </section>

        {/* Stage Checklist */}
        <section className="checklist-section" id="stage-checklist">
          <div className="section-header">
            <div>
              <h2 className="section-title">Milestone Progress Checklist</h2>
              <p className="section-desc">Stage-by-stage status aligned with PROGRESS_PLAN.txt</p>
            </div>
          </div>

          <div className="checklist-grid">
            <div className="check-item done" id="check-core-folders">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Project Foundation & Architecture</span>
                <span className="check-status">React 19, TS, Vite, domain folders</span>
              </div>
            </div>

            <div className="check-item done" id="check-supabase-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Supabase Client Setup</span>
                <span className="check-status">src/lib/supabase.ts with public anon key</span>
              </div>
            </div>

            <div className="check-item done" id="check-database-schema">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Database Schema</span>
                <span className="check-status">6 tables, indexes, triggers & TypeScript types</span>
              </div>
            </div>

            <div className="check-item done" id="check-rls-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Database Security (RLS)</span>
                <span className="check-status">RLS policies enabled on all tables</span>
              </div>
            </div>

            <div className="check-item done" id="check-auth-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Authentication Foundation</span>
                <span className="check-status">FR-10 Name Login, session persistence, logout</span>
              </div>
            </div>

            <div className="check-item done" id="check-registration-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Registration Flow</span>
                <span className="check-status">Progressive wizard, FR-03 age rules, password match</span>
              </div>
            </div>

            <div className="check-item done" id="check-verification-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Email/Phone Verification</span>
                <span className="check-status">FR-04 single-use 6-digit OTP, SHA-256 hash, attempt limits</span>
              </div>
            </div>

            <div className="check-item done" id="check-matching-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Family Matching</span>
                <span className="check-status">FR-05 tree check, FR-06 candidate confirmation, FR-07 duplicate resolution</span>
              </div>
            </div>

            <div className="check-item done" id="check-linking-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Account-to-Member Linking</span>
                <span className="check-status">FR-22 account creation, member linking, contact sync & session active</span>
              </div>
            </div>

            <div className="check-item pending" id="check-contact-admin-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="check-details">
                <span className="check-name">Contact Admin Page</span>
                <span className="check-status">Scheduled for Stage 11 (FR-09)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Guardrail Notice */}
        <aside className="guardrail-banner" id="guardrail-notice">
          <svg className="banner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>
            <strong>Stage 10 Completed:</strong> Account-to-Member Linking active (FR-22). Verified users are permanently bound to their family member record, credentials and accounts table records are created, and sessions automatically activate. Ready for Stage 11 (Contact Admin Page).
          </p>
        </aside>
      </main>

      {/* Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView={authModalView}
      />

      {/* Footer */}
      <footer className="app-footer" id="app-footer">
        <p>FamTree Project Foundation • 20-Stage Alpha Roadmap • Stage 10 Completed</p>
      </footer>
    </div>
  );
};

export default App;
