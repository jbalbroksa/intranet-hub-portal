
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      delegaciones: {
        Row: {
          id: string
          nombre: string
          direccion: string | null
          telefono: string | null
          email: string | null
          responsable: string | null
          ciudad: string | null
          codigo_postal: string | null
          pais: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          responsable?: string | null
          ciudad?: string | null
          codigo_postal?: string | null
          pais?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          responsable?: string | null
          ciudad?: string | null
          codigo_postal?: string | null
          pais?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      companias: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          logo_url: string | null
          sitio_web: string | null
          direccion: string | null
          telefono: string | null
          email: string | null
          categoria: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          logo_url?: string | null
          sitio_web?: string | null
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          categoria?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          logo_url?: string | null
          sitio_web?: string | null
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          categoria?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      categorias_companias: {
        Row: {
          id: string
          nombre: string
          slug: string
          created_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          created_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          created_at?: string | null
        }
      }
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          imagen_url: string | null
          categoria: string | null
          precio: number | null
          stock: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          imagen_url?: string | null
          categoria?: string | null
          precio?: number | null
          stock?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          imagen_url?: string | null
          categoria?: string | null
          precio?: number | null
          stock?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      categorias_productos: {
        Row: {
          id: string
          nombre: string
          slug: string
          created_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          slug: string
          created_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          slug?: string
          created_at?: string | null
        }
      }
      noticias: {
        Row: {
          id: string
          titulo: string
          contenido: string | null
          imagen_url: string | null
          autor: string | null
          fecha_publicacion: string | null
          es_destacada: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          titulo: string
          contenido?: string | null
          imagen_url?: string | null
          autor?: string | null
          fecha_publicacion?: string | null
          es_destacada?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          contenido?: string | null
          imagen_url?: string | null
          autor?: string | null
          fecha_publicacion?: string | null
          es_destacada?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      documentos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          archivo_url: string | null
          categoria: string | null
          fecha_subida: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          archivo_url?: string | null
          categoria?: string | null
          fecha_subida?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          archivo_url?: string | null
          categoria?: string | null
          fecha_subida?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          descripcion: string | null
          fecha_inicio: string
          fecha_fin: string
          ubicacion: string | null
          color: string | null
          todo_el_dia: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          fecha_inicio: string
          fecha_fin: string
          ubicacion?: string | null
          color?: string | null
          todo_el_dia?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string | null
          fecha_inicio?: string
          fecha_fin?: string
          ubicacion?: string | null
          color?: string | null
          todo_el_dia?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      notificaciones: {
        Row: {
          id: string
          titulo: string
          mensaje: string | null
          tipo: string | null
          es_leida: boolean | null
          fecha_creacion: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          titulo: string
          mensaje?: string | null
          tipo?: string | null
          es_leida?: boolean | null
          fecha_creacion?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          mensaje?: string | null
          tipo?: string | null
          es_leida?: boolean | null
          fecha_creacion?: string | null
          created_at?: string | null
        }
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
