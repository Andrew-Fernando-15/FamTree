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
  const emailUrl = `mailto:${adminEmail}?subject=FamTree%20Inquiry`;

  return (
    <div className="landing-page-root" id="landing-root">
      {/* ---------------------------------------------------------------------
          1. Navbar
          --------------------------------------------------------------------- */}
      <nav className="landing-navbar" id="landing-navbar">
        <div className="landing-nav-container">
          {/* Logo + "FamTree" */}
          <a href="#hero" className="nav-brand-group" id="nav-brand" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
            <div className="nav-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <circle cx="6" cy="19" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M12 8v4" />
                <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
              </svg>
            </div>
            <span className="nav-brand-title">FamTree</span>
          </a>

          {/* Navigation links: Home, About, How it works, Contact Admin */}
          <ul className="nav-center-links" id="nav-center-links">
            <li className="nav-link-item">
              <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }} id="nav-link-home">
                Home
              </a>
            </li>
            <li className="nav-link-item">
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} id="nav-link-about">
                About
              </a>
            </li>
            <li className="nav-link-item">
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }} id="nav-link-how">
                How it works
              </a>
            </li>
            <li className="nav-link-item">
              <button type="button" className="nav-link-btn" onClick={onOpenContactAdmin} id="nav-link-contact">
                Contact Admin
              </button>
            </li>
          </ul>

          {/* Login button (outlined style) */}
          <div className="nav-actions">
            <button
              type="button"
              className="btn-nav-login"
              onClick={onOpenLogin}
              id="nav-btn-login"
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn-nav-register"
              onClick={onOpenRegister}
              id="nav-btn-register"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* ---------------------------------------------------------------------
          2. Hero Section
          --------------------------------------------------------------------- */}
      <header className="landing-hero" id="hero">
        <div className="hero-pill-badge">
          <span>🌿 Private Heritage Network</span>
        </div>
        <h1 className="hero-main-title">FamTree</h1>
        <p className="hero-tagline">Every branch. One family.</p>
        <p className="hero-subline">A private home for our family’s roots.</p>

        <div className="hero-cta-group">
          {/* Register (primary filled) */}
          <button
            type="button"
            className="btn-hero-primary"
            onClick={onOpenRegister}
            id="hero-btn-register"
          >
            Register
          </button>
          {/* Login (outline) */}
          <button
            type="button"
            className="btn-hero-outline"
            onClick={onOpenLogin}
            id="hero-btn-login"
          >
            Login
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------------------------
          3. About Strip
          --------------------------------------------------------------------- */}
      <section className="landing-about-strip" id="about">
        <div className="about-strip-inner">
          <span className="about-strip-icon">🛡️</span>
          <p className="about-strip-text">
            “A family-only tree. Verified members. Your details, your choice.”
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          4. How it works
          --------------------------------------------------------------------- */}
      <section className="landing-section" id="how-it-works">
        <div className="section-header">
          <span className="section-badge">Simple 4-Step Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Connecting your generation to the family lineage is straightforward, secure, and private.
          </p>
        </div>

        <div className="how-it-works-grid">
          {/* Step 1: Register */}
          <div className="step-card" id="step-1">
            <div className="step-num-badge">01</div>
            <h3 className="step-card-title">1. Register</h3>
            <p className="step-card-desc">
              Enter your name components and contact channel. Strictly no exact date of birth is collected.
            </p>
          </div>

          {/* Step 2: Verify */}
          <div className="step-card" id="step-2">
            <div className="step-num-badge">02</div>
            <h3 className="step-card-title">2. Verify</h3>
            <p className="step-card-desc">
              Validate your contact channel via a secure 6-digit cryptographic OTP code with 10-minute expiry.
            </p>
          </div>

          {/* Step 3: Confirm your match */}
          <div className="step-card" id="step-3">
            <div className="step-num-badge">03</div>
            <h3 className="step-card-title">3. Confirm your match</h3>
            <p className="step-card-desc">
              Review your preconfigured family profile matched against verified parents and life records.
            </p>
          </div>

          {/* Step 4: Open your tree */}
          <div className="step-card" id="step-4">
            <div className="step-num-badge">04</div>
            <h3 className="step-card-title">4. Open your tree</h3>
            <p className="step-card-desc">
              Instantly enter your private dashboard, explore the generational canvas, and reconnect.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          5. Tree Preview Section
          --------------------------------------------------------------------- */}
      <section className="landing-section" id="tree-preview">
        <div className="section-header">
          <span className="section-badge">Interactive Canvas Preview</span>
          <h2 className="section-title">Explore Your Family Lineage</h2>
          <p className="section-subtitle">
            A preview of how multi-generation family branches connect with elegant parent-child and spouse paths.
          </p>
        </div>

        <TreePreview />
      </section>

      {/* ---------------------------------------------------------------------
          6. Privacy Strip
          --------------------------------------------------------------------- */}
      <section className="landing-privacy-strip" id="privacy">
        <div className="privacy-strip-inner">
          <div className="privacy-point">
            <span className="privacy-point-icon">✓</span>
            <span>Verified</span>
          </div>
          <span className="privacy-separator">·</span>
          <div className="privacy-point">
            <span className="privacy-point-icon">🔒</span>
            <span>Private</span>
          </div>
          <span className="privacy-separator">·</span>
          <div className="privacy-point">
            <span className="privacy-point-icon">🌱</span>
            <span>Family-only</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          7. Contact Admin Section
          --------------------------------------------------------------------- */}
      <section className="landing-contact-admin" id="contact-admin">
        <div className="contact-admin-card">
          <h2 className="contact-admin-title">Can’t find your name? Contact Admin.</h2>
          <p className="contact-admin-subtitle">
            If your branch has not yet been entered into our family records or you need manual identity verification, our lineage administrators are available to help.
          </p>

          <div className="contact-buttons-group">
            {/* WhatsApp button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact-whatsapp"
              id="btn-landing-whatsapp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.184 1.564 5.938l-1.662 6.074 6.221-1.632c1.701.927 3.652 1.458 5.729 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
              </svg>
              <span>WhatsApp Admin</span>
            </a>

            {/* Email button */}
            <a
              href={emailUrl}
              className="btn-contact-email"
              id="btn-landing-email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Email Support</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          8. Footer
          --------------------------------------------------------------------- */}
      <footer className="landing-footer" id="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-logo-icon" style={{ width: '28px', height: '28px', padding: '4px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <circle cx="6" cy="19" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M12 8v4" />
                <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
              </svg>
            </div>
            <span className="nav-brand-title" style={{ fontSize: '1.15rem' }}>FamTree</span>
          </div>

          <ul className="footer-nav">
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

          <p className="footer-text">
            Family use only · © 2026 FamTree
          </p>
        </div>
      </footer>
    </div>
  );
};
