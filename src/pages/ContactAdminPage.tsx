import React from 'react';
import { ContactAdminView, type InquiryCategory } from '../features/auth/ContactAdminView';
import '../features/auth/auth.css';

interface ContactAdminPageProps {
  initialCategory?: InquiryCategory;
  onNavigateBack?: () => void;
}

export const ContactAdminPage: React.FC<ContactAdminPageProps> = ({
  initialCategory = 'general',
  onNavigateBack,
}) => {
  return (
    <div className="contact-admin-page-wrapper" style={{ minHeight: '80vh', padding: 'var(--space-6) var(--space-4)' }}>
      {/* Breadcrumb / Back Navigation */}
      <div style={{ maxWidth: '680px', margin: '0 auto var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={onNavigateBack || (() => window.history.back())}
          className="btn-secondary"
          style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>← Back to FamTree</span>
        </button>
        <span className="card-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
          Stage 11: Contact Admin (FR-09)
        </span>
      </div>

      <ContactAdminView
        initialCategory={initialCategory}
        isStandalonePage={true}
        onBack={onNavigateBack}
      />
    </div>
  );
};

export default ContactAdminPage;
