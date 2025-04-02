
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Producto, CategoriaProducto } from '@/types/database';

export const useProductos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const {
    data: productos = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<Producto[]>(
    'productos',
    ['productos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const {
    data: categorias = [],
    isLoading: isLoadingCategorias,
  } = useSupabaseQuery<CategoriaProducto[]>(
    'categorias_productos',
    ['categorias_productos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const createProducto = useSupabaseCreate<Producto>('productos');
  const updateProducto = useSupabaseUpdate<Producto>('productos');
  const deleteProducto = useSupabaseDelete('productos');

  const createCategoria = useSupabaseCreate<CategoriaProducto>('categorias_productos');
  const updateCategoria = useSupabaseUpdate<CategoriaProducto>('categorias_productos');
  const deleteCategoria = useSupabaseDelete('categorias_productos');

  // Filtra los productos según el término de búsqueda y la categoría
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || producto.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return {
    productos,
    filteredProductos,
    categorias,
    isLoading,
    isLoadingCategorias,
    error,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    createProducto,
    updateProducto,
    deleteProducto,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    refetch,
  };
};
