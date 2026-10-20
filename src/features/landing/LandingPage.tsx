import React from 'react';
import { TreePreview } from './TreePreview';
import './landing.css';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenContactAdmin: () => void;
  adminWhatsApp?: string;
  adminEmail?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenContactAdmin,
  adminWhatsApp = '+1234567890',
  adminEmail = 'admin@gmail.com',
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappClean = adminWhatsApp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappClean}`;
  const emailUrl = `mailto:${adminEmail}?subject=FamTree%20Concierge%20Inquiry`;

  return (
    <div className="lux-landing-root" id="landing-root">
      {/* Ambient Celestial Heritage Backdrops */}
      <div className="lux-ambient-mesh"></div>
      <div className="lux-ambient-light light-top-center"></div>
      <div className="lux-ambient-light light-mid-right"></div>
      <div className="lux-ambient-light light-bot-left"></div>

      {/* ---------------------------------------------------------------------
          1. Navbar
          --------------------------------------------------------------------- */}
      <header className="lux-navbar-wrapper">
        <nav className="lux-navbar" id="landing-navbar">
          {/* Logo + "FamTree" */}
          <a
            href="#hero"
            className="lux-brand-seal"
            id="nav-brand"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
          >
            <div className="lux-seal-crest">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <circle cx="6" cy="19" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M12 8v4" />
                <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
              </svg>
            </div>
            <div className="lux-brand-text-col">
              <span className="lux-brand-title">FamTree</span>
              <span className="lux-brand-sub">Sovereign Lineage</span>
            </div>
          </a>

          {/* Navigation links: Home, About, How it works, Contact Admin */}
          <ul className="lux-nav-links" id="nav-center-links">
            <li className="lux-nav-item">
              <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }} id="nav-link-home">
                Home
              </a>
            </li>
            <li className="lux-nav-item">
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} id="nav-link-about">
                About
              </a>
            </li>
            <li className="lux-nav-item">
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }} id="nav-link-how">
                How it works
              </a>
            </li>
            <li className="lux-nav-item">
              <button type="button" className="lux-nav-btn-link" onClick={onOpenContactAdmin} id="nav-link-contact">
                Contact Admin
              </button>
            </li>
          </ul>

          {/* Login button (outlined style) + Register */}
          <div className="lux-nav-actions">
            <button
              type="button"
              className="lux-btn-outline-login"
              onClick={onOpenLogin}
              id="nav-btn-login"
            >
              <span>Login</span>
            </button>
            <button
              type="button"
              className="lux-btn-primary-register"
              onClick={onOpenRegister}
              id="nav-btn-register"
            >
              <span>Register</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ---------------------------------------------------------------------
          2. Hero Section
          --------------------------------------------------------------------- */}
      <section className="lux-hero-section" id="hero">
        <div className="lux-hero-crown">
          <div className="lux-crown-badge">
            <span className="lux-star-sparkle">✦</span>
            <span>Private Sovereign Family Archive</span>
            <span className="lux-star-sparkle">✦</span>
          </div>
        </div>

        {/* Large title: FamTree */}
        <h1 className="lux-hero-title">FamTree</h1>

        {/* Tagline: Every branch. One family. */}
        <p className="lux-hero-tagline">
          Every branch. <span className="lux-gold-gradient">One family.</span>
        </p>

        {/* Sub-line: A private home for our family’s roots. */}
        <p className="lux-hero-subline">
          A private home for our family’s roots.
        </p>

        {/* Two buttons: Register (primary filled) and Login (outline) */}
        <div className="lux-hero-actions">
          <button
            type="button"
            className="lux-hero-btn-primary"
            onClick={onOpenRegister}
            id="hero-btn-register"
          >
            <span>Register Profile</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button
            type="button"
            className="lux-hero-btn-outline"
            onClick={onOpenLogin}
            id="hero-btn-login"
          >
            <span>Login to Sanctuary</span>
          </button>
        </div>

        {/* Luxury lineage hallmarks */}
        <div className="lux-hallmarks-strip">
          <div className="hallmark-item">
            <span className="hallmark-gold">100%</span>
            <span className="hallmark-label">Private & Sealed</span>
          </div>
          <div className="hallmark-sep">/</div>
          <div className="hallmark-item">
            <span className="hallmark-gold">Zero</span>
            <span className="hallmark-label">DOB Exposure</span>
          </div>
          <div className="hallmark-sep">/</div>
          <div className="hallmark-item">
            <span className="hallmark-gold">Multi-Gen</span>
            <span className="hallmark-label">Connected Lineage</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          3. About Strip
          --------------------------------------------------------------------- */}
      <section className="lux-about-strip" id="about">
        <div className="lux-about-inner">
          <div className="lux-charter-seal">
            <span className="charter-glyph">⚜</span>
          </div>
          <p className="lux-about-text">
            “A family-only tree. Verified members. Your details, your choice.”
          </p>
          <div className="lux-charter-seal">
            <span className="charter-glyph">⚜</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          4. How it works
          --------------------------------------------------------------------- */}
      <section className="lux-section" id="how-it-works">
        <div className="lux-section-header">
          <div className="lux-section-badge">
            <span>Architectural Lineage Pathway</span>
          </div>
          <h2 className="lux-section-title">How It Works</h2>
          <p className="lux-section-sub">
            Four dignified steps to reconnect, verify your place, and access our living genealogical canopy.
          </p>
        </div>

        <div className="lux-steps-grid">
          {/* 1. Register */}
          <div className="lux-step-card" id="step-1">
            <div className="lux-card-glow-overlay"></div>
            <div className="step-header">
              <span className="step-roman">01</span>
              <div className="step-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
            </div>
            <h3 className="step-title">1. Register</h3>
            <p className="step-body">
              Input your 4 sacred name components and direct contact channel. In strict respect of privacy, exact dates of birth are never collected.
            </p>
            <div className="step-footer">
              <span className="step-tag">FR-03 Age Protected</span>
            </div>
          </div>

          {/* 2. Verify */}
          <div className="lux-step-card" id="step-2">
            <div className="lux-card-glow-overlay"></div>
            <div className="step-header">
              <span className="step-roman">02</span>
              <div className="step-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
            <h3 className="step-title">2. Verify</h3>
            <p className="step-body">
              Confirm your contact channel with a cryptographic 6-digit OTP code, single-use with rate limiting and 10-minute expiry.
            </p>
            <div className="step-footer">
              <span className="step-tag">SHA-256 Validated</span>
            </div>
          </div>

          {/* 3. Confirm your match */}
          <div className="lux-step-card" id="step-3">
            <div className="lux-card-glow-overlay"></div>
            <div className="step-header">
              <span className="step-roman">03</span>
              <div className="step-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 className="step-title">3. Confirm your match</h3>
            <p className="step-body">
              Our preconfigured lineage matching validates your identity against parents’ records to eliminate duplicates and uphold genealogical truth.
            </p>
            <div className="step-footer">
              <span className="step-tag">FR-22 Sealed Account</span>
            </div>
          </div>

          {/* 4. Open your tree */}
          <div className="lux-step-card" id="step-4">
            <div className="lux-card-glow-overlay"></div>
            <div className="step-header">
              <span className="step-roman">04</span>
              <div className="step-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </div>
            </div>
            <h3 className="step-title">4. Open your tree</h3>
            <p className="step-body">
              Unlock your verified dashboard and explore the interactive generational canvas centered on your immediate family branches.
            </p>
            <div className="step-footer">
              <span className="step-tag">Interactive Heritage</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          5. Tree Preview Section (7 Dummy Nodes with Hover Pop-up)
          --------------------------------------------------------------------- */}
      <section className="lux-section lux-tree-section" id="tree-preview">
        <div className="lux-section-header">
          <div className="lux-section-badge">
            <span>Living Lineage Canvas</span>
          </div>
          <h2 className="lux-section-title">Generations Reconnected</h2>
          <p className="lux-section-sub">
            Grandparents, parents, spouses, and descendants intertwined in a structured, sovereign visual hierarchy.
          </p>
        </div>

        {/* 7 Dummy Nodes Canvas */}
        <TreePreview />
      </section>

      {/* ---------------------------------------------------------------------
          6. Privacy Strip
          --------------------------------------------------------------------- */}
      <section className="lux-privacy-strip" id="privacy">
        <div className="lux-privacy-inner">
          <div className="lux-privacy-block">
            <span className="lux-check-gold">✦</span>
            <span className="lux-privacy-word">Verified</span>
            <span className="lux-privacy-subtext">Vetted Sovereign Accounts</span>
          </div>

          <span className="lux-strip-dot">·</span>

          <div className="lux-privacy-block">
            <span className="lux-check-gold">✦</span>
            <span className="lux-privacy-word">Private</span>
            <span className="lux-privacy-subtext">Hidden from Web Crawlers</span>
          </div>

          <span className="lux-strip-dot">·</span>

          <div className="lux-privacy-block">
            <span className="lux-check-gold">✦</span>
            <span className="lux-privacy-word">Family-only</span>
            <span className="lux-privacy-subtext">Exclusively Confirmed Kin</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          7. Contact Admin Section
          --------------------------------------------------------------------- */}
      <section className="lux-contact-section" id="contact-admin">
        <div className="lux-contact-card">
          <div className="lux-concierge-icon">
            <span>🏛️</span>
          </div>

          {/* Heading: Can’t find your name? Contact Admin. */}
          <h2 className="lux-contact-title">Can’t find your name? Contact Admin.</h2>

          <p className="lux-contact-desc">
            If your family branch has not yet been seeded into our registry or you require identity verification, our lineage administrators are ready to assist you directly.
          </p>

          {/* Two buttons: WhatsApp and Email */}
          <div className="lux-contact-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lux-btn-whatsapp"
              id="btn-landing-whatsapp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.184 1.564 5.938l-1.662 6.074 6.221-1.632c1.701.927 3.652 1.458 5.729 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
              </svg>
              <span>Connect on WhatsApp</span>
            </a>

            <a
              href={emailUrl}
              className="lux-btn-email"
              id="btn-landing-email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Email Support Concierge</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          8. Footer
          --------------------------------------------------------------------- */}
      <footer className="lux-footer" id="footer">
        <div className="lux-footer-content">
          <div className="lux-footer-crest-row">
            <div className="lux-seal-crest crest-mini">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <circle cx="6" cy="19" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M12 8v4" />
                <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
              </svg>
            </div>
            <span className="lux-footer-title">FamTree</span>
          </div>

          <ul className="lux-footer-nav">
            <li>
              <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
                Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>
                About
              </a>
            </li>
            <li>
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>
                How it works
              </a>
            </li>
            <li>
              <button type="button" onClick={onOpenContactAdmin}>
                Contact Admin
              </button>
            </li>
            <li>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); scrollTo('privacy'); }}>
                Privacy
              </a>
            </li>
          </ul>

          <p className="lux-footer-text">
            Family use only · © 2026 FamTree
          </p>
        </div>
      </footer>
    </div>
  );
};
