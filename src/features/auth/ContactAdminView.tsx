import React, { useEffect, useState } from 'react';
import type { AdminContact } from '../familyTree/types';
import { getAdminContactInfo } from '../../services/familyMatchingService';
import './auth.css';

interface ContactAdminViewProps {
  reason?: string;
  onBack?: () => void;
  onClose?: () => void;
}

export const ContactAdminView: React.FC<ContactAdminViewProps> = ({
  reason = 'We could not find your profile in the preconfigured family tree.',
  onBack,
  onClose,
}) => {
  const [adminContact, setAdminContact] = useState<AdminContact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadContact() {
      const contact = await getAdminContactInfo();
      if (isMounted) {
        setAdminContact(contact);
        setIsLoading(false);
      }
    }
    loadContact();
    return () => {
      isMounted = false;
    };
  }, []);

  const whatsappClean = adminContact?.whatsapp_number.replace(/\D/g, '') || '';
  // WhatsApp opens direct chat without prefilled text according to FR-09
  const whatsappUrl = `https://wa.me/${whatsappClean}`;
  const emailUrl = `mailto:${adminContact?.support_email || 'admin@famtree.internal'}?subject=FamTree%20Membership%20Assistance`;

  return (
    <div className="contact-admin-container">
      <div className="contact-admin-header">
        <div className="contact-admin-icon-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <h3 className="contact-admin-title">Contact Family Administrator</h3>
        <span className="contact-admin-badge">FR-08 & FR-09 Support</span>
      </div>

      <div className="auth-alert auth-alert-warning" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{reason}</span>
      </div>

      <div className="contact-admin-card">
        <p className="contact-instructions">
          {adminContact?.instructions ||
            'Please contact your family administrator to have your profile verified or added to the family tree.'}
        </p>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
            <span className="text-muted-sm">Loading administrator contact details...</span>
          </div>
        ) : (
          <div className="contact-actions-grid">
            {/* WhatsApp Contact Action (FR-09: without prefilled text) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contact-action btn-whatsapp"
              id="btn-admin-whatsapp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp Admin (Direct Chat)</span>
            </a>

            {/* Support Email Action */}
            <a
              href={emailUrl}
              className="btn-contact-action btn-email"
              id="btn-admin-email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Email: {adminContact?.support_email || 'admin@famtree.internal'}</span>
            </a>
          </div>
        )}
      </div>

      <div className="wizard-actions" style={{ marginTop: 'var(--space-4)' }}>
        {onBack && (
          <button type="button" className="btn-secondary" onClick={onBack}>
            ← Back
          </button>
        )}
        {onClose && (
          <button type="button" className="btn-primary" onClick={onClose} style={{ width: 'auto' }}>
            Close
          </button>
        )}
      </div>
    </div>
  );
};
