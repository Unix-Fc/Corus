export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string;
          changes: Json | null;
          created_at: string;
          entity: string;
          entity_id: string;
          id: number;
          user_email: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          changes?: Json | null;
          created_at?: string;
          entity: string;
          entity_id: string;
          id?: number;
          user_email?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          changes?: Json | null;
          created_at?: string;
          entity?: string;
          entity_id?: string;
          id?: number;
          user_email?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      calc_parameters: {
        Row: {
          key: string;
          label: string;
          note: string | null;
          unit: string | null;
          updated_at: string;
          validated: boolean;
          value: number;
        };
        Insert: {
          key: string;
          label: string;
          note?: string | null;
          unit?: string | null;
          updated_at?: string;
          validated?: boolean;
          value?: number;
        };
        Update: {
          key?: string;
          label?: string;
          note?: string | null;
          unit?: string | null;
          updated_at?: string;
          validated?: boolean;
          value?: number;
        };
        Relationships: [];
      };
      catalog_items: {
        Row: {
          active: boolean;
          code: string | null;
          created_at: string;
          details: Json;
          id: string;
          kind: Database["public"]["Enums"]["catalog_kind"];
          name: string;
          unit: string | null;
          unit_cost: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          code?: string | null;
          created_at?: string;
          details?: Json;
          id?: string;
          kind: Database["public"]["Enums"]["catalog_kind"];
          name: string;
          unit?: string | null;
          unit_cost?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          code?: string | null;
          created_at?: string;
          details?: Json;
          id?: string;
          kind?: Database["public"]["Enums"]["catalog_kind"];
          name?: string;
          unit?: string | null;
          unit_cost?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          active: boolean;
          city: string | null;
          cnpj: string | null;
          contact: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          notes: string | null;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          city?: string | null;
          cnpj?: string | null;
          contact?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          city?: string | null;
          cnpj?: string | null;
          contact?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          access_enabled: boolean;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
        };
        Insert: {
          access_enabled?: boolean;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
        };
        Update: {
          access_enabled?: boolean;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      quotes: {
        Row: {
          adjustments: Json;
          client_id: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          lead_time_days: number | null;
          lead_time_manual: boolean;
          materials: Json;
          notes: string | null;
          number: number;
          operations: Json;
          part_code: string | null;
          part_name: string;
          project: string | null;
          quantity: number;
          services: Json;
          specs: Json;
          status: Database["public"]["Enums"]["quote_status"];
          total: number;
          updated_at: string;
        };
        Insert: {
          adjustments?: Json;
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          lead_time_days?: number | null;
          lead_time_manual?: boolean;
          materials?: Json;
          notes?: string | null;
          number?: number;
          operations?: Json;
          part_code?: string | null;
          part_name: string;
          project?: string | null;
          quantity?: number;
          services?: Json;
          specs?: Json;
          status?: Database["public"]["Enums"]["quote_status"];
          total?: number;
          updated_at?: string;
        };
        Update: {
          adjustments?: Json;
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          lead_time_days?: number | null;
          lead_time_manual?: boolean;
          materials?: Json;
          notes?: string | null;
          number?: number;
          operations?: Json;
          part_code?: string | null;
          part_name?: string;
          project?: string | null;
          quantity?: number;
          services?: Json;
          specs?: Json;
          status?: Database["public"]["Enums"]["quote_status"];
          total?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_any_role: { Args: { _user_id: string }; Returns: boolean };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      set_user_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "admin" | "orcamentista" | "gerente";
      catalog_kind: "material" | "maquina" | "ferramenta" | "cargo" | "servico";
      quote_status:
        "rascunho" | "pendente" | "em_negociacao" | "aprovado" | "reprovado";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "orcamentista", "gerente"],
      catalog_kind: ["material", "maquina", "ferramenta", "cargo", "servico"],
      quote_status: [
        "rascunho",
        "pendente",
        "em_negociacao",
        "aprovado",
        "reprovado",
      ],
    },
  },
} as const;
