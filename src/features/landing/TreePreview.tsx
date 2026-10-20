import React, { useState } from 'react';

interface PreviewMember {
  id: string;
  name: string;
  role: string;
  birthYear: string;
  status: string;
  relation: string;
  isUser?: boolean;
}

const PREVIEW_MEMBERS: Record<string, PreviewMember> = {
  g1: {
    id: 'g1',
    name: 'Arthur Fernando',
    role: 'Grandparent',
    birthYear: '1945',
    status: 'Patriarch',
    relation: 'Grandfather',
  },
  g2: {
    id: 'g2',
    name: 'Beatrice Fernando',
    role: 'Grandparent',
    birthYear: '1948',
    status: 'Matriarch',
    relation: 'Grandmother',
  },
  p1: {
    id: 'p1',
    name: 'Charles Fernando',
    role: 'Parent',
    birthYear: '1970',
    status: 'Active',
    relation: 'Father',
  },
  u1: {
    id: 'u1',
    name: 'You (Andrew)',
    role: 'Member',
    birthYear: '1996',
    status: 'Verified Member',
    relation: 'You',
    isUser: true,
  },
  sp1: {
    id: 'sp1',
    name: 'Sarah Fernando',
    role: 'Spouse',
    birthYear: '1998',
    status: 'Active',
    relation: 'Spouse',
  },
  sib1: {
    id: 'sib1',
    name: 'Chloe Fernando',
    role: 'Sibling',
    birthYear: '2002',
    status: 'Active',
    relation: 'Sister',
  },
  c1: {
    id: 'c1',
    name: 'Leo Fernando',
    role: 'Child',
    birthYear: '2024',
    status: 'Active',
    relation: 'Child',
  },
};

