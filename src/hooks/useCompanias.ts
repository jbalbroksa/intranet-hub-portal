
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Compania } from '@/types/database';

export type CategoryFilter = 'all' | 'specific' | 'preferred';

export const useCompanias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  
  const {
    data: companias = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Compania[]>(
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

  // Filtra las compañías según el término de búsqueda y la categoría
  const filteredCompanias = companias.filter(compania => {
    const matchesSearch = compania.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || compania.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return {
    companias,
    filteredCompanias,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    createCompania,
    updateCompania,
    deleteCompania,
    refetch,
  };
};
