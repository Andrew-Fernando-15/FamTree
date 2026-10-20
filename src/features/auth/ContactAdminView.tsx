import React, { useEffect, useState } from 'react';
import type { AdminContact } from '../familyTree/types';
import { getAdminContactInfo } from '../../services/familyMatchingService';
import './auth.css';

export type InquiryCategory =
  | 'missing_tree'
  | 'profile_mismatch'
  | 'lost_credentials'
  | 'identity_correction'
  | 'general';

interface ContactAdminViewProps {
  initialCategory?: InquiryCategory;
  reason?: string;
  onBack?: () => void;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

interface CategoryGuidance {
  title: string;
  badge: string;
  shortDesc: string;
  requiredInfo: string[];
  adminRoleNotice: string;
}

const INQUIRY_GUIDANCE: Record<InquiryCategory, CategoryGuidance> = {
  missing_tree: {
    title: 'Missing from Family Tree',
    badge: 'FR-08 Tree Insertion',
    shortDesc: 'You searched the preconfigured family tree during registration, but your profile was not found.',
    requiredInfo: [
      'Your full legal name and preferred name',
      'Father and mother full names (for tree placement)',
      'Approximate date or year of birth',
      'Direct branch ancestor or family connection in the tree',
    ],
    adminRoleNotice: 'Level-2 Administrators hold exclusive authority to insert new branches and profiles into the tree.',
  },
  profile_mismatch: {
    title: 'Identity / Profile Mismatch',
    badge: 'FR-08 Disambiguation',
    shortDesc: 'The candidate profile displayed does not match your identity or lineage branch.',
    requiredInfo: [
      'Your verified mobile phone and email address',
      'Both parents’ full names and place of birth',
      'Any known siblings already listed in the tree',
    ],
    adminRoleNotice: 'The administrator will disambiguate duplicate names and ensure you are linked to the correct profile.',
  },
  lost_credentials: {
    title: 'Account Recovery Assistance',
    badge: 'FR-11 Recovery Support',
    shortDesc: 'You are locked out or cannot access your registered phone or primary email channels.',
    requiredInfo: [
      'Your full registered name and surname',
      'Original phone number or secondary email if recorded',
      'Proof of identity or confirmation by an existing active tree member',
    ],
    adminRoleNotice: 'Family administrators can verify your identity and help update your recovery contact channels.',
  },
  identity_correction: {
    title: 'Protected Identity Correction',
    badge: 'FR-18 Protected Fields',
    shortDesc: 'You need to correct protected historical identity attributes (legal name, parents, or birthdate).',
    requiredInfo: [
      'Your current recorded tree profile ID or name',
      'The exact field to update (Name, Father, Mother, or Date of Birth)',
      'Supporting reason or documentation for the correction',
    ],
    adminRoleNotice: 'To protect lineage integrity, members cannot edit identity fields directly. Level-2 Admin authorization is required (FR-18).',
  },
  general: {
    title: 'General Support & Inquiries',
    badge: 'Family Admin Help',
    shortDesc: 'Questions regarding family privacy, profile visibility settings, or tree administration.',
    requiredInfo: [
      'Your name and relationship to the Fernando lineage',
      'Description of your question or assistance needed',
    ],
    adminRoleNotice: 'The family administrator usually responds within 24 to 48 hours.',
  },
};

export const ContactAdminView: React.FC<ContactAdminViewProps> = ({
  initialCategory = 'general',
  reason,
  onBack,
  onClose,
  isStandalonePage = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory>(initialCategory);
  const [adminContact, setAdminContact] = useState<AdminContact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedType, setCopiedType] = useState<'phone' | 'email' | null>(null);

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

  const currentGuidance = INQUIRY_GUIDANCE[selectedCategory];

  // WhatsApp opens direct chat without prefilled text according to FR-09
  const whatsappClean = adminContact?.whatsapp_number.replace(/\D/g, '') || '';
  const whatsappUrl = `https://wa.me/${whatsappClean}`;

  const emailSubject = encodeURIComponent(`FamTree Inquiry: ${currentGuidance.title}`);
  const emailUrl = `mailto:${adminContact?.support_email || 'admin@gmail.com'}?subject=${emailSubject}`;

  const handleCopy = async (type: 'phone' | 'email', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
      setCopiedType(null);
    }
  };

