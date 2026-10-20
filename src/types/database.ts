export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LifeStatus = 'active' | 'deceased';
export type UserRole = 'member' | 'admin' | 'level2_admin';
export type RelationshipType = 'parent' | 'child' | 'spouse' | 'sibling';
export type ContactChannel = 'email' | 'phone' | 'secondary_email';

export interface Database {
  public: {
    Tables: {
      family_members: {
        Row: {
          id: string;
          name: string;
          father_name: string | null;
          mother_name: string | null;
          surname: string;
          father_member_id: string | null;
          mother_member_id: string | null;
          date_of_birth: string | null;
          life_status: LifeStatus;
          phone: string | null;
          primary_email: string | null;
          secondary_email: string | null;
          study_status: string | null;
          work_status: string | null;
          work_details: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          father_name?: string | null;
          mother_name?: string | null;
          surname: string;
          father_member_id?: string | null;
          mother_member_id?: string | null;
          date_of_birth?: string | null;
          life_status?: LifeStatus;
          phone?: string | null;
          primary_email?: string | null;
          secondary_email?: string | null;
          study_status?: string | null;
          work_status?: string | null;
          work_details?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          father_name?: string | null;
          mother_name?: string | null;
          surname?: string;
          father_member_id?: string | null;
          mother_member_id?: string | null;
          date_of_birth?: string | null;
          life_status?: LifeStatus;
          phone?: string | null;
          primary_email?: string | null;
          secondary_email?: string | null;
          study_status?: string | null;
          work_status?: string | null;
          work_details?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          id: string;
          auth_user_id: string;
          linked_member_id: string;
          role: UserRole;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          linked_member_id: string;
          role?: UserRole;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          linked_member_id?: string;
          role?: UserRole;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      relationships: {
        Row: {
          id: string;
          source_member_id: string;
          target_member_id: string;
          relationship_type: RelationshipType;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_member_id: string;
          target_member_id: string;
          relationship_type: RelationshipType;
          created_at?: string;
        };
        Update: {
          id?: string;
          source_member_id?: string;
          target_member_id?: string;
          relationship_type?: RelationshipType;
          created_at?: string;
        };
        Relationships: [];
      };
      profile_visibility: {
        Row: {
          id: string;
          member_id: string;
          show_phone: boolean;
          show_primary_email: boolean;
          show_secondary_email: boolean;
          show_study_status: boolean;
          show_work_status: boolean;
          show_work_details: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          show_phone?: boolean;
          show_primary_email?: boolean;
          show_secondary_email?: boolean;
          show_study_status?: boolean;
          show_work_status?: boolean;
          show_work_details?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          show_phone?: boolean;
          show_primary_email?: boolean;
          show_secondary_email?: boolean;
          show_study_status?: boolean;
          show_work_status?: boolean;
          show_work_details?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      verification_records: {
        Row: {
          id: string;
          contact_channel: ContactChannel;
          target_value: string;
          code_hash: string;
          attempts: number;
          is_used: boolean;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_channel: ContactChannel;
          target_value: string;
          code_hash: string;
          attempts?: number;
          is_used?: boolean;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact_channel?: ContactChannel;
          target_value?: string;
          code_hash?: string;
          attempts?: number;
          is_used?: boolean;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_contacts: {
        Row: {
          id: string;
          whatsapp_number: string;
          support_email: string;
          instructions: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          whatsapp_number: string;
          support_email: string;
          instructions?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          whatsapp_number?: string;
          support_email?: string;
          instructions?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
