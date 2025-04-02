
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Noticia } from '@/types/database';

export const useNoticias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  const {
    data: noticias = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Noticia[]>(
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

  // Filtra las noticias según el término de búsqueda y si son destacadas
  const filteredNoticias = noticias.filter(noticia => {
    const matchesSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeatured = !showFeaturedOnly || noticia.es_destacada;
    return matchesSearch && matchesFeatured;
  });

  return {
    noticias,
    filteredNoticias,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    showFeaturedOnly,
    setShowFeaturedOnly,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    refetch,
  };
};
