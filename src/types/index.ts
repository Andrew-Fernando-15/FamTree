/**
 * FamTree — Core Domain Type Definitions (Stage 1 Baseline)
 * Based on 00_FamTree_Master_Specification and Data Model specifications.
 * These types serve as foundational contracts for subsequent stages.
 */

export type LifeStatus = 'active' | 'deceased';

export type UserRole = 'member' | 'admin';

export type RelationshipType = 
  | 'father'
  | 'mother'
  | 'spouse'
  | 'son'
  | 'daughter'
  | 'brother'
  | 'sister';

export interface FamilyMember {
  id: string;
  name: string;
  fatherName?: string;
  motherName?: string;
  surname: string;
  dateOfBirth?: string;
  lifeStatus: LifeStatus;
  primaryEmail?: string;
  secondaryEmail?: string;
  phone?: string;
  studyStatus?: string;
  workStatus?: string;
  workDetails?: string;
  profileVisibility?: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAccount {
  id: string;
  authUserId: string;
  linkedMemberId: string;
  role: UserRole;
  isVerified: boolean;
  createdAt?: string;
}
