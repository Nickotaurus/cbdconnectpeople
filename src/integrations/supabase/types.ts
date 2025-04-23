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
      boutiques_physiques: {
        Row: {
          adresse: string | null
          coord_lat: number | null
          coord_lng: number | null
          date_maj_google: string | null
          google_place_id: string | null
          id: string
          nb_avis_google: number | null
          nom: string | null
          note_google: number | null
          photos: Json | null
        }
        Insert: {
          adresse?: string | null
          coord_lat?: number | null
          coord_lng?: number | null
          date_maj_google?: string | null
          google_place_id?: string | null
          id?: string
          nb_avis_google?: number | null
          nom?: string | null
          note_google?: number | null
          photos?: Json | null
        }
        Update: {
          adresse?: string | null
          coord_lat?: number | null
          coord_lng?: number | null
          date_maj_google?: string | null
          google_place_id?: string | null
          id?: string
          nb_avis_google?: number | null
          nom?: string | null
          note_google?: number | null
          photos?: Json | null
        }
        Relationships: []
      }
      cbd_shops: {
        Row: {
          address: string | null
          city: string | null
          id: number
          lat: number | null
          lng: number | null
          name: string
          source: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          name: string
          source?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          name?: string
          source?: string | null
        }
        Relationships: []
      }
      classified_images: {
        Row: {
          classified_id: string
          created_at: string
          id: string
          name: string
          url: string
        }
        Insert: {
          classified_id: string
          created_at?: string
          id?: string
          name: string
          url: string
        }
        Update: {
          classified_id?: string
          created_at?: string
          id?: string
          name?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "classified_images_classified_id_fkey"
            columns: ["classified_id"]
            isOneToOne: false
            referencedRelation: "classifieds"
            referencedColumns: ["id"]
          },
        ]
      }
      classifieds: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          id: string
          is_premium: boolean
          location: string
          price: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          date?: string
          description: string
          id?: string
          is_premium?: boolean
          location: string
          price?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_premium?: boolean
          location?: string
          price?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      google_reviews: {
        Row: {
          created_at: string | null
          id: number
          rating: number | null
          review_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          rating?: number | null
          review_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          rating?: number | null
          review_text?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          certifications: string[] | null
          created_at: string
          email: string | null
          favorite_products: string[] | null
          favorites: string[] | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          name: string | null
          partner_category: string | null
          partner_favorites: string[] | null
          partner_id: string | null
          rewards: number | null
          role: string | null
          siret_verified: boolean | null
          store_id: string | null
          store_type: string | null
          tickets: number | null
          updated_at: string
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string
          email?: string | null
          favorite_products?: string[] | null
          favorites?: string[] | null
          id: string
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string | null
          partner_category?: string | null
          partner_favorites?: string[] | null
          partner_id?: string | null
          rewards?: number | null
          role?: string | null
          siret_verified?: boolean | null
          store_id?: string | null
          store_type?: string | null
          tickets?: number | null
          updated_at?: string
        }
        Update: {
          certifications?: string[] | null
          created_at?: string
          email?: string | null
          favorite_products?: string[] | null
          favorites?: string[] | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string | null
          partner_category?: string | null
          partner_favorites?: string[] | null
          partner_id?: string | null
          rewards?: number | null
          role?: string | null
          siret_verified?: boolean | null
          store_id?: string | null
          store_type?: string | null
          tickets?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string
          city: string
          claimed_by: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          latitude: number
          logo_url: string | null
          longitude: number
          name: string
          phone: string | null
          photo_url: string | null
          postal_code: string
          registration_date: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          address: string
          city: string
          claimed_by?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          latitude: number
          logo_url?: string | null
          longitude: number
          name: string
          phone?: string | null
          photo_url?: string | null
          postal_code: string
          registration_date?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          claimed_by?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number
          logo_url?: string | null
          longitude?: number
          name?: string
          phone?: string | null
          photo_url?: string | null
          postal_code?: string
          registration_date?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      pending_partners: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          email: string | null
          favorite_products: string[] | null
          favorites: string[] | null
          id: string | null
          is_verified: boolean | null
          logo_url: string | null
          name: string | null
          partner_category: string | null
          partner_favorites: string[] | null
          partner_id: string | null
          rewards: number | null
          role: string | null
          siret_verified: boolean | null
          store_id: string | null
          store_type: string | null
          tickets: number | null
          updated_at: string | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          email?: string | null
          favorite_products?: string[] | null
          favorites?: string[] | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string | null
          partner_category?: string | null
          partner_favorites?: string[] | null
          partner_id?: string | null
          rewards?: number | null
          role?: string | null
          siret_verified?: boolean | null
          store_id?: string | null
          store_type?: string | null
          tickets?: number | null
          updated_at?: string | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          email?: string | null
          favorite_products?: string[] | null
          favorites?: string[] | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string | null
          partner_category?: string | null
          partner_favorites?: string[] | null
          partner_id?: string | null
          rewards?: number | null
          role?: string | null
          siret_verified?: boolean | null
          store_id?: string | null
          store_type?: string | null
          tickets?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_partner: {
        Args: { partner_profile_id: string }
        Returns: undefined
      }
      get_google_reviews: {
        Args: { user_uuid: string }
        Returns: {
          id: number
          review_text: string
          rating: number
          created_at: string
        }[]
      }
    }
    Enums: {
      partner_category_type:
        | "bank"
        | "accountant"
        | "legal"
        | "insurance"
        | "logistics"
        | "breeder"
        | "label"
        | "association"
        | "media"
        | "laboratory"
        | "production"
        | "realEstate"
        | "other"
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
    Enums: {
      partner_category_type: [
        "bank",
        "accountant",
        "legal",
        "insurance",
        "logistics",
        "breeder",
        "label",
        "association",
        "media",
        "laboratory",
        "production",
        "realEstate",
        "other",
      ],
    },
  },
} as const