export const TreePreview: React.FC = () => {
  const [hoveredMember, setHoveredMember] = useState<PreviewMember | null>(PREVIEW_MEMBERS.u1);

  return (
    <div className="tree-preview-wrapper" id="interactive-tree-preview">
      {/* Informative Hint / Legend */}
      <div className="preview-top-bar">
        <div className="preview-badge">
          <span className="pulse-dot"></span>
          <span>Interactive Preview · 7 Lineage Nodes</span>
        </div>
        <p className="preview-instruction">
          Hover or tap any family card to inspect member status and details.
        </p>
      </div>

      <div className="tree-preview-canvas">
        {/* Tier 1: Grandparents */}
        <div className="tree-tier tier-1">
          <span className="tier-label">Generation I · Grandparents</span>
          <div className="tier-nodes couple-row">
            <div
              className={`tree-card ${hoveredMember?.id === 'g1' ? 'active-card' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.g1)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.g1)}
              tabIndex={0}
              role="button"
              aria-label="Arthur Fernando Grandfather"
            >
              <div className="node-avatar">AF</div>
              <div className="node-info">
                <span className="node-name">Arthur</span>
                <span className="node-relation">Grandfather</span>
              </div>
            </div>

            <div className="spouse-bridge" title="Spouses">
              <span className="bridge-icon">💍</span>
            </div>

            <div
              className={`tree-card ${hoveredMember?.id === 'g2' ? 'active-card' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.g2)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.g2)}
              tabIndex={0}
              role="button"
              aria-label="Beatrice Fernando Grandmother"
            >
              <div className="node-avatar">BF</div>
              <div className="node-info">
                <span className="node-name">Beatrice</span>
                <span className="node-relation">Grandmother</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stem 1: Down to Parents */}
        <div className="tree-stem-vertical">
          <div className="stem-line"></div>
        </div>

        {/* Tier 2: Parents */}
        <div className="tree-tier tier-2">
          <span className="tier-label">Generation II · Parents</span>
          <div className="tier-nodes single-row">
            <div
              className={`tree-card ${hoveredMember?.id === 'p1' ? 'active-card' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.p1)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.p1)}
              tabIndex={0}
              role="button"
              aria-label="Charles Fernando Father"
            >
              <div className="node-avatar">CF</div>
              <div className="node-info">
                <span className="node-name">Charles</span>
                <span className="node-relation">Father</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stem 2: Branching Down to Siblings & You */}
        <div className="tree-stem-branch">
          <div className="stem-drop"></div>
          <div className="stem-crossbar"></div>
        </div>

        {/* Tier 3: You + Spouse + Sibling */}
        <div className="tree-tier tier-3">
          <span className="tier-label">Generation III · Your Generation</span>
          <div className="tier-nodes tier-3-nodes">
            {/* Sibling */}
            <div
              className={`tree-card ${hoveredMember?.id === 'sib1' ? 'active-card' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.sib1)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.sib1)}
              tabIndex={0}
              role="button"
              aria-label="Chloe Fernando Sister"
            >
              <div className="node-avatar">CF</div>
              <div className="node-info">
                <span className="node-name">Chloe</span>
                <span className="node-relation">Sister</span>
              </div>
            </div>

            {/* Union: You + Spouse */}
            <div className="union-wrapper">
              <div
                className={`tree-card card-user ${hoveredMember?.id === 'u1' ? 'active-card' : ''}`}
                onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.u1)}
                onClick={() => setHoveredMember(PREVIEW_MEMBERS.u1)}
                tabIndex={0}
                role="button"
                aria-label="You Andrew Verified Member"
              >
                <div className="node-avatar user-avatar">YOU</div>
                <div className="node-info">
                  <div className="node-name-group">
                    <span className="node-name">You (Andrew)</span>
                    <span className="you-pill">Verified</span>
                  </div>
                  <span className="node-relation">Member</span>
                </div>
              </div>

              <div className="spouse-bridge" title="Spouses">
                <span className="bridge-icon">💍</span>
              </div>

              <div
                className={`tree-card ${hoveredMember?.id === 'sp1' ? 'active-card' : ''}`}
                onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.sp1)}
                onClick={() => setHoveredMember(PREVIEW_MEMBERS.sp1)}
                tabIndex={0}
                role="button"
                aria-label="Sarah Fernando Spouse"
              >
                <div className="node-avatar">SF</div>
                <div className="node-info">
                  <span className="node-name">Sarah</span>
                  <span className="node-relation">Spouse</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stem 3: Down to Child */}
        <div className="tree-stem-vertical child-stem">
          <div className="stem-line"></div>
        </div>

        {/* Tier 4: Child */}
        <div className="tree-tier tier-4">
          <span className="tier-label">Generation IV · Next Generation</span>
          <div className="tier-nodes single-row">
            <div
              className={`tree-card card-child ${hoveredMember?.id === 'c1' ? 'active-card' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.c1)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.c1)}
              tabIndex={0}
              role="button"
              aria-label="Leo Fernando Child"
            >
              <div className="node-avatar child-avatar">LF</div>
              <div className="node-info">
                <span className="node-name">Leo</span>
                <span className="node-relation">Child</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Floating Hover Pop-up */}
        {hoveredMember && (
          <div className="preview-popup-card" role="tooltip">
            <div className="popup-header">
              <div className="popup-avatar">
                {hoveredMember.isUser ? 'YOU' : hoveredMember.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="popup-title-group">
                <div className="popup-name-row">
                  <h4 className="popup-name">{hoveredMember.name}</h4>
                  <span className="popup-status-badge">
                    <span className="status-indicator"></span>
                    {hoveredMember.status}
                  </span>
                </div>
                <span className="popup-relation">{hoveredMember.relation} · {hoveredMember.role}</span>
              </div>
            </div>

            <div className="popup-details-grid">
              <div className="popup-detail-item">
                <span className="detail-label">Birth Year</span>
                <span className="detail-value">{hoveredMember.birthYear}</span>
              </div>
              <div className="popup-detail-item">
                <span className="detail-label">Lineage State</span>
                <span className="detail-value">{hoveredMember.isUser ? 'Full Access' : 'Verified in Tree'}</span>
              </div>
            </div>

            <div className="popup-hint">
              <span>🔒 Private Lineage Card (Simulated Canvas View)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
