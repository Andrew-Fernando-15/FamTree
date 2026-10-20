import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './features/auth';
import './App.css';

export const App: React.FC = () => {
  const { user, member, account, logout, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
            <span className="stage-pill" id="stage-badge">Stage 6: Auth Foundation</span>
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
                  onClick={() => setIsAuthModalOpen(true)}
                  id="btn-open-signin"
                  style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-text-primary)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Sign In</span>
                </button>
                <span className="docs-link" id="docs-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
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
            <span>Stage 6 Authentication Ready</span>
          </div>
          <h1 className="hero-title">
            Private, Structured <br />
            <span className="gradient-text">Digital Family Tree</span>
          </h1>
          <p className="hero-subtitle">
            FamTree connects family members through secure member linking, interactive tree exploration,
            and privacy-controlled profiles. Stage 6 establishes the authentication foundation.
          </p>

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
          <div className="foundation-card" id="card-auth-feature">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="card-title">Name Components Auth</h2>
            <p className="card-description">
              Login accepts name, father&apos;s name, mother&apos;s name, surname, and password according to FR-10.
            </p>
            <div className="card-meta">
              <span className="card-badge">FR-10 Login</span>
            </div>
          </div>

          <div className="foundation-card" id="card-session-persistence">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <h2 className="card-title">Session Persistence</h2>
            <p className="card-description">
              State synchronized across tabs and refreshes using Supabase Auth token management and AuthContext.
            </p>
            <div className="card-meta">
              <span className="card-badge">useAuth Hook</span>
            </div>
          </div>

          <div className="foundation-card" id="card-recovery">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
            </div>
            <h2 className="card-title">Password Recovery</h2>
            <p className="card-description">
              Email-based recovery with fallback to Contact Admin if phone/email channels are lost (FR-11).
            </p>
            <div className="card-meta">
              <span className="card-badge">FR-11 Recovery</span>
            </div>
          </div>

          <div className="foundation-card" id="card-database-security">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="card-title">Database RLS & Schema</h2>
            <p className="card-description">
              All 6 tables active with Row Level Security and database triggers guarding protected identity fields.
            </p>
            <div className="card-meta">
              <span className="card-badge">Stages 4 & 5 RLS</span>
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

            <div className="check-item pending" id="check-registration-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="check-details">
                <span className="check-name">Registration Flow</span>
                <span className="check-status">Scheduled for Stage 7</span>
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
            <strong>Stage 6 Completed:</strong> Authentication foundation active. Users can sign in using name components (FR-10)
            or email, manage sessions, recover passwords, and sign out. Multi-step progressive registration follows in Stage 7.
          </p>
        </aside>
      </main>

      {/* Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <footer className="app-footer" id="app-footer">
        <p>FamTree Project Foundation • 20-Stage Alpha Roadmap • Stage 6 Completed</p>
      </footer>
    </div>
  );
};

export default App;
