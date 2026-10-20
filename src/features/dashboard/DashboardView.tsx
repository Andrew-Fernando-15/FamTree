import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './dashboard.css';

interface DashboardViewProps {
  onOpenFamilyTree?: () => void;
  onOpenProfile?: () => void;
  onOpenContactAdmin?: () => void;
  onOpenAdminConsole?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenFamilyTree,
  onOpenProfile,
  onOpenContactAdmin,
  onOpenAdminConsole,
}) => {
  const { user, member, account, logout } = useAuth();

  const fullName = member?.name && member?.surname
    ? `${member.name} ${member.surname}`
    : user?.email?.split('@')[0] || 'Family Member';

  const initials = member?.name && member?.surname
    ? `${member.name.charAt(0)}${member.surname.charAt(0)}`
    : 'FT';

  const userRole = account?.role || 'member';
  const isAdmin = userRole === 'admin' || userRole === 'level2_admin';

  return (
    <div className="dashboard-container" id="member-dashboard">
      {/* 1. Welcome Hero Banner */}
      <section className="dashboard-welcome-banner" id="dashboard-welcome">
        <div className="welcome-identity-group">
          <div className="welcome-avatar-circle" aria-label="Member Initials">
            {initials}
          </div>
          <div>
            <div className="welcome-title-row">
              <h1 className="welcome-heading">Welcome back, {fullName}!</h1>
              <span className={`role-pill-badge ${userRole}`}>
                {userRole === 'level2_admin' ? 'Level-2 Admin' : userRole}
              </span>
            </div>
            <div className="welcome-subtext">
              <span>{user?.email || member?.primary_email}</span>
              <span>•</span>
              <span className="welcome-meta-pill">FR-22 Linked Profile</span>
              <span>•</span>
              <span className="welcome-meta-pill">Branch: Fernando</span>
            </div>
          </div>
        </div>

        <div className="welcome-quick-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onOpenProfile}
            id="btn-quick-profile"
            style={{ width: 'auto' }}
          >
            My Profile
          </button>
          <button
            type="button"
            className="btn-signout"
            onClick={() => logout()}
            id="btn-dashboard-signout"
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* 2. Lineage Quick Metrics Overview */}
      <section className="dashboard-metrics-grid" id="dashboard-metrics">
        <div className="metric-card" id="metric-connected-members">
          <div className="metric-icon-box emerald">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-value">7 Members</span>
            <span className="metric-label">Connected Lineage</span>
          </div>
        </div>

        <div className="metric-card" id="metric-generations">
          <div className="metric-icon-box blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="3" />
              <circle cx="6" cy="19" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M12 8v4" />
              <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-value">3 Generations</span>
            <span className="metric-label">Ancestral Depth</span>
          </div>
        </div>

        <div className="metric-card" id="metric-heritage-branch">
          <div className="metric-icon-box amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-value">Fernando</span>
            <span className="metric-label">Heritage Lineage</span>
          </div>
        </div>

        <div className="metric-card" id="metric-privacy-status">
          <div className="metric-icon-box purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-value">Family-Only</span>
            <span className="metric-label">Privacy Shield</span>
          </div>
        </div>
      </section>

      {/* 3. Action Shortcuts Grid (FR-12) */}
      <section id="dashboard-shortcuts">
        <h2 className="dashboard-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Lineage Shortcuts & Gateways
        </h2>

        <div className="dashboard-shortcuts-grid">
          {/* Family Tree Gateway */}
          <div
            className="shortcut-card featured"
            onClick={onOpenFamilyTree}
            id="shortcut-family-tree"
            role="button"
            tabIndex={0}
          >
            <div className="shortcut-card-header">
              <div className="shortcut-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="3" />
                  <circle cx="6" cy="19" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M12 8v4" />
                  <path d="M6 16v-1a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="shortcut-title">Explore Family Tree</h3>
                <span className="card-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                  Canvas Active
                </span>
              </div>
            </div>
            <p className="shortcut-desc">
              Browse interactive multi-generational tree visualization, zoom through ancestral branches, and inspect parent-child relationships.
            </p>
            <span className="shortcut-action-link">
              Open Interactive Tree <span>→</span>
            </span>
          </div>

          {/* Profile & Privacy Gateway */}
          <div
            className="shortcut-card"
            onClick={onOpenProfile}
            id="shortcut-profile"
            role="button"
            tabIndex={0}
          >
            <div className="shortcut-card-header">
              <div className="shortcut-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h3 className="shortcut-title">My Profile & Privacy</h3>
                <span className="card-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  FR-16 & FR-17
                </span>
              </div>
            </div>
            <p className="shortcut-desc">
              Configure personal details, work and study status, and fine-tune field visibility preferences for phone and email.
            </p>
            <span className="shortcut-action-link">
              Manage Profile & Visibility <span>→</span>
            </span>
          </div>

          {/* Contact Admin Gateway */}
          <div
            className="shortcut-card"
            onClick={onOpenContactAdmin}
            id="shortcut-contact-admin"
            role="button"
            tabIndex={0}
          >
            <div className="shortcut-card-header">
              <div className="shortcut-icon-circle" style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div>
                <h3 className="shortcut-title">Contact Family Admin</h3>
                <span className="card-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                  FR-09 WhatsApp
                </span>
              </div>
            </div>
            <p className="shortcut-desc">
              Request tree insertions, resolve duplicate candidate profiles, or submit legal identity corrections (FR-08, FR-18).
            </p>
            <span className="shortcut-action-link">
              Contact Administrator <span>→</span>
            </span>
          </div>

          {/* Admin Console Gateway (Visible only for admin or level2_admin) */}
          {isAdmin && (
            <div
              className="shortcut-card"
              onClick={onOpenAdminConsole}
              id="shortcut-admin-console"
              role="button"
              tabIndex={0}
              style={{ borderColor: 'rgba(239, 68, 68, 0.35)', background: 'rgba(239, 68, 68, 0.05)' }}
            >
              <div className="shortcut-card-header">
                <div className="shortcut-icon-circle" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="shortcut-title">Admin Console</h3>
                  <span className="card-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                    Stage 17 Privileged
                  </span>
                </div>
              </div>
              <p className="shortcut-desc">
                Level-2 administrator controls to insert new members, configure relationships, and manage lineage data.
              </p>
              <span className="shortcut-action-link" style={{ color: '#f87171' }}>
                Open Admin Console <span>→</span>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 4. Two-Column Detailed Information */}
      <section className="dashboard-details-row" id="dashboard-details">
        {/* Linked Profile Card */}
        <div className="details-card" id="card-linked-profile-details">
          <div className="details-card-header">
            <h3 className="details-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
              My Linked Identity (FR-22)
            </h3>
            <span className="card-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              Verified
            </span>
          </div>

          <div className="profile-meta-grid">
            <div className="profile-meta-item">
              <span className="meta-field-label">Full Name</span>
              <strong className="meta-field-value">{fullName}</strong>
            </div>

            <div className="profile-meta-item">
              <span className="meta-field-label">Life Status</span>
              <strong className="meta-field-value" style={{ textTransform: 'capitalize' }}>
                {member?.life_status || 'Active'}
              </strong>
            </div>

            <div className="profile-meta-item">
              <span className="meta-field-label">Father&apos;s Name</span>
              <strong className="meta-field-value">{member?.father_name || 'Not recorded'}</strong>
            </div>

            <div className="profile-meta-item">
              <span className="meta-field-label">Mother&apos;s Name</span>
              <strong className="meta-field-value">{member?.mother_name || 'Not recorded'}</strong>
            </div>

            <div className="profile-meta-item">
              <span className="meta-field-label">Date of Birth</span>
              <strong className="meta-field-value">{member?.date_of_birth || 'Not recorded'}</strong>
            </div>

            <div className="profile-meta-item">
              <span className="meta-field-label">Verified Phone</span>
              <strong className="meta-field-value">{member?.phone || 'Not recorded'}</strong>
            </div>

            <div className="profile-meta-item">
              <span className="meta-field-label">Primary Email</span>
              <strong className="meta-field-value" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                {member?.primary_email || user?.email || 'None (Age 50+)'}
              </strong>
            </div>

            <div className="profile-meta-item">
              <span className="meta-field-label">Work / Occupation</span>
              <strong className="meta-field-value">{member?.work_status || 'Not recorded'}</strong>
            </div>
          </div>
        </div>

        {/* Lineage Announcements & Heritage Notices */}
        <div className="details-card" id="card-lineage-announcements">
          <div className="details-card-header">
            <h3 className="details-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Lineage Notices & Governance
            </h3>
            <span className="card-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              Family Registry
            </span>
          </div>

          <div className="lineage-feed-list">
            <div className="feed-item">
              <div>
                <h4 className="feed-title">Fernando Lineage Registry Active</h4>
                <p className="feed-desc">
                  Three generations of ancestral records (Arthur & Beatrice, Charles & Diana, Aaron, Andrew & Chloe) are active.
                </p>
              </div>
            </div>

            <div className="feed-item info">
              <div>
                <h4 className="feed-title">Privacy Protection Shield Enforced</h4>
                <p className="feed-desc">
                  Under FR-17, contact details and personal status attributes are shared strictly with confirmed family members.
                </p>
              </div>
            </div>

            <div className="feed-item warning">
              <div>
                <h4 className="feed-title">Protected Identity Field Governance (FR-18)</h4>
                <p className="feed-desc">
                  Historical identity data (legal names, parents, date of birth) can only be updated by a Level-2 administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
