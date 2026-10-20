import React, { useState } from 'react';

interface PreviewMember {
  id: string;
  name: string;
  role: string;
  birthYear: string;
  status: string;
  relation: string;
  initials: string;
  generation: string;
  isUser?: boolean;
  notes: string;
}

const PREVIEW_MEMBERS: Record<string, PreviewMember> = {
  g1: {
    id: 'g1',
    name: 'Arthur Fernando',
    role: 'Patriarch',
    birthYear: '1945',
    status: 'Ancestral Root',
    relation: 'Grandfather',
    initials: 'AF',
    generation: 'Generation I',
    notes: 'Family Patriarch · Branch Founder',
  },
  g2: {
    id: 'g2',
    name: 'Beatrice Fernando',
    role: 'Matriarch',
    birthYear: '1948',
    status: 'Ancestral Root',
    relation: 'Grandmother',
    initials: 'BF',
    generation: 'Generation I',
    notes: 'Family Matriarch · Heritage Keeper',
  },
  p1: {
    id: 'p1',
    name: 'Charles Fernando',
    role: 'Father',
    birthYear: '1970',
    status: 'Active Lineage',
    relation: 'Father',
    initials: 'CF',
    generation: 'Generation II',
    notes: 'Executive · Senior Branch Member',
  },
  u1: {
    id: 'u1',
    name: 'You (Andrew Fernando)',
    role: 'Active Member',
    birthYear: '1996',
    status: 'Verified Sovereign',
    relation: 'You',
    initials: 'YOU',
    generation: 'Generation III',
    isUser: true,
    notes: 'Product Lead · Authenticated Profile',
  },
  sp1: {
    id: 'sp1',
    name: 'Sarah Fernando',
    role: 'Spouse',
    birthYear: '1998',
    status: 'Active Lineage',
    relation: 'Spouse',
    initials: 'SF',
    generation: 'Generation III',
    notes: 'United by Marriage · Verified Relative',
  },
  sib1: {
    id: 'sib1',
    name: 'Chloe Fernando',
    role: 'Sister',
    birthYear: '2002',
    status: 'Active Lineage',
    relation: 'Sister',
    initials: 'CF',
    generation: 'Generation III',
    notes: 'Designer · Undergraduate Member',
  },
  c1: {
    id: 'c1',
    name: 'Leo Fernando',
    role: 'Child',
    birthYear: '2024',
    status: 'Next Generation',
    relation: 'Child',
    initials: 'LF',
    generation: 'Generation IV',
    notes: 'Next Generation Heir · Lineage Protected',
  },
};

