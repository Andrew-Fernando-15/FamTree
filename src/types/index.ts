/**
 * FamTree — Core Domain Type Definitions
 * Based on 00_FamTree_Master_Specification and Data Model specifications.
 */

export * from './database';

export interface FamilyMember {
  id: string;
  name: string;
  fatherName?: string;
  motherName?: string;
  surname: string;
  dateOfBirth?: string;
  lifeStatus: 'active' | 'deceased';
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
  role: 'member' | 'admin' | 'level2_admin';
  isVerified: boolean;
  createdAt?: string;
}
