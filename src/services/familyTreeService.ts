import { supabase } from '../lib/supabase';
import type {
  FamilyMember,
  Relationship,
  TreeNode,
  TreeLink,
  FamilyTreeGraph,
  FamilyTreeBounds,
  ImmediateFamily,
} from '../features/familyTree/types';
import { DEFAULT_SEED_MEMBERS } from './familyMatchingService';

// Layout geometry constants (in pixels)
export const TREE_LAYOUT = {
  NODE_WIDTH: 220,
  NODE_HEIGHT: 110,
  HORIZONTAL_GAP: 60,
  SPOUSE_GAP: 40,
  LEVEL_HEIGHT: 180,
  PADDING: 120,
};

// Fallback relationships representing the 3-generation sample lineage
export const DEFAULT_SEED_RELATIONSHIPS: Relationship[] = [
  // Spouses: Arthur <-> Beatrice
  {
    id: 'r1000000-0000-0000-0000-000000000001',
    source_member_id: 'm1000000-0000-0000-0000-000000000001', // Arthur
    target_member_id: 'm1000000-0000-0000-0000-000000000002', // Beatrice
    relationship_type: 'spouse',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r1000000-0000-0000-0000-000000000002',
    source_member_id: 'm1000000-0000-0000-0000-000000000002', // Beatrice
    target_member_id: 'm1000000-0000-0000-0000-000000000001', // Arthur
    relationship_type: 'spouse',
    created_at: '2026-10-20T00:00:00Z',
  },

  // Spouses: Charles <-> Diana
  {
    id: 'r2000000-0000-0000-0000-000000000001',
    source_member_id: 'm2000000-0000-0000-0000-000000000001', // Charles
    target_member_id: 'm2000000-0000-0000-0000-000000000002', // Diana
    relationship_type: 'spouse',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r2000000-0000-0000-0000-000000000002',
    source_member_id: 'm2000000-0000-0000-0000-000000000002', // Diana
    target_member_id: 'm2000000-0000-0000-0000-000000000001', // Charles
    relationship_type: 'spouse',
    created_at: '2026-10-20T00:00:00Z',
  },

  // Parents: Arthur & Beatrice -> Charles
  {
    id: 'r2000000-0000-0000-0000-000000000003',
    source_member_id: 'm1000000-0000-0000-0000-000000000001', // Arthur
    target_member_id: 'm2000000-0000-0000-0000-000000000001', // Charles
    relationship_type: 'parent',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r2000000-0000-0000-0000-000000000004',
    source_member_id: 'm1000000-0000-0000-0000-000000000002', // Beatrice
    target_member_id: 'm2000000-0000-0000-0000-000000000001', // Charles
    relationship_type: 'parent',
    created_at: '2026-10-20T00:00:00Z',
  },

  // Parents: Charles & Diana -> Andrew, Aaron, Chloe
  {
    id: 'r3000000-0000-0000-0000-000000000001',
    source_member_id: 'm2000000-0000-0000-0000-000000000001', // Charles -> Andrew
    target_member_id: 'm3000000-0000-0000-0000-000000000003',
    relationship_type: 'parent',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r3000000-0000-0000-0000-000000000002',
    source_member_id: 'm2000000-0000-0000-0000-000000000001', // Charles -> Aaron
    target_member_id: 'm3000000-0000-0000-0000-000000000001',
    relationship_type: 'parent',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r3000000-0000-0000-0000-000000000003',
    source_member_id: 'm2000000-0000-0000-0000-000000000001', // Charles -> Chloe
    target_member_id: 'm3000000-0000-0000-0000-000000000002',
    relationship_type: 'parent',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r3000000-0000-0000-0000-000000000004',
    source_member_id: 'm2000000-0000-0000-0000-000000000002', // Diana -> Andrew
    target_member_id: 'm3000000-0000-0000-0000-000000000003',
    relationship_type: 'parent',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r3000000-0000-0000-0000-000000000005',
    source_member_id: 'm2000000-0000-0000-0000-000000000002', // Diana -> Aaron
    target_member_id: 'm3000000-0000-0000-0000-000000000001',
    relationship_type: 'parent',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r3000000-0000-0000-0000-000000000006',
    source_member_id: 'm2000000-0000-0000-0000-000000000002', // Diana -> Chloe
    target_member_id: 'm3000000-0000-0000-0000-000000000002',
    relationship_type: 'parent',
    created_at: '2026-10-20T00:00:00Z',
  },

  // Siblings: Andrew <-> Aaron, Andrew <-> Chloe, Aaron <-> Chloe
  {
    id: 'r3000000-0000-0000-0000-000000000007',
    source_member_id: 'm3000000-0000-0000-0000-000000000003', // Andrew <-> Aaron
    target_member_id: 'm3000000-0000-0000-0000-000000000001',
    relationship_type: 'sibling',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r3000000-0000-0000-0000-000000000008',
    source_member_id: 'm3000000-0000-0000-0000-000000000003', // Andrew <-> Chloe
    target_member_id: 'm3000000-0000-0000-0000-000000000002',
    relationship_type: 'sibling',
    created_at: '2026-10-20T00:00:00Z',
  },
  {
    id: 'r3000000-0000-0000-0000-000000000009',
    source_member_id: 'm3000000-0000-0000-0000-000000000001', // Aaron <-> Chloe
    target_member_id: 'm3000000-0000-0000-0000-000000000002',
    relationship_type: 'sibling',
    created_at: '2026-10-20T00:00:00Z',
  },
];

