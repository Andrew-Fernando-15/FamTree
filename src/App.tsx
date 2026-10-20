import React from 'react';
import './App.css';

export const App: React.FC = () => {
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
            <span className="stage-pill" id="stage-badge">Stage 4: Database Schema</span>
          </div>
          <div className="header-actions">
            <span className="docs-link" id="docs-indicator">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Specifications in /docs</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content" id="main-content">
        {/* Hero Section */}
        <section className="hero-section" id="hero-section">
          <div className="hero-tag" id="status-pill">
            <span className="status-dot"></span>
            <span>Stage 4 Schema & Types Configured</span>
          </div>
          <h1 className="hero-title">
            Private, Structured <br />
            <span className="gradient-text">Digital Family Tree</span>
          </h1>
          <p className="hero-subtitle">
            FamTree connects family members through secure member linking, interactive tree exploration,
            and privacy-controlled profiles. Stage 1 establishes the clean frontend architecture.
          </p>
        </section>

        {/* Foundation Pillars */}
        <section className="cards-grid" id="foundation-cards">
          <div className="foundation-card" id="card-toolchain">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <h2 className="card-title">Modern Toolchain</h2>
            <p className="card-description">
              Powered by React 19, TypeScript, and Vite for blazing-fast HMR and type-safe development.
            </p>
            <div className="card-meta">
              <span className="card-badge">Vite + React + TS</span>
            </div>
          </div>

          <div className="foundation-card" id="card-architecture">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <h2 className="card-title">Modular Architecture</h2>
            <p className="card-description">
              Scalable folder structure organized into features, common components, hooks, services, and types.
            </p>
            <div className="card-meta">
              <span className="card-badge">Domain-Driven</span>
            </div>
          </div>

          <div className="foundation-card" id="card-safety">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 className="card-title">Configuration & Safety</h2>
            <p className="card-description">
              Guarded by comprehensive .gitignore patterns and a clean .env.example configuration template.
            </p>
            <div className="card-meta">
              <span className="card-badge">.env.example & gitignore</span>
            </div>
          </div>

          <div className="foundation-card" id="card-specifications">
            <div className="card-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h2 className="card-title">Official Specifications</h2>
            <p className="card-description">
              All PRD, FRD, TRD, Data Model, API, and UI/UX master specification documents cataloged in /docs.
            </p>
            <div className="card-meta">
              <span className="card-badge">9 Master Documents</span>
            </div>
          </div>
        </section>

        {/* Stage 1 Checklist */}
        <section className="checklist-section" id="stage1-checklist">
          <div className="section-header">
            <div>
              <h2 className="section-title">Stage 2 Architecture Checklist</h2>
              <p className="section-desc">Verification of required directory structure and modular boundaries</p>
            </div>
          </div>

          <div className="checklist-grid">
            <div className="check-item done" id="check-core-folders">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Components, Pages & Layouts</span>
                <span className="check-status">src/components, src/pages, src/layouts</span>
              </div>
            </div>

            <div className="check-item done" id="check-features-structure">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Modular Feature Folders</span>
                <span className="check-status">auth, dashboard, familyTree, member, profile, admin</span>
              </div>
            </div>

            <div className="check-item done" id="check-support-folders">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Services, Hooks, Types & Utils</span>
                <span className="check-status">src/services, src/hooks, src/types, src/utils, src/lib</span>
              </div>
            </div>

            <div className="check-item done" id="check-placeholders">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Placeholder Index Files</span>
                <span className="check-status">Documented placeholder barrels created</span>
              </div>
            </div>

            <div className="check-item done" id="check-supabase-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Supabase Client Setup</span>
                <span className="check-status">src/lib/supabase.ts configured with anon key</span>
              </div>
            </div>

            <div className="check-item done" id="check-database-schema">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div className="check-details">
                <span className="check-name">Database Schema & Types</span>
                <span className="check-status">6 tables, indexes, triggers & TypeScript contracts</span>
              </div>
            </div>

            <div className="check-item pending" id="check-rls-status">
              <svg className="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="check-details">
                <span className="check-name">Database Security (RLS)</span>
                <span className="check-status">Scheduled for Stage 5</span>
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
            <strong>Stage 4 Constraint Adherence:</strong> Core database schema DDL, seed data, and TypeScript interfaces defined.
            Row Level Security (RLS) policies and authentication remain strictly scheduled for Stage 5 and Stage 6.
          </p>
        </aside>
      </main>

      {/* Footer */}
      <footer className="app-footer" id="app-footer">
        <p>FamTree Project Foundation • 20-Stage Alpha Roadmap • Stage 4 Completed</p>
      </footer>
    </div>
  );
};

export default App;
