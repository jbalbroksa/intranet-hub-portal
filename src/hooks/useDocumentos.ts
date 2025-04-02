
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Documento } from '@/types/database';

export const useDocumentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: documentos = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Documento>(
    'documentos',
    ['documentos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const createDocumento = useSupabaseCreate<Documento>('documentos');
  const updateDocumento = useSupabaseUpdate<Documento>('documentos');
  const deleteDocumento = useSupabaseDelete('documentos');

  // Filtra los documentos según el término de búsqueda
  const filteredDocumentos = documentos.filter(documento =>
    documento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (documento.descripcion && documento.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (documento.categoria && documento.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    documentos,
    filteredDocumentos,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createDocumento,
    updateDocumento,
    deleteDocumento,
    refetch,
  };
};
