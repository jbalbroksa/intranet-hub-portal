
import { CategoriaProducto } from '@/types/database';
import { useSupabaseQuery } from '../useSupabaseQuery';
import { CategoriaConSubcategorias, Subcategoria } from '../useCategoriaProductos';

export const useCategoriaQueries = () => {
  const {
    data: categorias = [],
    isLoading: loadingCategorias,
    error: categoriasError,
    refetch: refetchCategorias,
  } = useSupabaseQuery<CategoriaProducto & { 
    es_subcategoria?: boolean;
    parent_id?: string | null;
    nivel?: number;
  }>(
    'categorias_productos',
    ['categorias_productos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  // Organiza las categorías en una estructura jerárquica
  const categoriasOrganizadas = categorias.reduce((acc, cat) => {
    // Si es una categoría principal (nivel 1)
    if (!cat.es_subcategoria) {
      const subcategorias = categorias.filter(
        sub => sub.es_subcategoria && sub.parent_id === cat.id && sub.nivel === 2
      ) as Subcategoria[]; // Use type assertion here
      
      acc.push({
        id: cat.id,
        nombre: cat.nombre,
        subcategorias
      });
    }
    return acc;
  }, [] as CategoriaConSubcategorias[]);

  return {
    categorias,
    categoriasOrganizadas,
    loadingCategorias,
    categoriasError,
    refetchCategorias
  };
};
