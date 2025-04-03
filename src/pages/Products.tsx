
import React from 'react';
import ProductsList from '@/components/products/ProductsList';
import ProductFilters from '@/components/products/ProductFilters';
import { useProductos } from '@/hooks/useProductos';

const Products = () => {
  const {
    productos,
    filteredProductos,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    categoria,
    setCategoria
  } = useProductos();

  return (
    <div className="space-y-6 animate-slideInUp">
      <h1 className="text-2xl font-semibold">Productos</h1>
      
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        category={categoria || ''}
        onCategoryChange={(value) => setCategoria(value)}
      />
      
      <ProductsList 
        products={filteredProductos} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
};

export default Products;
