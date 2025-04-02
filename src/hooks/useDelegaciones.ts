
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Delegacion } from '@/types/database';

export const useDelegaciones = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: delegaciones = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Delegacion[]>(
    'delegaciones',
    ['delegaciones'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const createDelegacion = useSupabaseCreate<Delegacion>('delegaciones');
  const updateDelegacion = useSupabaseUpdate<Delegacion>('delegaciones');
  const deleteDelegacion = useSupabaseDelete('delegaciones');

  // Filtra las delegaciones según el término de búsqueda
  const filteredDelegaciones = delegaciones.filter(delegacion =>
    delegacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (delegacion.ciudad && delegacion.ciudad.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (delegacion.pais && delegacion.pais.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    delegaciones,
    filteredDelegaciones,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createDelegacion,
    updateDelegacion,
    deleteDelegacion,
    refetch,
  };
};
