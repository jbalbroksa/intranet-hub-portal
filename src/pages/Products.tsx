
import React from 'react';
import ProductsList from '@/components/products/ProductsList';
import ProductFilters from '@/components/products/ProductFilters';
import { useProductos } from '@/hooks/useProductos';

const Products = () => {
  const {
    productos,
    filteredProductos,
    categorias,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    categoria,
    setCategoria
  } = useProductos();

  // Convert database Producto type to the Product type expected by ProductsList
  const mappedProducts = filteredProductos.map(producto => ({
    id: Number(producto.id),
    name: producto.nombre,
    description: producto.descripcion || '',
    categoryId: producto.categoria ? Number(producto.categoria) : 0,
    subcategoryId: 0, // Default value since our database schema doesn't have this
    companies: [],
    features: []
  }));

  // Map categories to the format expected by ProductFilters
  const mappedCategories = categorias.map(cat => ({
    id: Number(cat.id),
    name: cat.nombre
  }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      <h1 className="text-2xl font-semibold">Productos</h1>
      
      <ProductFilters
        searchTerm={searchTerm}
        categories={mappedCategories}
        companies={[]}
        selectedCategoryFilter={categoria ? Number(categoria) : null}
        selectedCompanyFilter={null}
        onSearchChange={handleSearchChange}
        onCategoryFilterChange={(value) => setCategoria(value ? String(value) : null)}
        onCompanyFilterChange={() => {}}
        onClearFilters={() => {
          setSearchTerm('');
          setCategoria(null);
        }}
        onCreateClick={() => {}}
      />
      
      <ProductsList 
        products={mappedProducts}
        isLoading={isLoading} 
        error={error}
        getCategoryName={(id) => {
          const category = categorias.find(cat => Number(cat.id) === id);
          return category ? category.nombre : 'Sin categoría';
        }}
        getSubcategoryName={() => 'Sin subcategoría'}
        getCompanyNames={() => 'Sin compañías'}
        onEditProduct={() => {}}
        onDeleteProduct={() => {}}
      />
    </div>
  );
};

export default Products;
