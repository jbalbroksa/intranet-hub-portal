
import { useState, useEffect } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { Producto, CategoriaProducto, Compania } from '@/types/database';

export type ProductoDetallado = Producto & {
  caracteristicas?: string[];
  fortalezas?: string;
  debilidades?: string;
  observaciones?: string;
  subcategoria_id?: string;
  nivel3_id?: string;
  companias?: string[];
};

export const useProductos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [filtrosActivos, setFiltrosActivos] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductoDetallado | null>(null);
  
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
  } = useSupabaseQuery<CategoriaProducto>(
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

  const createProducto = useSupabaseCreate<Producto>('productos');
  const updateProducto = useSupabaseUpdate<Producto>('productos');
  const deleteProducto = useSupabaseDelete('productos');
  const createCaracteristica = useSupabaseCreate<{ producto_id: string; nombre: string }>('caracteristicas_productos');
  const createProductoCompania = useSupabaseCreate<{ producto_id: string; compania_id: string }>('productos_companias');
  const deleteCaracteristicasByProducto = useSupabaseDelete('caracteristicas_productos');
  const deleteProductoCompaniasByProducto = useSupabaseDelete('productos_companias');

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

  // Filtra los productos según varios criterios
  const filteredProductos = productosDetallados.filter(producto => {
    // Filtro por término de búsqueda
    const matchesSearchTerm = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoría
    const matchesCategoria = !categoria || categoria === 'all' || 
      (producto.categoria && producto.categoria.toLowerCase() === categoria.toLowerCase());
    
    return matchesSearchTerm && matchesCategoria;
  });

  // Función para crear o actualizar un producto completo con sus relaciones
  const saveProducto = async (productoData: ProductoDetallado) => {
    try {
      let productoId;
      
      // Si es una actualización
      if (productoData.id) {
        // Actualiza el producto principal
        await updateProducto.mutateAsync({
          id: productoData.id,
          data: {
            nombre: productoData.nombre,
            descripcion: productoData.descripcion,
            categoria: productoData.categoria,
            subcategoria_id: productoData.subcategoria_id,
            nivel3_id: productoData.nivel3_id,
            fortalezas: productoData.fortalezas,
            debilidades: productoData.debilidades,
            observaciones: productoData.observaciones
          }
        });
        
        productoId = productoData.id;
        
        // Elimina características y relaciones existentes
        await deleteCaracteristicasByProducto.mutateAsync(productoId);
        await deleteProductoCompaniasByProducto.mutateAsync(productoId);
      } else {
        // Crea un nuevo producto
        const nuevoProducto = await createProducto.mutateAsync({
          nombre: productoData.nombre,
          descripcion: productoData.descripcion,
          categoria: productoData.categoria,
          subcategoria_id: productoData.subcategoria_id,
          nivel3_id: productoData.nivel3_id,
          fortalezas: productoData.fortalezas,
          debilidades: productoData.debilidades,
          observaciones: productoData.observaciones
        });
        
        productoId = nuevoProducto.id;
      }
      
      // Crea las características
      if (productoData.caracteristicas && productoData.caracteristicas.length > 0) {
        for (const caracteristica of productoData.caracteristicas) {
          if (caracteristica.trim()) {
            await createCaracteristica.mutateAsync({
              producto_id: productoId,
              nombre: caracteristica
            });
          }
        }
      }
      
      // Crea las relaciones con compañías
      if (productoData.companias && productoData.companias.length > 0) {
        for (const companiaId of productoData.companias) {
          await createProductoCompania.mutateAsync({
            producto_id: productoId,
            compania_id: companiaId
          });
        }
      }
      
      // Refresca los datos
      await refetch();
      await refetchCaracteristicas();
      await refetchProductosCompanias();
      
      // Resetea el formulario
      setCurrentProduct(null);
      setProductFormOpen(false);
      
      return true;
    } catch (error) {
      console.error('Error al guardar producto:', error);
      return false;
    }
  };

  // Función para abrir el formulario para editar un producto
  const editProducto = (producto: ProductoDetallado) => {
    setCurrentProduct(producto);
    setProductFormOpen(true);
  };

  // Función para abrir el formulario para crear un nuevo producto
  const newProducto = () => {
    setCurrentProduct(null);
    setProductFormOpen(true);
  };

  return {
    productos: productosDetallados,
    categorias,
    filteredProductos,
    companias,
    isLoading,
    loadingCategorias,
    loadingCompanias,
    error,
    searchTerm,
    setSearchTerm,
    categoria,
    setCategoria,
    filtrosActivos,
    setFiltrosActivos,
    productFormOpen,
    setProductFormOpen,
    currentProduct,
    setCurrentProduct,
    saveProducto,
    editProducto,
    newProducto,
    deleteProducto,
    refetch,
    refetchCaracteristicas,
    refetchProductosCompanias
  };
};
