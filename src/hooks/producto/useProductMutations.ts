
import { useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from '../useSupabaseQuery';
import { Producto } from '@/types/database';
import { ProductoDetallado } from '../useProductos';

type UseProductMutationsProps = {
  refetch: () => Promise<any>;
  refetchCaracteristicas: () => Promise<any>;
  refetchProductosCompanias: () => Promise<any>;
};

export const useProductMutations = ({
  refetch,
  refetchCaracteristicas,
  refetchProductosCompanias
}: UseProductMutationsProps) => {
  const createProducto = useSupabaseCreate<Producto>('productos');
  const updateProducto = useSupabaseUpdate<Producto>('productos');
  const deleteProducto = useSupabaseDelete('productos');
  const createCaracteristica = useSupabaseCreate<{ producto_id: string; nombre: string }>('caracteristicas_productos');
  const createProductoCompania = useSupabaseCreate<{ producto_id: string; compania_id: string }>('productos_companias');
  const deleteCaracteristicasByProducto = useSupabaseDelete('caracteristicas_productos');
  const deleteProductoCompaniasByProducto = useSupabaseDelete('productos_companias');

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
      
      return true;
    } catch (error) {
      console.error('Error al guardar producto:', error);
      return false;
    }
  };

  return {
    createProducto,
    updateProducto,
    deleteProducto,
    createCaracteristica,
    createProductoCompania,
    deleteCaracteristicasByProducto,
    deleteProductoCompaniasByProducto,
    saveProducto
  };
};
