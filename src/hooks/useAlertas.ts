
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Notificacion } from '@/types/database';

export const useAlertas = () => {
  const {
    data: alertas = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Notificacion>(
    'notificaciones',
    ['notificaciones'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'fecha_creacion', ascending: false }
    }
  );

  const createAlerta = useSupabaseCreate<Notificacion>('notificaciones');
  const updateAlerta = useSupabaseUpdate<Notificacion>('notificaciones');
  const deleteAlerta = useSupabaseDelete('notificaciones');

  return {
    alertas,
    isLoading,
    error,
    createAlerta,
    updateAlerta,
    deleteAlerta,
    refetch,
  };
};