  return (
    <div className={`contact-admin-container ${isStandalonePage ? 'standalone-page' : ''}`}>
      {/* Header */}
      <div className="contact-admin-header">
        <div className="contact-admin-icon-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <h3 className="contact-admin-title">Contact Family Administrator</h3>
        <span className="contact-admin-badge">{currentGuidance.badge}</span>
      </div>

      {/* Dynamic Context Banner if reason was passed */}
      {reason && (
        <div className="auth-alert auth-alert-warning" role="alert" style={{ marginBottom: 'var(--space-3)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong>Context Triggered Notice</strong>
            <p style={{ marginTop: '2px', fontSize: '0.8125rem' }}>{reason}</p>
          </div>
        </div>
      )}

      {/* Category Selection Tabs (FR-08, FR-11, FR-18) */}
      <div className="contact-category-chips" role="tablist" aria-label="Inquiry Reasons">
        <button
          type="button"
          className={`category-chip ${selectedCategory === 'missing_tree' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('missing_tree')}
        >
          Missing Profile (FR-08)
        </button>
        <button
          type="button"
          className={`category-chip ${selectedCategory === 'profile_mismatch' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('profile_mismatch')}
        >
          Mismatch (FR-08)
        </button>
        <button
          type="button"
          className={`category-chip ${selectedCategory === 'lost_credentials' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('lost_credentials')}
        >
          Lost Access (FR-11)
        </button>
        <button
          type="button"
          className={`category-chip ${selectedCategory === 'identity_correction' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('identity_correction')}
        >
          Name/DOB Fix (FR-18)
        </button>
        <button
          type="button"
          className={`category-chip ${selectedCategory === 'general' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('general')}
        >
          General Help
        </button>
      </div>

      {/* Guidance Card for the Selected Category */}
      <div className="category-guidance-card">
        <h4 className="guidance-heading">{currentGuidance.title}</h4>
        <p className="guidance-desc">{currentGuidance.shortDesc}</p>

        <div className="guidance-checklist-box">
          <span className="checklist-title">Information to prepare before contacting:</span>
          <ul className="guidance-list">
            {currentGuidance.requiredInfo.map((info, idx) => (
              <li key={idx}>
                <span className="check-bullet">✓</span>
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-role-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>{currentGuidance.adminRoleNotice}</span>
        </div>
      </div>

      {/* Official Contact Channels (FR-09) */}
      <div className="contact-admin-card" style={{ marginTop: 'var(--space-3)' }}>
        <p className="contact-instructions">
          {adminContact?.instructions ||
            'Please contact your family administrator directly. Direct communication ensures lineage authenticity and swift resolution.'}
        </p>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
            <span className="text-muted-sm">Loading administrator contact details...</span>
          </div>
        ) : (
          <div className="contact-actions-grid">
            {/* WhatsApp Contact Action (FR-09: strictly unprefilled chat URL) */}
            <div className="contact-channel-row">
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
                <span>WhatsApp Admin (Direct Unprefilled Chat)</span>
              </a>
              <button
                type="button"
                className="btn-copy-mini"
                onClick={() => handleCopy('phone', adminContact?.whatsapp_number || '+1234567890')}
                title="Copy phone number"
                id="btn-copy-admin-phone"
              >
                {copiedType === 'phone' ? '✓ Copied' : 'Copy #'}
              </button>
            </div>

            {/* Support Email Action */}
            <div className="contact-channel-row">
              <a
                href={emailUrl}
                className="btn-contact-action btn-email"
                id="btn-admin-email"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Email: {adminContact?.support_email || 'admin@gmail.com'}</span>
              </a>
              <button
                type="button"
                className="btn-copy-mini"
                onClick={() => handleCopy('email', adminContact?.support_email || 'admin@gmail.com')}
                title="Copy email address"
                id="btn-copy-admin-email"
              >
                {copiedType === 'email' ? '✓ Copied' : 'Copy Email'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="wizard-actions" style={{ marginTop: 'var(--space-4)' }}>
        {onBack && (
          <button type="button" className="btn-secondary" onClick={onBack}>
            ← Back
          </button>
        )}
        {onClose && (
          <button type="button" className="btn-primary" onClick={onClose} style={{ width: 'auto' }}>
            Done / Close
          </button>
        )}
      </div>
    </div>
  );
};
