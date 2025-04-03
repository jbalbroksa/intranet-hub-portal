
import { useState } from 'react';
import { useProductQueries } from './producto/useProductQueries';
import { useProductMutations } from './producto/useProductMutations';

export type ProductoDetallado = {
  id?: string;
  nombre: string;
  descripcion?: string;
  caracteristicas?: string[];
  fortalezas?: string;
  debilidades?: string;
  observaciones?: string;
  subcategoria_id?: string;
  nivel3_id?: string;
  categoria?: string;
  companias?: string[];
};

export const useProductos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [filtrosActivos, setFiltrosActivos] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductoDetallado | null>(null);
  
  // Get queries from separate hook
  const { 
    productos, 
    productosDetallados,
    categorias,
    companias,
    isLoading,
    loadingCategorias,
    loadingCompanias,
    error,
    refetch,
    refetchCaracteristicas,
    refetchProductosCompanias
  } = useProductQueries();

  // Get mutations from separate hook
  const {
    saveProducto,
    deleteProducto
  } = useProductMutations({
    refetch, 
    refetchCaracteristicas, 
    refetchProductosCompanias
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
    refetch
  };
};
