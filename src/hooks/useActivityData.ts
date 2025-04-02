
import { useState } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { Noticia, Documento, Producto, Compania } from '@/types/database';

export const useActivityData = () => {
  const { data: noticias = [] } = useSupabaseQuery<Noticia>('noticias', ['noticias'], undefined, {
    select: '*',
    orderBy: { column: 'created_at', ascending: false },
    limit: 5
  });

  const { data: documentos = [] } = useSupabaseQuery<Documento>('documentos', ['documentos'], undefined, {
    select: '*',
    orderBy: { column: 'created_at', ascending: false },
    limit: 5
  });

  const { data: productos = [] } = useSupabaseQuery<Producto>('productos', ['productos'], undefined, {
    select: '*',
    orderBy: { column: 'created_at', ascending: false },
    limit: 5
  });

  const { data: companias = [] } = useSupabaseQuery<Compania>('companias', ['companias'], undefined, {
    select: '*',
    orderBy: { column: 'created_at', ascending: false },
    limit: 5
  });

  // Combine and sort activities by created_at
  const recentActivities = [
    ...noticias.map(item => ({ 
      id: item.id, 
      type: 'notification', 
      title: `Noticia: ${item.titulo}`, 
      date: item.created_at,
      icon: 'Bell'
    })),
    ...documentos.map(item => ({ 
      id: item.id, 
      type: 'document', 
      title: `Documento: ${item.nombre}`, 
      date: item.created_at,
      icon: 'FileText'
    })),
    ...productos.map(item => ({ 
      id: item.id, 
      type: 'product', 
      title: `Producto: ${item.nombre}`,  
      date: item.created_at,
      icon: 'Package'
    })),
    ...companias.map(item => ({ 
      id: item.id, 
      type: 'company', 
      title: `Compañía: ${item.nombre}`, 
      date: item.created_at,
      icon: 'Building'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 10);

  return {
    recentActivities
  };
};
