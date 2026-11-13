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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      best_practices: {
        Row: {
          author_initials: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          title: string
        }
        Insert: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          title: string
        }
        Update: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          author_initials: string | null
          cover_path: string | null
          created_at: string
          created_by: string | null
          id: string
          theme: string | null
          title: string
          why: string
        }
        Insert: {
          author_initials?: string | null
          cover_path?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          theme?: string | null
          title: string
          why: string
        }
        Update: {
          author_initials?: string | null
          cover_path?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          theme?: string | null
          title?: string
          why?: string
        }
        Relationships: []
      }
      company_contacts: {
        Row: {
          company_id: string
          created_at: string
          full_name: string | null
          id: string
          initials: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          full_name?: string | null
          id?: string
          initials?: string | null
          user_id?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          full_name?: string | null
          id?: string
          initials?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "target_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      engineering_resources: {
        Row: {
          author_initials: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          topic: string
          url: string
          why: string
        }
        Insert: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          topic: string
          url: string
          why: string
        }
        Update: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          topic?: string
          url?: string
          why?: string
        }
        Relationships: []
      }
      engineering_tips: {
        Row: {
          author_initials: string | null
          created_at: string
          created_by: string | null
          id: string
          tip: string
          topic: string
        }
        Insert: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          tip: string
          topic: string
        }
        Update: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          tip?: string
          topic?: string
        }
        Relationships: []
      }
      invite_settings: {
        Row: {
          code: string
          id: number
          updated_at: string
        }
        Insert: {
          code: string
          id?: number
          updated_at?: string
        }
        Update: {
          code?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_tools: {
        Row: {
          author_initials: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          title: string
          url: string | null
        }
        Insert: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          title: string
          url?: string | null
        }
        Update: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          joined_at: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          user_id: string
        }
        Update: {
          joined_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          author_initials: string | null
          booking_url: string
          created_at: string
          created_by: string | null
          id: string
          linkedin_url: string | null
          name: string
          role: string
          topics: string[]
        }
        Insert: {
          author_initials?: string | null
          booking_url?: string
          created_at?: string
          created_by?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          role: string
          topics?: string[]
        }
        Update: {
          author_initials?: string | null
          booking_url?: string
          created_at?: string
          created_by?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          role?: string
          topics?: string[]
        }
        Relationships: []
      }
      prompts: {
        Row: {
          author_initials: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          prompt: string
          title: string
        }
        Insert: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          prompt: string
          title: string
        }
        Update: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          prompt?: string
          title?: string
        }
        Relationships: []
      }
      target_companies: {
        Row: {
          author_initials: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          note: string | null
          url: string | null
        }
        Insert: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          note?: string | null
          url?: string | null
        }
        Update: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          note?: string | null
          url?: string | null
        }
        Relationships: []
      }
      topics: {
        Row: {
          author_initials: string | null
          created_at: string
          created_by: string | null
          id: string
          title: string
          votes: number
        }
        Insert: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
          votes?: number
        }
        Update: {
          author_initials?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
          votes?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      admin_get_invite_code: { Args: never; Returns: string }
      admin_list_members: {
        Args: never
        Returns: {
          email: string
          full_name: string
          joined_at: string
          user_id: string
        }[]
      }
      admin_remove_member: { Args: { _user_id: string }; Returns: undefined }
      admin_rotate_invite_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_member: { Args: { _user_id: string }; Returns: boolean }
      redeem_invite: { Args: { _code: string }; Returns: boolean }
      upvote_topic: { Args: { _id: string }; Returns: number }
    }
    Enums: {
      app_role: "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
    },
  },
} as const
