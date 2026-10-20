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
    <div className="clean-landing-root" id="landing-root">
      {/* ---------------------------------------------------------------------
          Navbar
          --------------------------------------------------------------------- */}
      <header className="clean-header">
        <div className="clean-header-container">
          {/* Logo + FamTree */}
          <a
            href="#hero"
            className="clean-brand"
            id="nav-brand"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
          >
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <circle cx="6" cy="19" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M12 8v4" />
                <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
              </svg>
            </div>
            <span className="brand-name">FamTree</span>
          </a>

          {/* Links: Home, About, How it works, Contact Admin */}
          <nav className="clean-nav" id="nav-center-links">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }} className="nav-item">
              Home
            </a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} className="nav-item">
              About
            </a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }} className="nav-item">
              How it works
            </a>
            <button type="button" onClick={onOpenContactAdmin} className="nav-item nav-btn">
              Contact Admin
            </button>
          </nav>

          {/* Buttons: Login (outline) and Register (solid) */}
          <div className="clean-nav-actions">
            <button
              type="button"
              className="btn-login-outline"
              onClick={onOpenLogin}
              id="nav-btn-login"
            >
              Login
            </button>
            <button
              type="button"
              className="btn-register-solid"
              onClick={onOpenRegister}
              id="nav-btn-register"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------------
          Hero Section
          --------------------------------------------------------------------- */}
      <section className="clean-hero" id="hero">
        <div className="clean-hero-content">
          <h1 className="hero-heading">FamTree</h1>
          <p className="hero-tagline">Every branch. One family.</p>
          <p className="hero-subtext">A private home for our family’s roots.</p>

          <div className="hero-buttons">
            <button
              type="button"
              className="btn-hero-register"
              onClick={onOpenRegister}
              id="hero-btn-register"
            >
              Register
            </button>
            <button
              type="button"
              className="btn-hero-login"
              onClick={onOpenLogin}
              id="hero-btn-login"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          About Strip
          --------------------------------------------------------------------- */}
      <section className="clean-about-strip" id="about">
        <div className="about-strip-container">
          <p className="about-text">
            A family-only tree. Verified members. Your details, your choice.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          How it works
          --------------------------------------------------------------------- */}
      <section className="clean-section" id="how-it-works">
        <div className="section-head">
          <span className="section-eyebrow">Process</span>
          <h2 className="section-title">How it works</h2>
        </div>

        <div className="steps-row">
          {/* Step 1 */}
          <div className="step-box" id="step-1">
            <span className="step-index">01</span>
            <h3 className="step-heading">Register</h3>
            <p className="step-description">
              Provide your name components and contact details. We do not ask for exact birthdates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-box" id="step-2">
            <span className="step-index">02</span>
            <h3 className="step-heading">Verify</h3>
            <p className="step-description">
              Confirm your phone or email with a single-use verification code to secure your account.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-box" id="step-3">
            <span className="step-index">03</span>
            <h3 className="step-heading">Confirm your match</h3>
            <p className="step-description">
              Connect to your existing family record, confirmed against parents and family branches.
            </p>
          </div>

          {/* Step 4 */}
          <div className="step-box" id="step-4">
            <span className="step-index">04</span>
            <h3 className="step-heading">Open your tree</h3>
            <p className="step-description">
              Access your personal family tree and explore generations of connected relatives.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Tree Preview Section
          --------------------------------------------------------------------- */}
      <section className="clean-section tree-section" id="tree-preview">
        <div className="section-head">
          <span className="section-eyebrow">Interactive Preview</span>
          <h2 className="section-title">Family Tree Preview</h2>
        </div>

        <TreePreview />
      </section>

      {/* ---------------------------------------------------------------------
          Privacy Strip
          --------------------------------------------------------------------- */}
      <section className="clean-privacy-strip" id="privacy">
        <div className="privacy-items">
          <span className="privacy-point">Verified</span>
          <span className="privacy-bullet">·</span>
          <span className="privacy-point">Private</span>
          <span className="privacy-bullet">·</span>
          <span className="privacy-point">Family-only</span>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Contact Admin Section
          --------------------------------------------------------------------- */}
      <section className="clean-contact-section" id="contact-admin">
        <div className="contact-box">
          <h2 className="contact-title">Can’t find your name? Contact Admin.</h2>
          <p className="contact-subtext">
            If your profile is not yet on the tree or you need help joining, reach out directly to your family admin.
          </p>

          <div className="contact-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              id="btn-landing-whatsapp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.184 1.564 5.938l-1.662 6.074 6.221-1.632c1.701.927 3.652 1.458 5.729 1.458 6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            <a
              href={emailUrl}
              className="btn-email"
              id="btn-landing-email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Email</span>
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Footer
          --------------------------------------------------------------------- */}
      <footer className="clean-footer" id="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <span className="footer-logo">FamTree</span>
            <span className="footer-tagline">Family use only · © 2026 FamTree</span>
          </div>

          <div className="footer-links">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
              Home
            </a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>
              About
            </a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>
              How it works
            </a>
            <button type="button" onClick={onOpenContactAdmin} className="footer-btn">
              Contact Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
