import { useState } from "react";
import { useProductQueries } from "./producto/useProductQueries";
import { useProductMutations } from "./producto/useProductMutations";

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
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [filtrosActivos, setFiltrosActivos] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] =
    useState<ProductoDetallado | null>(null);

  // Data fetching - get queries from separate hook
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
    refetchProductosCompanias,
  } = useProductQueries();

  // Data mutations - get from separate hook
  const { saveProducto, deleteProducto } = useProductMutations({
    refetch,
    refetchCaracteristicas,
    refetchProductosCompanias,
  });

  // Filter products based on search term and category
  const filteredProductos = filterProductos(
    productosDetallados || [],
    searchTerm,
    categoria,
  );

  // Product form actions
  const editProducto = (producto: ProductoDetallado) => {
    setCurrentProduct(producto);
    setProductFormOpen(true);
  };

  const newProducto = () => {
    setCurrentProduct(null);
    setProductFormOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoria(null);
    setFiltrosActivos(false);
  };

  return {
    productos: productos || [],
    filteredProductos: filteredProductos || [],
    categorias: categorias || [],
    companias: companias || [],
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
    clearFilters,
    refetch,
  };
};

// Helper function to filter products
function filterProductos(
  productos: ProductoDetallado[],
  searchTerm: string,
  categoria: string | null,
): ProductoDetallado[] {
  return productos.filter((producto) => {
    // Filter by search term
    const matchesSearchTerm = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategoria =
      !categoria ||
      categoria === "all" ||
      (producto.categoria &&
        producto.categoria.toLowerCase() === categoria.toLowerCase());

    return matchesSearchTerm && matchesCategoria;
  });
}
