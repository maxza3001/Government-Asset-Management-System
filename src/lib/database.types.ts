export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = 'super_admin' | 'asset_admin' | 'staff' | 'user' | 'auditor';
export type AssetStatus = 'normal' | 'repair' | 'broken' | 'lost' | 'sold';
export type BorrowStatus = 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue';
export type MaintenanceStatus = 'pending' | 'fixing' | 'completed' | 'cancelled';
export type MaintenanceUrgency = 'low' | 'medium' | 'high';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: ProfileRole;
          department: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: ProfileRole;
          department?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: ProfileRole;
          department?: string | null;
        };
      };
      assets: {
        Row: {
          id: string;
          asset_code: string;
          name: string;
          category: string;
          brand: string | null;
          model: string | null;
          serial_number: string | null;
          department: string;
          location: string | null;
          status: AssetStatus;
          purchase_date: string | null;
          price: number | null;
          images: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
      };
      borrows: {
        Row: {
          id: string;
          asset_id: string | null;
          user_id: string | null;
          borrow_date: string;
          return_date: string | null;
          expected_return_date: string | null;
          status: BorrowStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: never;
        Update: never;
      };
      maintenance: {
        Row: {
          id: string;
          asset_id: string | null;
          reporter_id: string | null;
          issue: string;
          urgency: MaintenanceUrgency;
          status: MaintenanceStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: never;
        Update: never;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string | null;
          record_id: string | null;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          action: string;
          table_name?: string | null;
          record_id?: string | null;
          details?: Json | null;
        };
        Update: never;
      };
      system_settings: {
        Row: {
          key: string;
          value: Json;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          value?: Json;
          updated_by?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