class FamilyTreeService {
  private cachedMembers: FamilyMember[] | null = null;
  private cachedRelationships: Relationship[] | null = null;
  private cachedGraph: FamilyTreeGraph | null = null;

  /**
   * Clears internal cache (e.g. after profile edits or admin modifications)
   */
  public clearCache(): void {
    this.cachedMembers = null;
    this.cachedRelationships = null;
    this.cachedGraph = null;
  }

  /**
   * Fetches all family members from Supabase, with resilient fallback to seed lineage.
   */
  public async fetchFamilyMembers(forceRefresh = false): Promise<FamilyMember[]> {
    if (!forceRefresh && this.cachedMembers && this.cachedMembers.length > 0) {
      return this.cachedMembers;
    }

    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .order('date_of_birth', { ascending: true });

      if (error || !data || data.length === 0) {
        console.info('[familyTreeService] Using seed lineage members fallback.');
        this.cachedMembers = DEFAULT_SEED_MEMBERS;
        return DEFAULT_SEED_MEMBERS;
      }

      this.cachedMembers = data;
      return data;
    } catch (err) {
      console.warn('[familyTreeService] Network error fetching family_members, falling back to seed:', err);
      this.cachedMembers = DEFAULT_SEED_MEMBERS;
      return DEFAULT_SEED_MEMBERS;
    }
  }

  /**
   * Fetches all explicit relationships from Supabase, with fallback to seed relationships.
   */
  public async fetchRelationships(forceRefresh = false): Promise<Relationship[]> {
    if (!forceRefresh && this.cachedRelationships && this.cachedRelationships.length > 0) {
      return this.cachedRelationships;
    }

    try {
      const { data, error } = await supabase.from('relationships').select('*');

      if (error || !data || data.length === 0) {
        console.info('[familyTreeService] Using seed lineage relationships fallback.');
        this.cachedRelationships = DEFAULT_SEED_RELATIONSHIPS;
        return DEFAULT_SEED_RELATIONSHIPS;
      }

      this.cachedRelationships = data;
      return data;
    } catch (err) {
      console.warn('[familyTreeService] Network error fetching relationships, falling back to seed:', err);
      this.cachedRelationships = DEFAULT_SEED_RELATIONSHIPS;
      return DEFAULT_SEED_RELATIONSHIPS;
    }
  }

  /**
   * Builds the complete layout graph with generation depths, visual (X, Y) coordinates,
   * and SVG link paths connecting couples and parent-child branches.
   */
  public async buildFamilyTreeGraph(forceRefresh = false): Promise<FamilyTreeGraph> {
    if (!forceRefresh && this.cachedGraph) {
      return this.cachedGraph;
    }

    const members = await this.fetchFamilyMembers(forceRefresh);
    const relationships = await this.fetchRelationships(forceRefresh);

    const memberMap = new Map<string, FamilyMember>();
    members.forEach((m) => memberMap.set(m.id, m));

    // 1. Build adjacency maps
    const parentsOf = new Map<string, Set<string>>();
    const childrenOf = new Map<string, Set<string>>();
    const spousesOf = new Map<string, Set<string>>();
    const siblingsOf = new Map<string, Set<string>>();

    members.forEach((m) => {
      parentsOf.set(m.id, new Set<string>());
      childrenOf.set(m.id, new Set<string>());
      spousesOf.set(m.id, new Set<string>());
      siblingsOf.set(m.id, new Set<string>());

      // Also register direct column parents if present
      if (m.father_member_id && memberMap.has(m.father_member_id)) {
        parentsOf.get(m.id)!.add(m.father_member_id);
      }
      if (m.mother_member_id && memberMap.has(m.mother_member_id)) {
        parentsOf.get(m.id)!.add(m.mother_member_id);
      }
    });

    relationships.forEach((rel) => {
      const s = rel.source_member_id;
      const t = rel.target_member_id;
      if (!memberMap.has(s) || !memberMap.has(t)) return;

      if (rel.relationship_type === 'parent') {
        childrenOf.get(s)?.add(t);
        parentsOf.get(t)?.add(s);
      } else if (rel.relationship_type === 'child') {
        parentsOf.get(s)?.add(t);
        childrenOf.get(t)?.add(s);
      } else if (rel.relationship_type === 'spouse') {
        spousesOf.get(s)?.add(t);
        spousesOf.get(t)?.add(s);
      } else if (rel.relationship_type === 'sibling') {
        siblingsOf.get(s)?.add(t);
        siblingsOf.get(t)?.add(s);
      }
    });

    // Cross-link children to parents from parent map
    parentsOf.forEach((pSet, childId) => {
      pSet.forEach((parentId) => {
        childrenOf.get(parentId)?.add(childId);
      });
    });

    // 2. Compute Generation Depth (1 = oldest roots, 2 = parents, 3 = children)
    const generationOf = new Map<string, number>();

    // Root members: no parents recorded in parentsOf
    const rootMembers = members.filter((m) => {
      const parents = parentsOf.get(m.id);
      return !parents || parents.size === 0;
    });

    // Sort roots by date_of_birth
    rootMembers.sort((a, b) => {
      const dobA = a.date_of_birth || '9999';
      const dobB = b.date_of_birth || '9999';
      return dobA.localeCompare(dobB);
    });

    // Assign generation 1 to roots
    rootMembers.forEach((r) => generationOf.set(r.id, 1));

    // Iteratively calculate descendants' generation
    let changed = true;
    let iteration = 0;
    while (changed && iteration < 20) {
      changed = false;
      iteration++;

      members.forEach((m) => {
        const parents = parentsOf.get(m.id);
        if (parents && parents.size > 0) {
          let maxParentGen = 0;
          parents.forEach((pId) => {
            const pGen = generationOf.get(pId);
            if (pGen && pGen > maxParentGen) maxParentGen = pGen;
          });

          if (maxParentGen > 0) {
            const targetGen = maxParentGen + 1;
            if (generationOf.get(m.id) !== targetGen) {
              generationOf.set(m.id, targetGen);
              changed = true;
            }
          }
        }

        // Align spouse generation
        const spouses = spousesOf.get(m.id);
        const myGen = generationOf.get(m.id);
        if (myGen && spouses) {
          spouses.forEach((spId) => {
            if (!generationOf.has(spId) || generationOf.get(spId) !== myGen) {
              generationOf.set(spId, myGen);
              changed = true;
            }
          });
        }
      });
    }

    // Default any remaining unassigned members
    members.forEach((m) => {
      if (!generationOf.has(m.id)) {
        generationOf.set(m.id, 2);
      }
    });

    // 3. Group members by Generation
    const genGroups = new Map<number, FamilyMember[]>();
    generationOf.forEach((gen, mId) => {
      if (!genGroups.has(gen)) genGroups.set(gen, []);
      const m = memberMap.get(mId);
      if (m) genGroups.get(gen)!.push(m);
    });

    const sortedGens = Array.from(genGroups.keys()).sort((a, b) => a - b);

    // 4. Hierarchical Layout Coordinate Calculation
    const { NODE_WIDTH, NODE_HEIGHT, HORIZONTAL_GAP, SPOUSE_GAP, LEVEL_HEIGHT, PADDING } = TREE_LAYOUT;
    const computedNodes: TreeNode[] = [];
    const nodesById: Record<string, TreeNode> = {};

    // Center axis for balanced canvas
    const CANVAS_CENTER_X = 700;

    sortedGens.forEach((gen) => {
      const genMembers = genGroups.get(gen) || [];
      const yPos = PADDING + (gen - 1) * LEVEL_HEIGHT;

      // Group genMembers into couples and individuals to place spouses adjacent
      const visitedInGen = new Set<string>();
      const units: Array<{ members: FamilyMember[]; isCouple: boolean }> = [];

      genMembers.forEach((m) => {
        if (visitedInGen.has(m.id)) return;

        const spouses = Array.from(spousesOf.get(m.id) || []).filter(
          (spId) => generationOf.get(spId) === gen && !visitedInGen.has(spId)
        );

        if (spouses.length > 0) {
          const spouseMember = memberMap.get(spouses[0])!;
          // Husband on left if male/older, or chronological
          units.push({ members: [m, spouseMember], isCouple: true });
          visitedInGen.add(m.id);
          visitedInGen.add(spouseMember.id);
        } else {
          units.push({ members: [m], isCouple: false });
          visitedInGen.add(m.id);
        }
      });

      // Calculate total width of this generation tier
      let totalTierWidth = 0;
      units.forEach((u, idx) => {
        if (u.isCouple) {
          totalTierWidth += NODE_WIDTH * 2 + SPOUSE_GAP;
        } else {
          totalTierWidth += NODE_WIDTH;
        }
        if (idx < units.length - 1) {
          totalTierWidth += HORIZONTAL_GAP;
        }
      });

      // Align units centered around CANVAS_CENTER_X
      let currentX = CANVAS_CENTER_X - totalTierWidth / 2;

      units.forEach((u) => {
        if (u.isCouple) {
          const m1 = u.members[0];
          const m2 = u.members[1];

          const x1 = currentX + NODE_WIDTH / 2;
          const x2 = currentX + NODE_WIDTH + SPOUSE_GAP + NODE_WIDTH / 2;

          const node1: TreeNode = {
            member: m1,
            generation: gen,
            x: x1,
            y: yPos,
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            parents: Array.from(parentsOf.get(m1.id) || []).map((id) => memberMap.get(id)!),
            spouses: [m2],
            children: Array.from(childrenOf.get(m1.id) || []).map((id) => memberMap.get(id)!),
            siblings: Array.from(siblingsOf.get(m1.id) || []).map((id) => memberMap.get(id)!),
          };

          const node2: TreeNode = {
            member: m2,
            generation: gen,
            x: x2,
            y: yPos,
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            parents: Array.from(parentsOf.get(m2.id) || []).map((id) => memberMap.get(id)!),
            spouses: [m1],
            children: Array.from(childrenOf.get(m2.id) || []).map((id) => memberMap.get(id)!),
            siblings: Array.from(siblingsOf.get(m2.id) || []).map((id) => memberMap.get(id)!),
          };

          computedNodes.push(node1, node2);
          nodesById[m1.id] = node1;
          nodesById[m2.id] = node2;

          currentX += NODE_WIDTH * 2 + SPOUSE_GAP + HORIZONTAL_GAP;
        } else {
          const m = u.members[0];
          const x = currentX + NODE_WIDTH / 2;

          const node: TreeNode = {
            member: m,
            generation: gen,
            x,
            y: yPos,
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            parents: Array.from(parentsOf.get(m.id) || []).map((id) => memberMap.get(id)!),
            spouses: Array.from(spousesOf.get(m.id) || []).map((id) => memberMap.get(id)!),
            children: Array.from(childrenOf.get(m.id) || []).map((id) => memberMap.get(id)!),
            siblings: Array.from(siblingsOf.get(m.id) || []).map((id) => memberMap.get(id)!),
          };

          computedNodes.push(node);
          nodesById[m.id] = node;

          currentX += NODE_WIDTH + HORIZONTAL_GAP;
        }
      });
    });

    // 5. Generate SVG Connector Links
    const links: TreeLink[] = [];
    const processedSpousePairs = new Set<string>();

    // A) Spouse Links
    computedNodes.forEach((node) => {
      node.spouses.forEach((sp) => {
        const spouseNode = nodesById[sp.id];
        if (!spouseNode) return;

        const pairKey = [node.member.id, sp.id].sort().join(':');
        if (processedSpousePairs.has(pairKey)) return;
        processedSpousePairs.add(pairKey);

        const leftNode = node.x < spouseNode.x ? node : spouseNode;
        const rightNode = node.x < spouseNode.x ? spouseNode : node;

        const startX = leftNode.x + leftNode.width / 2;
        const startY = leftNode.y;
        const endX = rightNode.x - rightNode.width / 2;
        const endY = rightNode.y;

        links.push({
          id: `link-spouse-${pairKey}`,
          type: 'spouse',
          sourceMemberId: leftNode.member.id,
          targetMemberId: rightNode.member.id,
          startX,
          startY,
          endX,
          endY,
          path: `M ${startX} ${startY} L ${endX} ${endY}`,
        });
      });
    });

    // B) Parent-Child Links (Orthogonal Elbow connectors)
    // To create clean lineage trees, children of married couples drop from the union midpoint
    const processedChildLinks = new Set<string>();

    computedNodes.forEach((node) => {
      // Find children
      node.children.forEach((childMember) => {
        const childNode = nodesById[childMember.id];
        if (!childNode) return;

        const linkKey = `${node.member.id}->${childMember.id}`;
        if (processedChildLinks.has(linkKey)) return;

        // Check if there is a coparent spouse
        const otherParent = node.spouses.find((sp) =>
          childNode.parents.some((p) => p.id === sp.id)
        );

        let originX = node.x;
        let originY = node.y + node.height / 2;

        if (otherParent && nodesById[otherParent.id]) {
          const spouseNode = nodesById[otherParent.id];
          originX = (node.x + spouseNode.x) / 2;
          originY = node.y; // Midpoint between the couple

          // Mark both parent keys as covered
          processedChildLinks.add(`${otherParent.id}->${childMember.id}`);
        }

        processedChildLinks.add(linkKey);

        const targetX = childNode.x;
        const targetY = childNode.y - childNode.height / 2;

        // Intermediate elbow bar halfway between tiers
        const midY = (originY + targetY) / 2;

        // SVG orthogonal path: down to midY, horizontally to targetX, then down to top of child card
        const path = `M ${originX} ${originY} V ${midY} H ${targetX} V ${targetY}`;

        links.push({
          id: `link-pc-${node.member.id}-${childMember.id}`,
          type: 'parent_child',
          sourceMemberId: node.member.id,
          targetMemberId: childMember.id,
          startX: originX,
          startY: originY,
          endX: targetX,
          endY: targetY,
          path,
        });
      });
    });

    // 6. Compute Total Canvas Bounds
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    computedNodes.forEach((node) => {
      const left = node.x - node.width / 2;
      const right = node.x + node.width / 2;
      const top = node.y - node.height / 2;
      const bottom = node.y + node.height / 2;

      if (left < minX) minX = left;
      if (right > maxX) maxX = right;
      if (top < minY) minY = top;
      if (bottom > maxY) maxY = bottom;
    });

    // Fallback bounds if empty
    if (computedNodes.length === 0) {
      minX = 0;
      maxX = 1000;
      minY = 0;
      maxY = 600;
    }

    const bounds: FamilyTreeBounds = {
      minX: minX - PADDING,
      maxX: maxX + PADDING,
      minY: minY - PADDING,
      maxY: maxY + PADDING,
      width: Math.max(1200, maxX - minX + PADDING * 2),
      height: Math.max(800, maxY - minY + PADDING * 2),
    };

    // 7. Group nodes by generation for fast rendering
    const generationNodes: Record<number, TreeNode[]> = {};
    sortedGens.forEach((gen) => {
      generationNodes[gen] = computedNodes.filter((n) => n.generation === gen);
    });

    const graph: FamilyTreeGraph = {
      nodes: computedNodes,
      nodesById,
      links,
      bounds,
      generations: sortedGens,
      generationNodes,
    };

    this.cachedGraph = graph;
    return graph;
  }

  /**
   * Resolves the immediate family of a member (FR-13 & FR-16):
   * Parents, spouse, siblings, and children.
   */
  public async getImmediateFamily(memberId: string): Promise<ImmediateFamily | null> {
    const graph = await this.buildFamilyTreeGraph();
    const treeNode = graph.nodesById[memberId];

    if (!treeNode) {
      // Try to find raw member
      const members = await this.fetchFamilyMembers();
      const raw = members.find((m) => m.id === memberId);
      if (!raw) return null;

      return {
        member: raw,
        parents: [],
        spouse: null,
        children: [],
        siblings: [],
      };
    }

    return {
      member: treeNode.member,
      parents: treeNode.parents,
      spouse: treeNode.spouses.length > 0 ? treeNode.spouses[0] : null,
      children: treeNode.children,
      siblings: treeNode.siblings,
    };
  }

  /**
   * Traverses upward to collect all direct ancestors (parents, grandparents, etc.)
   */
  public async getMemberAncestry(memberId: string): Promise<FamilyMember[]> {
    const graph = await this.buildFamilyTreeGraph();
    const visited = new Set<string>();
    const ancestors: FamilyMember[] = [];

    const queue: string[] = [memberId];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = graph.nodesById[currentId];
      if (!node) continue;

      node.parents.forEach((parent) => {
        if (!visited.has(parent.id)) {
          visited.add(parent.id);
          ancestors.push(parent);
          queue.push(parent.id);
        }
      });
    }

    return ancestors;
  }

  /**
   * Traverses downward to collect all direct descendants (children, grandchildren, etc.)
   */
  public async getMemberDescendants(memberId: string): Promise<FamilyMember[]> {
    const graph = await this.buildFamilyTreeGraph();
    const visited = new Set<string>();
    const descendants: FamilyMember[] = [];

    const queue: string[] = [memberId];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = graph.nodesById[currentId];
      if (!node) continue;

      node.children.forEach((child) => {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          descendants.push(child);
          queue.push(child.id);
        }
      });
    }

    return descendants;
  }

  /**
   * Calculates the canvas focus coordinate to center the viewport on a target member (FR-13).
   */
  public getMemberFocusCoordinates(
    memberId: string,
    graph: FamilyTreeGraph
  ): { x: number; y: number } | null {
    const node = graph.nodesById[memberId];
    if (!node) return null;
    return { x: node.x, y: node.y };
  }
}

export const familyTreeService = new FamilyTreeService();
