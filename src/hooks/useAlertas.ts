
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Notificacion } from '@/types/database';
import { toast } from 'sonner';

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
      orderBy: { column: 'fecha_creacion', ascending: false },
      limit: 5 // Limit to 5 alerts for the dashboard
    }
  );

  const createAlerta = useSupabaseCreate<Notificacion>('notificaciones');
  const updateAlerta = useSupabaseUpdate<Notificacion>('notificaciones');
  const deleteAlerta = useSupabaseDelete('notificaciones');
  
  const markAsRead = async (id: string) => {
    try {
      await updateAlerta.mutateAsync({
        id,
        data: { es_leida: true }
      });
      toast.success('Notificación marcada como leída');
      refetch();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      toast.error('Error al marcar como leída');
    }
  };

  const markAllAsRead = async () => {
    try {
      const promises = alertas
        .filter(alerta => !alerta.es_leida)
        .map(alerta => updateAlerta.mutateAsync({
          id: alerta.id,
          data: { es_leida: true }
        }));
      
      await Promise.all(promises);
      toast.success('Todas las notificaciones marcadas como leídas');
      refetch();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      toast.error('Error al marcar todas como leídas');
    }
  };

  return {
    alertas,
    isLoading,
    error,
    createAlerta,
    updateAlerta,
    deleteAlerta,
    markAsRead,
    markAllAsRead,
    refetch,
  };
};
