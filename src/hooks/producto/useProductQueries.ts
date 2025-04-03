
import { useSupabaseQuery } from '../useSupabaseQuery';
import { Producto, CategoriaProducto, Compania } from '@/types/database';
import { ProductoDetallado } from '../useProductos';

export const useProductQueries = () => {
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

  const {
    data: categorias = [],
    isLoading: loadingCategorias,
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

  // Query para características de productos
  const {
    data: caracteristicas = [],
    refetch: refetchCaracteristicas,
  } = useSupabaseQuery<{ id: string; producto_id: string; nombre: string }>(
    'caracteristicas_productos',
    ['caracteristicas_productos'],
    undefined,
    {
      select: '*'
    }
  );

  // Query para relaciones entre productos y compañías
  const {
    data: productosCompanias = [],
    refetch: refetchProductosCompanias,
  } = useSupabaseQuery<{ id: string; producto_id: string; compania_id: string }>(
    'productos_companias',
    ['productos_companias'],
    undefined,
    {
      select: '*'
    }
  );

  // Combina los datos de productos con sus características y compañías
  const productosDetallados = productos.map(producto => {
    const productCaracteristicas = caracteristicas
      .filter(caract => caract.producto_id === producto.id)
      .map(caract => caract.nombre);
    
    const productCompanias = productosCompanias
      .filter(rel => rel.producto_id === producto.id)
      .map(rel => rel.compania_id);
    
    return {
      ...producto,
      caracteristicas: productCaracteristicas,
      companias: productCompanias
    };
  });

  return {
    productos,
    productosDetallados,
    categorias,
    companias,
    caracteristicas,
    productosCompanias,
    isLoading,
    loadingCategorias,
    loadingCompanias,
    error,
    refetch,
    refetchCaracteristicas,
    refetchProductosCompanias
  };
};
