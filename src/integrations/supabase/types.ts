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
      caracteristicas_productos: {
        Row: {
          created_at: string | null
          id: string
          nombre: string
          producto_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre: string
          producto_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre?: string
          producto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "caracteristicas_productos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_companias: {
        Row: {
          created_at: string | null
          id: string
          nombre: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre?: string
          slug?: string
        }
        Relationships: []
      }
      categorias_productos: {
        Row: {
          created_at: string | null
          es_subcategoria: boolean | null
          id: string
          nivel: number | null
          nombre: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          es_subcategoria?: boolean | null
          id?: string
          nivel?: number | null
          nombre: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          es_subcategoria?: boolean | null
          id?: string
          nivel?: number | null
          nombre?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_productos_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categorias_productos"
            referencedColumns: ["id"]
          },
        ]
      }
      companias: {
        Row: {
          categoria: string | null
          created_at: string | null
          descripcion: string | null
          direccion: string | null
          email: string | null
          id: string
          logo_url: string | null
          nombre: string
          sitio_web: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          nombre: string
          sitio_web?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          nombre?: string
          sitio_web?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      delegaciones: {
        Row: {
          ciudad: string | null
          codigo_postal: string | null
          created_at: string | null
          direccion: string | null
          email: string | null
          id: string
          nombre: string
          pais: string | null
          responsable: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          ciudad?: string | null
          codigo_postal?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre: string
          pais?: string | null
          responsable?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          ciudad?: string | null
          codigo_postal?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string
          pais?: string | null
          responsable?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      documentos: {
        Row: {
          archivo_url: string | null
          categoria: string | null
          created_at: string | null
          descripcion: string | null
          fecha_subida: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          archivo_url?: string | null
          categoria?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_subida?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          archivo_url?: string | null
          categoria?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_subida?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      eventos: {
        Row: {
          color: string | null
          created_at: string | null
          descripcion: string | null
          fecha_fin: string
          fecha_inicio: string
          id: string
          titulo: string
          todo_el_dia: boolean | null
          ubicacion: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_fin: string
          fecha_inicio: string
          id?: string
          titulo: string
          todo_el_dia?: boolean | null
          ubicacion?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          descripcion?: string | null
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          titulo?: string
          todo_el_dia?: boolean | null
          ubicacion?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      noticias: {
        Row: {
          autor: string | null
          contenido: string | null
          created_at: string | null
          es_destacada: boolean | null
          fecha_publicacion: string | null
          id: string
          imagen_url: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          autor?: string | null
          contenido?: string | null
          created_at?: string | null
          es_destacada?: boolean | null
          fecha_publicacion?: string | null
          id?: string
          imagen_url?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          autor?: string | null
          contenido?: string | null
          created_at?: string | null
          es_destacada?: boolean | null
          fecha_publicacion?: string | null
          id?: string
          imagen_url?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notificaciones: {
        Row: {
          created_at: string | null
          es_leida: boolean | null
          fecha_creacion: string | null
          id: string
          mensaje: string | null
          tipo: string | null
          titulo: string
        }
        Insert: {
          created_at?: string | null
          es_leida?: boolean | null
          fecha_creacion?: string | null
          id?: string
          mensaje?: string | null
          tipo?: string | null
          titulo: string
        }
        Update: {
          created_at?: string | null
          es_leida?: boolean | null
          fecha_creacion?: string | null
          id?: string
          mensaje?: string | null
          tipo?: string | null
          titulo?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          categoria: string | null
          created_at: string | null
          debilidades: string | null
          descripcion: string | null
          fortalezas: string | null
          id: string
          imagen_url: string | null
          nivel3_id: string | null
          nombre: string
          observaciones: string | null
          precio: number | null
          stock: number | null
          subcategoria_id: string | null
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          debilidades?: string | null
          descripcion?: string | null
          fortalezas?: string | null
          id?: string
          imagen_url?: string | null
          nivel3_id?: string | null
          nombre: string
          observaciones?: string | null
          precio?: number | null
          stock?: number | null
          subcategoria_id?: string | null
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          debilidades?: string | null
          descripcion?: string | null
          fortalezas?: string | null
          id?: string
          imagen_url?: string | null
          nivel3_id?: string | null
          nombre?: string
          observaciones?: string | null
          precio?: number | null
          stock?: number | null
          subcategoria_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_nivel3_id_fkey"
            columns: ["nivel3_id"]
            isOneToOne: false
            referencedRelation: "categorias_productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_subcategoria_id_fkey"
            columns: ["subcategoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos_companias: {
        Row: {
          compania_id: string
          created_at: string | null
          id: string
          producto_id: string
        }
        Insert: {
          compania_id: string
          created_at?: string | null
          id?: string
          producto_id: string
        }
        Update: {
          compania_id?: string
          created_at?: string | null
          id?: string
          producto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_companias_compania_id_fkey"
            columns: ["compania_id"]
            isOneToOne: false
            referencedRelation: "companias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_companias_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
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
