import React, { useEffect, useState } from 'react';
import type { FamilyMember, FamilyMatchResult } from '../familyTree/types';
import { searchFamilyMembers } from '../../services/familyMatchingService';
import { ContactAdminView } from './ContactAdminView';
import './auth.css';

interface FamilyMatchingStepProps {
  name: string;
  surname: string;
  fatherName?: string;
  motherName?: string;
  onMatchConfirmed: (member: FamilyMember) => void;
  onBack: () => void;
  onSwitchToLogin?: () => void;
}

export const FamilyMatchingStep: React.FC<FamilyMatchingStepProps> = ({
  name,
  surname,
  onMatchConfirmed,
  onBack,
  onSwitchToLogin,
}) => {
  const [matchResult, setMatchResult] = useState<FamilyMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCandidate, setSelectedCandidate] = useState<FamilyMember | null>(null);
  const [showContactAdmin, setShowContactAdmin] = useState<boolean>(false);
  const [contactAdminReason, setContactAdminReason] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function performMatch() {
      setIsLoading(true);
      const res = await searchFamilyMembers(name, surname);

      if (isMounted) {
        setMatchResult(res);
        setIsLoading(false);

        if (res.outcome === 'single_match' && res.candidate) {
          setSelectedCandidate(res.candidate);
        } else if (res.outcome === 'no_match') {
          setContactAdminReason(
            `No matching profile for "${name} ${surname}" was found in the preconfigured family tree (FR-08).`
          );
          setShowContactAdmin(true);
        }
      }
    }

    performMatch();

    return () => {
      isMounted = false;
    };
  }, [name, surname]);

  const handleRejectCandidate = () => {
    setContactAdminReason(
      `You indicated that the detected profile does not match your identity (FR-08). Please contact your family administrator.`
    );
    setShowContactAdmin(true);
  };

  // If routed to Contact Admin
  if (showContactAdmin) {
    return (
      <ContactAdminView
        reason={contactAdminReason}
        onBack={() => setShowContactAdmin(false)}
      />
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="matching-loading-card">
        <div className="matching-spinner"></div>
        <h3 className="matching-loading-title">Checking Preconfigured Family Tree</h3>
        <p className="matching-loading-subtitle">
          Searching for <strong>{name} {surname}</strong> in family records (FR-05)...
        </p>
      </div>
    );
  }

  // Already Linked Case
  if (matchResult?.outcome === 'already_linked') {
    return (
      <div className="auth-body">
        <div className="auth-alert auth-alert-warning" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong>Account Already Registered</strong>
            <p style={{ marginTop: '2px', fontSize: '0.8125rem' }}>
              An account is already linked to the profile of <strong>{name} {surname}</strong>.
            </p>
          </div>
        </div>

        <p className="auth-subtitle" style={{ marginTop: 'var(--space-3)' }}>
          Existing accounts should be accessed through standard login or password recovery.
        </p>

        <div className="wizard-actions" style={{ marginTop: 'var(--space-4)' }}>
          <button type="button" className="btn-secondary" onClick={onBack}>
            ← Back
          </button>
          {onSwitchToLogin && (
            <button type="button" className="btn-primary" onClick={onSwitchToLogin} style={{ width: 'auto' }}>
              Go to Sign In
            </button>
          )}
        </div>
      </div>
    );
  }

  // Single Match Case (FR-06)
  if (matchResult?.outcome === 'single_match' && matchResult.candidate) {
    const candidate = matchResult.candidate;

    return (
      <div className="auth-body">
        <div className="matching-header">
          <span className="channel-indicator">Stage 9: Tree Match</span>
          <h3 className="matching-title">Family Member Profile Found</h3>
          <p className="auth-subtitle">
            A unique matching profile was located in the preconfigured family tree (FR-06).
          </p>
        </div>

        {/* Profile Details Confirmation Card */}
        <div className="candidate-match-card confirmed-focus">
          <div className="candidate-card-header">
            <div className="candidate-avatar-badge">
              {candidate.name.charAt(0)}
              {candidate.surname.charAt(0)}
            </div>
            <div>
              <h4 className="candidate-fullname">
                {candidate.name} {candidate.surname}
              </h4>
              <span className="candidate-status-pill">{candidate.life_status}</span>
            </div>
          </div>

          <div className="candidate-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Father&apos;s Name</span>
              <strong className="meta-value">{candidate.father_name || 'Not recorded'}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Mother&apos;s Name</span>
              <strong className="meta-value">{candidate.mother_name || 'Not recorded'}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Date of Birth</span>
              <strong className="meta-value">{candidate.date_of_birth || 'Not recorded'}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-label">Record ID</span>
              <strong className="meta-value" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {candidate.id.slice(0, 8)}...
              </strong>
            </div>
          </div>

          <div className="match-prompt-box">
            <strong>Is this your family profile?</strong>
            <p className="text-muted-xs" style={{ marginTop: '2px' }}>
              Confirming will link your new account to this family tree member record (FR-06, FR-22).
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="wizard-actions" style={{ marginTop: 'var(--space-4)' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleRejectCandidate}
            id="btn-reject-match"
          >
            No, this isn&apos;t me
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{ width: 'auto', minWidth: '160px' }}
            onClick={() => onMatchConfirmed(candidate)}
            id="btn-confirm-single-match"
          >
            ✓ Yes, this is me
          </button>
        </div>
      </div>
    );
  }

  // Duplicate Matches Case (FR-07)
  if (matchResult?.outcome === 'multiple_matches' && matchResult.candidates) {
    return (
      <div className="auth-body">
        <div className="matching-header">
          <span className="channel-indicator">Stage 9: Multiple Matches</span>
          <h3 className="matching-title">Multiple Profiles Found (FR-07)</h3>
          <p className="auth-subtitle">
            Multiple members share the name <strong>{name} {surname}</strong>. Please select your profile using the parents&apos; names and date of birth below:
          </p>
        </div>

        <div className="candidates-list">
          {matchResult.candidates.map((cand) => {
            const isSelected = selectedCandidate?.id === cand.id;
            return (
              <div
                key={cand.id}
                className={`candidate-choice-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedCandidate(cand)}
                role="button"
                tabIndex={0}
              >
                <div className="choice-radio-circle">
                  {isSelected && <div className="choice-radio-inner" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="candidate-choice-title">
                    <strong>
                      {cand.name} {cand.surname}
                    </strong>
                    <span className="choice-dob-pill">Born: {cand.date_of_birth}</span>
                  </div>
                  <div className="candidate-choice-sub">
                    <span>Father: {cand.father_name || 'N/A'}</span> •{' '}
                    <span>Mother: {cand.mother_name || 'N/A'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="wizard-actions" style={{ marginTop: 'var(--space-4)' }}>
          <button
            type="button"
            className="auth-text-link"
            onClick={handleRejectCandidate}
          >
            None of these is me → Contact Admin
          </button>

          <button
            type="button"
            className="btn-primary"
            style={{ width: 'auto', minWidth: '160px' }}
            disabled={!selectedCandidate}
            onClick={() => selectedCandidate && onMatchConfirmed(selectedCandidate)}
            id="btn-confirm-duplicate-match"
          >
            Confirm Selected Profile
          </button>
        </div>
      </div>
    );
  }

  return null;
};
