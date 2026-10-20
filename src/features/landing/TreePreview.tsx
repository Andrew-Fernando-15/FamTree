import React, { useState } from 'react';

interface PreviewMember {
  id: string;
  name: string;
  relation: string;
  birthYear: string;
  status: string;
  generation: string;
  isUser?: boolean;
}

const PREVIEW_MEMBERS: Record<string, PreviewMember> = {
  g1: {
    id: 'g1',
    name: 'Arthur Fernando',
    relation: 'Grandfather',
    birthYear: '1945',
    status: 'Active',
    generation: 'Gen 1',
  },
  g2: {
    id: 'g2',
    name: 'Beatrice Fernando',
    relation: 'Grandmother',
    birthYear: '1948',
    status: 'Active',
    generation: 'Gen 1',
  },
  p1: {
    id: 'p1',
    name: 'Charles Fernando',
    relation: 'Father',
    birthYear: '1970',
    status: 'Active',
    generation: 'Gen 2',
  },
  u1: {
    id: 'u1',
    name: 'Andrew Fernando',
    relation: 'You',
    birthYear: '1996',
    status: 'Verified',
    generation: 'Gen 3',
    isUser: true,
  },
  sp1: {
    id: 'sp1',
    name: 'Sarah Fernando',
    relation: 'Spouse',
    birthYear: '1998',
    status: 'Active',
    generation: 'Gen 3',
  },
  sib1: {
    id: 'sib1',
    name: 'Chloe Fernando',
    relation: 'Sister',
    birthYear: '2002',
    status: 'Active',
    generation: 'Gen 3',
  },
  c1: {
    id: 'c1',
    name: 'Leo Fernando',
    relation: 'Child',
    birthYear: '2024',
    status: 'Active',
    generation: 'Gen 4',
  },
};

export const TreePreview: React.FC = () => {
  const [hoveredMember, setHoveredMember] = useState<PreviewMember | null>(PREVIEW_MEMBERS.u1);

  return (
    <div className="preview-canvas-box" id="interactive-tree-preview">
      {/* Top micro-bar */}
      <div className="canvas-header-bar">
        <div className="canvas-status-tag">
          <span className="status-dot"></span>
          <span>Sample Family Tree</span>
        </div>
        <span className="canvas-hint">Hover over any card to view details</span>
      </div>

      <div className="tree-diagram-container">
        {/* Tier 1: Grandparents */}
        <div className="tree-level">
          <span className="level-caption">Grandparents</span>
          <div className="level-row couple-unit">
            <div
              className={`member-node ${hoveredMember?.id === 'g1' ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.g1)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.g1)}
              tabIndex={0}
              role="button"
            >
              <div className="node-initials">AF</div>
              <div className="node-text">
                <span className="node-name">Arthur</span>
                <span className="node-role">Grandfather</span>
              </div>
            </div>

            <div className="spouse-link" title="Spouses">
              <span className="link-dash"></span>
            </div>

            <div
              className={`member-node ${hoveredMember?.id === 'g2' ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.g2)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.g2)}
              tabIndex={0}
              role="button"
            >
              <div className="node-initials">BF</div>
              <div className="node-text">
                <span className="node-name">Beatrice</span>
                <span className="node-role">Grandmother</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical connector down to Parents */}
        <div className="connector-vertical"></div>

        {/* Tier 2: Parents */}
        <div className="tree-level">
          <span className="level-caption">Parents</span>
          <div className="level-row">
            <div
              className={`member-node ${hoveredMember?.id === 'p1' ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.p1)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.p1)}
              tabIndex={0}
              role="button"
            >
              <div className="node-initials">CF</div>
              <div className="node-text">
                <span className="node-name">Charles</span>
                <span className="node-role">Father</span>
              </div>
            </div>
          </div>
        </div>

        {/* Connector branch down to Siblings & You */}
        <div className="connector-branch">
          <div className="branch-stem"></div>
          <div className="branch-bar"></div>
        </div>

        {/* Tier 3: You + Spouse + Sibling */}
        <div className="tree-level">
          <span className="level-caption">Your Generation</span>
          <div className="level-row tier-3-split">
            {/* Sibling */}
            <div
              className={`member-node ${hoveredMember?.id === 'sib1' ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.sib1)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.sib1)}
              tabIndex={0}
              role="button"
            >
              <div className="node-initials">CF</div>
              <div className="node-text">
                <span className="node-name">Chloe</span>
                <span className="node-role">Sister</span>
              </div>
            </div>

            {/* You + Spouse */}
            <div className="couple-unit">
              <div
                className={`member-node node-user ${hoveredMember?.id === 'u1' ? 'is-active' : ''}`}
                onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.u1)}
                onClick={() => setHoveredMember(PREVIEW_MEMBERS.u1)}
                tabIndex={0}
                role="button"
              >
                <div className="node-initials user-initials">You</div>
                <div className="node-text">
                  <div className="name-with-badge">
                    <span className="node-name">Andrew</span>
                    <span className="you-tag">You</span>
                  </div>
                  <span className="node-role">Verified</span>
                </div>
              </div>

              <div className="spouse-link" title="Spouses">
                <span className="link-dash"></span>
              </div>

              <div
                className={`member-node ${hoveredMember?.id === 'sp1' ? 'is-active' : ''}`}
                onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.sp1)}
                onClick={() => setHoveredMember(PREVIEW_MEMBERS.sp1)}
                tabIndex={0}
                role="button"
              >
                <div className="node-initials">SF</div>
                <div className="node-text">
                  <span className="node-name">Sarah</span>
                  <span className="node-role">Spouse</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector down to Child */}
        <div className="connector-vertical child-conn"></div>

        {/* Tier 4: Child */}
        <div className="tree-level">
          <span className="level-caption">Children</span>
          <div className="level-row">
            <div
              className={`member-node ${hoveredMember?.id === 'c1' ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredMember(PREVIEW_MEMBERS.c1)}
              onClick={() => setHoveredMember(PREVIEW_MEMBERS.c1)}
              tabIndex={0}
              role="button"
            >
              <div className="node-initials child-initials">LF</div>
              <div className="node-text">
                <span className="node-name">Leo</span>
                <span className="node-role">Child</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean, Understated Hover Pop-up Card */}
        {hoveredMember && (
          <div className="clean-member-popup" role="status">
            <div className="popup-top">
              <div>
                <h4 className="popup-fullname">{hoveredMember.name}</h4>
                <span className="popup-relation-line">{hoveredMember.relation} · {hoveredMember.generation}</span>
              </div>
              <span className="popup-badge">
                <span className="green-dot"></span>
                {hoveredMember.status}
              </span>
            </div>

            <div className="popup-grid">
              <div className="popup-meta-field">
                <span className="meta-label">Born</span>
                <span className="meta-value">{hoveredMember.birthYear}</span>
              </div>
              <div className="popup-meta-field">
                <span className="meta-label">Visibility</span>
                <span className="meta-value">Family Only</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
