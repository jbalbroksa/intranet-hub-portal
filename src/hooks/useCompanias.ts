
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Compania } from '@/types/database';

export const useCompanias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: companias = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Compania>(
    'companias',
    ['companias'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const createCompania = useSupabaseCreate<Compania>('companias');
  const updateCompania = useSupabaseUpdate<Compania>('companias');
  const deleteCompania = useSupabaseDelete('companias');

  // Filtra las companias según el término de búsqueda
  const filteredCompanias = companias.filter(compania =>
    compania.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (compania.categoria && compania.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    companias,
    filteredCompanias,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createCompania,
    updateCompania,
    deleteCompania,
    refetch,
  };
};