export const TreePreview: React.FC = () => {
  const [activeMemberId, setActiveMemberId] = useState<string>('u1');
  const activeMember = PREVIEW_MEMBERS[activeMemberId] || PREVIEW_MEMBERS.u1;

  return (
    <div className="lux-tree-canvas-wrapper" id="interactive-tree-preview">
      {/* Ambient background glow & grid */}
      <div className="lux-canvas-grid-bg"></div>
      <div className="lux-canvas-glow"></div>

      {/* Canvas Top Bar / Interactive Header */}
      <div className="lux-canvas-toolbar">
        <div className="lux-canvas-badge">
          <span className="lux-pulse-jewel"></span>
          <span className="lux-toolbar-title">Interactive Lineage Canvas</span>
          <span className="lux-pill-count">7 Sovereign Nodes</span>
        </div>
        <div className="lux-hint-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z" />
          </svg>
          <span>Click or hover nodes to inspect the dossier</span>
        </div>
      </div>

      <div className="lux-tree-stage">
        {/* SVG Bezier Lineage Arteries (Background Connector Splines) */}
        <svg className="lux-tree-svg-network" viewBox="0 0 800 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldStemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="emeraldStem" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.6" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grandparents Union to Parent Charles */}
          <path
            d="M 400 70 L 400 135"
            stroke="url(#goldStemGradient)"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            filter="url(#goldGlow)"
          />

          {/* Parent Charles down to branch split */}
          <path
            d="M 400 205 L 400 235"
            stroke="url(#goldStemGradient)"
            strokeWidth="2.5"
          />

          {/* Crossbar branch to Chloe (left) and You+Spouse (right) */}
          <path
            d="M 230 255 C 230 235, 400 235, 400 235 C 400 235, 530 235, 530 255"
            stroke="url(#goldStemGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M 230 255 L 230 270" stroke="url(#goldStemGradient)" strokeWidth="2.5" />
          <path d="M 530 255 L 530 270" stroke="url(#goldStemGradient)" strokeWidth="2.5" />

          {/* You & Spouse union down to Child Leo */}
          <path
            d="M 530 340 L 530 405"
            stroke="url(#goldStemGradient)"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            filter="url(#goldGlow)"
          />
        </svg>

        {/* -------------------------------------------------------------
            Tier 1: Grandparents (Arthur & Beatrice)
            ------------------------------------------------------------- */}
        <div className="lux-tier-row tier-grandparents">
          <div className="lux-tier-badge">Generation I · Heritage Roots</div>
          <div className="lux-nodes-cluster">
            {/* Arthur */}
            <div
              className={`lux-node-capsule ${activeMemberId === 'g1' ? 'is-selected' : ''}`}
              onMouseEnter={() => setActiveMemberId('g1')}
              onClick={() => setActiveMemberId('g1')}
              tabIndex={0}
              role="button"
            >
              <div className="lux-avatar-ring">
                <span className="lux-avatar-text">AF</span>
              </div>
              <div className="lux-node-meta">
                <span className="lux-node-name">Arthur</span>
                <span className="lux-node-sub">Patriarch · 1945</span>
              </div>
            </div>

            {/* Sacred Marriage Bond */}
            <div className="lux-union-emblem" title="Sacred Marriage Bond">
              <span className="lux-ring-icon">✦</span>
            </div>

            {/* Beatrice */}
            <div
              className={`lux-node-capsule ${activeMemberId === 'g2' ? 'is-selected' : ''}`}
              onMouseEnter={() => setActiveMemberId('g2')}
              onClick={() => setActiveMemberId('g2')}
              tabIndex={0}
              role="button"
            >
              <div className="lux-avatar-ring">
                <span className="lux-avatar-text">BF</span>
              </div>
              <div className="lux-node-meta">
                <span className="lux-node-name">Beatrice</span>
                <span className="lux-node-sub">Matriarch · 1948</span>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            Tier 2: Parents (Charles)
            ------------------------------------------------------------- */}
        <div className="lux-tier-row tier-parents">
          <div className="lux-tier-badge">Generation II · Direct Lineage</div>
          <div className="lux-nodes-cluster">
            <div
              className={`lux-node-capsule ${activeMemberId === 'p1' ? 'is-selected' : ''}`}
              onMouseEnter={() => setActiveMemberId('p1')}
              onClick={() => setActiveMemberId('p1')}
              tabIndex={0}
              role="button"
            >
              <div className="lux-avatar-ring ring-parent">
                <span className="lux-avatar-text">CF</span>
              </div>
              <div className="lux-node-meta">
                <span className="lux-node-name">Charles</span>
                <span className="lux-node-sub">Father · 1970</span>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            Tier 3: You + Spouse + Sibling
            ------------------------------------------------------------- */}
        <div className="lux-tier-row tier-current">
          <div className="lux-tier-badge">Generation III · Your Generation</div>
          <div className="lux-tier-current-split">
            {/* Sibling (Chloe) */}
            <div
              className={`lux-node-capsule ${activeMemberId === 'sib1' ? 'is-selected' : ''}`}
              onMouseEnter={() => setActiveMemberId('sib1')}
              onClick={() => setActiveMemberId('sib1')}
              tabIndex={0}
              role="button"
            >
              <div className="lux-avatar-ring ring-sibling">
                <span className="lux-avatar-text">CF</span>
              </div>
              <div className="lux-node-meta">
                <span className="lux-node-name">Chloe</span>
                <span className="lux-node-sub">Sister · 2002</span>
              </div>
            </div>

            {/* Union: You (Andrew) + Spouse (Sarah) */}
            <div className="lux-married-union">
              {/* YOU */}
              <div
                className={`lux-node-capsule lux-node-user ${activeMemberId === 'u1' ? 'is-selected' : ''}`}
                onMouseEnter={() => setActiveMemberId('u1')}
                onClick={() => setActiveMemberId('u1')}
                tabIndex={0}
                role="button"
              >
                <div className="lux-avatar-ring ring-user">
                  <span className="lux-avatar-text gold-text">YOU</span>
                </div>
                <div className="lux-node-meta">
                  <div className="lux-user-headline">
                    <span className="lux-node-name">You (Andrew)</span>
                    <span className="lux-verified-chip">Verified</span>
                  </div>
                  <span className="lux-node-sub">Member · 1996</span>
                </div>
              </div>

              {/* Marriage Bond */}
              <div className="lux-union-emblem" title="Spouses">
                <span className="lux-ring-icon">✦</span>
              </div>

              {/* Spouse Sarah */}
              <div
                className={`lux-node-capsule ${activeMemberId === 'sp1' ? 'is-selected' : ''}`}
                onMouseEnter={() => setActiveMemberId('sp1')}
                onClick={() => setActiveMemberId('sp1')}
                tabIndex={0}
                role="button"
              >
                <div className="lux-avatar-ring ring-spouse">
                  <span className="lux-avatar-text">SF</span>
                </div>
                <div className="lux-node-meta">
                  <span className="lux-node-name">Sarah</span>
                  <span className="lux-node-sub">Spouse · 1998</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            Tier 4: Child (Leo)
            ------------------------------------------------------------- */}
        <div className="lux-tier-row tier-child">
          <div className="lux-tier-badge">Generation IV · Future Lineage</div>
          <div className="lux-nodes-cluster">
            <div
              className={`lux-node-capsule lux-node-child ${activeMemberId === 'c1' ? 'is-selected' : ''}`}
              onMouseEnter={() => setActiveMemberId('c1')}
              onClick={() => setActiveMemberId('c1')}
              tabIndex={0}
              role="button"
            >
              <div className="lux-avatar-ring ring-child">
                <span className="lux-avatar-text amber-text">LF</span>
              </div>
              <div className="lux-node-meta">
                <span className="lux-node-name">Leo</span>
                <span className="lux-node-sub">Next Gen · 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------
          Floating Luxury Member Dossier Pop-Up (Hover Card)
          --------------------------------------------------------------- */}
      <div className="lux-floating-dossier" role="status" aria-live="polite">
        <div className="dossier-inner">
          <div className="dossier-header">
            <div className={`dossier-seal ${activeMember.isUser ? 'seal-user' : ''}`}>
              <span>{activeMember.initials}</span>
            </div>
            <div className="dossier-title-box">
              <div className="dossier-name-row">
                <h4 className="dossier-name">{activeMember.name}</h4>
                <span className="dossier-status-pill">
                  <span className="dossier-dot"></span>
                  {activeMember.status}
                </span>
              </div>
              <span className="dossier-sub">{activeMember.relation} · {activeMember.generation}</span>
            </div>
          </div>

          <div className="dossier-metrics-row">
            <div className="dossier-stat">
              <span className="stat-label">Birth Record</span>
              <span className="stat-val">{activeMember.birthYear}</span>
            </div>
            <div className="dossier-stat">
              <span className="stat-label">Kinship Depth</span>
              <span className="stat-val">{activeMember.role}</span>
            </div>
            <div className="dossier-stat">
              <span className="stat-label">Privacy Shield</span>
              <span className="stat-val highlight-gold">Full Sealed</span>
            </div>
          </div>

          <p className="dossier-note">{activeMember.notes}</p>
        </div>
      </div>
    </div>
  );
};
