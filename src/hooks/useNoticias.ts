
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Noticia, Compania } from '@/types/database';

export const useNoticias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companiaFilter, setCompaniaFilter] = useState<string | null>(null);
  
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

  const {
    data: companias = [],
    isLoading: loadingCompanias,
  } = useSupabaseQuery<Compania>(
    'companias',
    ['companias'],
    undefined,
    {
      select: 'id,nombre',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const createNoticia = useSupabaseCreate<Noticia>('noticias');
  const updateNoticia = useSupabaseUpdate<Noticia>('noticias');
  const deleteNoticia = useSupabaseDelete('noticias');

  // Filtra las noticias según el término de búsqueda y compañía seleccionada
  const filteredNoticias = noticias.filter(noticia =>
    (noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (noticia.contenido && noticia.contenido.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (noticia.es_destacada && searchTerm.toLowerCase().includes('destacad'))) &&
    (!companiaFilter || companiaFilter === 'none' || (noticia.compania_id && noticia.compania_id === companiaFilter))
  );

  return {
    noticias,
    filteredNoticias,
    companias,
    isLoading,
    loadingCompanias,
    error,
    searchTerm,
    setSearchTerm,
    companiaFilter,
    setCompaniaFilter,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    refetch,
  };
};
