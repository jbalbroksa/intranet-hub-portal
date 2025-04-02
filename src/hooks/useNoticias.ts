
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Noticia } from '@/types/database';

export const useNoticias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: noticias = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Noticia>(
    'noticias',
    ['noticias'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'fecha_publicacion', ascending: false }
    }
  );

  const createNoticia = useSupabaseCreate<Noticia>('noticias');
  const updateNoticia = useSupabaseUpdate<Noticia>('noticias');
  const deleteNoticia = useSupabaseDelete('noticias');

  // Filtra las noticias según el término de búsqueda
  const filteredNoticias = noticias.filter(noticia =>
    noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (noticia.es_destacada && searchTerm.toLowerCase().includes('destacad'))
  );

  return {
    noticias,
    filteredNoticias,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    refetch,
  };
};
