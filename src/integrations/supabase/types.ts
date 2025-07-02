export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      disponibilita: {
        Row: {
          attiva: boolean | null
          created_at: string | null
          data: string
          descrizione: string | null
          id: string
          ora_fine: string
          ora_inizio: string
          user_id: string
        }
        Insert: {
          attiva?: boolean | null
          created_at?: string | null
          data: string
          descrizione?: string | null
          id?: string
          ora_fine: string
          ora_inizio: string
          user_id: string
        }
        Update: {
          attiva?: boolean | null
          created_at?: string | null
          data?: string
          descrizione?: string | null
          id?: string
          ora_fine?: string
          ora_inizio?: string
          user_id?: string
        }
        Relationships: []
      }
      eventi: {
        Row: {
          created_at: string | null
          data: string
          descrizione: string | null
          id: string
          luogo: string
          ora_fine: string
          ora_inizio: string
          organizzatore_id: string
          stato: string | null
          strumenti_richiesti: Json | null
          tipo_evento: string
          tipo_organico: string | null
          titolo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          descrizione?: string | null
          id?: string
          luogo: string
          ora_fine: string
          ora_inizio: string
          organizzatore_id: string
          stato?: string | null
          strumenti_richiesti?: Json | null
          tipo_evento: string
          tipo_organico?: string | null
          titolo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          descrizione?: string | null
          id?: string
          luogo?: string
          ora_fine?: string
          ora_inizio?: string
          organizzatore_id?: string
          stato?: string | null
          strumenti_richiesti?: Json | null
          tipo_evento?: string
          tipo_organico?: string | null
          titolo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          citta: string | null
          cognome: string
          created_at: string | null
          data_registrazione: string | null
          email: string
          foto_profile: string | null
          id: string
          impostazioni_privacy: Json | null
          nome: string
          nome_arte: string | null
          raggio_attivita: number | null
          social_media: Json | null
          strumenti: Json | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          citta?: string | null
          cognome: string
          created_at?: string | null
          data_registrazione?: string | null
          email: string
          foto_profile?: string | null
          id: string
          impostazioni_privacy?: Json | null
          nome: string
          nome_arte?: string | null
          raggio_attivita?: number | null
          social_media?: Json | null
          strumenti?: Json | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          citta?: string | null
          cognome?: string
          created_at?: string | null
          data_registrazione?: string | null
          email?: string
          foto_profile?: string | null
          id?: string
          impostazioni_privacy?: Json | null
          nome?: string
          nome_arte?: string | null
          raggio_attivita?: number | null
          social_media?: Json | null
          strumenti?: Json | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
