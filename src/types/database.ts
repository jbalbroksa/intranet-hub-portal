
// Tipos para las tablas de la base de datos

export type Delegacion = {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  responsable?: string;
  ciudad?: string;
  codigo_postal?: string;
  pais?: string;
  created_at: string;
  updated_at: string;
};

export type Compania = {
  id: string;
  nombre: string;
  descripcion?: string;
  logo_url?: string;
  sitio_web?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  categoria?: string;
  created_at: string;
  updated_at: string;
};

export type CategoriaCompania = {
  id: string;
  nombre: string;
  slug: string;
  created_at: string;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  categoria?: string;
  precio?: number;
  stock?: number;
  created_at: string;
  updated_at: string;
};

export type CategoriaProducto = {
  id: string;
  nombre: string;
  slug: string;
  created_at: string;
};

export type Noticia = {
  id: string;
  titulo: string;
  contenido?: string;
  imagen_url?: string;
  autor?: string;
  fecha_publicacion: string;
  es_destacada: boolean;
  compania_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type Documento = {
  id: string;
  nombre: string;
  descripcion?: string;
  archivo_url?: string;
  categoria?: string;
  fecha_subida: string;
  created_at: string;
  updated_at: string;
};

export type Evento = {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion?: string;
  color?: string;
  todo_el_dia: boolean;
  created_at: string;
  updated_at: string;
};

export type Notificacion = {
  id: string;
  titulo: string;
  mensaje?: string;
  tipo?: string;
  es_leida: boolean;
  fecha_creacion: string;
  created_at: string;
};

// Tipos para los formularios
export type DelegacionFormData = Omit<Delegacion, 'id' | 'created_at' | 'updated_at'>;
export type CompaniaFormData = Omit<Compania, 'id' | 'created_at' | 'updated_at'>;
export type ProductoFormData = Omit<Producto, 'id' | 'created_at' | 'updated_at'>;
export type NoticiaFormData = Omit<Noticia, 'id' | 'created_at' | 'updated_at'>;
export type DocumentoFormData = Omit<Documento, 'id' | 'created_at' | 'updated_at'>;
export type EventoFormData = Omit<Evento, 'id' | 'created_at' | 'updated_at'>;
