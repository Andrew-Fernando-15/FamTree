/**
 * Domain-driven feature modules (Stage 2 Architecture):
 * - auth: Authentication & registration flows (Stages 6–8)
 * - dashboard: Main user landing view (Stage 12)
 * - familyTree: Interactive family tree canvas & graph rendering (Stages 13–14)
 * - member: Member pop-up cards and candidate matching (Stages 9, 10, 15)
 * - profile: Profile management & editable fields (Stage 16)
 * - admin: Level-2 admin management & tree integrity (Stage 17)
 */
export * from './auth';
export * from './dashboard';
export * from './familyTree';
export * from './member';
export * from './profile';
export * from './admin';
export * from './landing';

