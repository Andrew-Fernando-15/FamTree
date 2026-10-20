import type { Database } from '../../types/database';

export type FamilyMember = Database['public']['Tables']['family_members']['Row'];
export type Relationship = Database['public']['Tables']['relationships']['Row'];
export type AdminContact = Database['public']['Tables']['admin_contacts']['Row'];

export type FamilyMatchOutcome = 'single_match' | 'multiple_matches' | 'no_match' | 'already_linked';

export interface FamilyMatchResult {
  outcome: FamilyMatchOutcome;
  candidate?: FamilyMember;
  candidates?: FamilyMember[];
  errorMessage?: string;
}

/**
 * Family Tree Visualization & Graph Data Types (Stage 13 & 14)
 */

export type TreeLinkType = 'parent_child' | 'spouse' | 'parent_union';

export interface TreeLink {
  id: string;
  type: TreeLinkType;
  sourceMemberId: string;
  targetMemberId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  path: string; // SVG path string
}

export interface TreeNode {
  member: FamilyMember;
  generation: number; // 1 = oldest ancestors, 2 = parents, 3 = children
  x: number;          // center X coordinate in canvas space
  y: number;          // center Y coordinate in canvas space
  width: number;
  height: number;
  parents: FamilyMember[];
  spouses: FamilyMember[];
  children: FamilyMember[];
  siblings: FamilyMember[];
}

export interface FamilyTreeBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

export interface FamilyTreeGraph {
  nodes: TreeNode[];
  nodesById: Record<string, TreeNode>;
  links: TreeLink[];
  bounds: FamilyTreeBounds;
  generations: number[];
  generationNodes: Record<number, TreeNode[]>;
}

export interface ImmediateFamily {
  member: FamilyMember;
  parents: FamilyMember[];
  spouse: FamilyMember | null;
  children: FamilyMember[];
  siblings: FamilyMember[];
}
