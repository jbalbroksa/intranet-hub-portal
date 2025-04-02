
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Producto } from '@/types/database';

export const useProductos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [filtrosActivos, setFiltrosActivos] = useState(false);
  
  const {
    data: productos = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Producto>(
    'productos',
    ['productos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const createProducto = useSupabaseCreate<Producto>('productos');
  const updateProducto = useSupabaseUpdate<Producto>('productos');
  const deleteProducto = useSupabaseDelete('productos');

  // Filtra los productos según varios criterios
  const filteredProductos = productos.filter(producto => {
    // Filtro por término de búsqueda
    const matchesSearchTerm = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoría
    const matchesCategoria = !categoria || 
      (producto.categoria && producto.categoria.toLowerCase() === categoria.toLowerCase());
    
    return matchesSearchTerm && matchesCategoria;
  });

  return {
    productos,
    filteredProductos,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    categoria,
    setCategoria,
    filtrosActivos,
    setFiltrosActivos,
    createProducto,
    updateProducto,
    deleteProducto,
    refetch,
  };
};
