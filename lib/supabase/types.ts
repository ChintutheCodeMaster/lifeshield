export type LeadRow = {
  id: string;
  session_id: string;
  motivation: string[] | null;
  who_to_protect: string[] | null;
  children_count: number | null;
  state: string | null;
  dob: string | null;
  sex_at_birth: string | null;
  tobacco: string | null;
  health_level: string | null;
  term_length: number | null;
  coverage_amount: number | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  consent_at: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
};

export type LeadInsert = Partial<LeadRow> & { session_id: string };

export type AdminUserRow = {
  user_id: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUserRow;
        Insert: { user_id: string };
        Update: Partial<AdminUserRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
