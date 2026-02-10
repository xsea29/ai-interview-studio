export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      feature_change_audit: {
        Row: {
          change_type: string
          changed_by: string | null
          created_at: string
          feature_name: string
          id: string
          new_value: boolean | null
          old_value: boolean | null
          organization_id: string | null
        }
        Insert: {
          change_type?: string
          changed_by?: string | null
          created_at?: string
          feature_name: string
          id?: string
          new_value?: boolean | null
          old_value?: boolean | null
          organization_id?: string | null
        }
        Update: {
          change_type?: string
          changed_by?: string | null
          created_at?: string
          feature_name?: string
          id?: string
          new_value?: boolean | null
          old_value?: boolean | null
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_change_audit_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_invites: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          id: string
          organization_id: string
          status: string
          token: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          expires_at?: string
          id?: string
          organization_id: string
          status?: string
          token: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          organization_id?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_billing: {
        Row: {
          amount: number
          auto_renew: boolean | null
          billing_cycle: string
          created_at: string
          id: string
          next_billing_date: string | null
          organization_id: string
          plan: string
          recipient_email: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          auto_renew?: boolean | null
          billing_cycle?: string
          created_at?: string
          id?: string
          next_billing_date?: string | null
          organization_id: string
          plan: string
          recipient_email?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          auto_renew?: boolean | null
          billing_cycle?: string
          created_at?: string
          id?: string
          next_billing_date?: string | null
          organization_id?: string
          plan?: string
          recipient_email?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_billing_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_feature_overrides: {
        Row: {
          enabled: boolean
          feature_name: string
          id: string
          organization_id: string
          overridden_at: string | null
          overridden_by: string | null
        }
        Insert: {
          enabled: boolean
          feature_name: string
          id?: string
          organization_id: string
          overridden_at?: string | null
          overridden_by?: string | null
        }
        Update: {
          enabled?: boolean
          feature_name?: string
          id?: string
          organization_id?: string
          overridden_at?: string | null
          overridden_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_feature_overrides_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          consent_configured: boolean | null
          created_at: string
          data_residency: string | null
          domain: string | null
          gdpr_compliant: boolean | null
          id: string
          industry: string | null
          name: string
          owner_email: string | null
          plan: string
          retention_days: number | null
          size: string | null
          sso_enabled: boolean | null
          status: string
          updated_at: string
        }
        Insert: {
          consent_configured?: boolean | null
          created_at?: string
          data_residency?: string | null
          domain?: string | null
          gdpr_compliant?: boolean | null
          id?: string
          industry?: string | null
          name: string
          owner_email?: string | null
          plan?: string
          retention_days?: number | null
          size?: string | null
          sso_enabled?: boolean | null
          status?: string
          updated_at?: string
        }
        Update: {
          consent_configured?: boolean | null
          created_at?: string
          data_residency?: string | null
          domain?: string | null
          gdpr_compliant?: boolean | null
          id?: string
          industry?: string | null
          name?: string
          owner_email?: string | null
          plan?: string
          retention_days?: number | null
          size?: string | null
          sso_enabled?: boolean | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          organization: string | null
          organization_id: string | null
          preferences: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          organization?: string | null
          organization_id?: string | null
          preferences?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          organization?: string | null
          organization_id?: string | null
          preferences?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "platform_admin" | "client_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["platform_admin", "client_user"],
    },
  },
} as const
