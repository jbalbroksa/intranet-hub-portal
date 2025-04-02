
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete, useSupabaseUpload, getPublicUrl } from './useSupabaseQuery';
import { Documento } from '@/types/database';

export const useDocumentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  
  const {
    data: documentos = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Documento[]>(
    'documentos',
    ['documentos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'fecha_subida', ascending: false }
    }
  );

  const upload = useSupabaseUpload();
  const createDocumento = useSupabaseCreate<Documento>('documentos');
  const updateDocumento = useSupabaseUpdate<Documento>('documentos');
  const deleteDocumento = useSupabaseDelete('documentos');

  // Filtra los documentos según el término de búsqueda y la categoría
  const filteredDocumentos = documentos.filter(documento => {
    const matchesSearch = documento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (documento.descripcion && documento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || documento.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Función para subir un documento y guardar su metadata
  const subirDocumento = async (file: File, metadata: Omit<Documento, 'id' | 'archivo_url' | 'fecha_subida' | 'created_at' | 'updated_at'>) => {
    // Genera un nombre de archivo único
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `documentos/${fileName}`;

    // Sube el archivo
    const uploadedPath = await upload.mutateAsync({
      bucketName: 'documentos',
      filePath,
      file
    });

    // Obtén la URL pública
    const publicUrl = getPublicUrl('documentos', filePath);

    // Crear el registro del documento en la base de datos
    const documento: Partial<Documento> = {
      ...metadata,
      archivo_url: publicUrl,
      fecha_subida: new Date().toISOString()
    };

    await createDocumento.mutateAsync(documento);
  };

  return {
    documentos,
    filteredDocumentos,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    currentView,
    setCurrentView,
    subirDocumento,
    createDocumento,
    updateDocumento,
    deleteDocumento,
    upload,
    refetch,
  };
};
