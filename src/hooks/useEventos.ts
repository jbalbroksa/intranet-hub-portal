
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Evento } from '@/types/database';

export const useEventos = () => {
  const {
    data: eventos = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Evento>(
    'eventos',
    ['eventos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'fecha_inicio', ascending: true }
    }
  );

  const createEvento = useSupabaseCreate<Evento>('eventos');
  const updateEvento = useSupabaseUpdate<Evento>('eventos');
  const deleteEvento = useSupabaseDelete('eventos');

  return {
    eventos,
    isLoading,
    error,
    createEvento,
    updateEvento,
    deleteEvento,
    refetch,
  };
};
