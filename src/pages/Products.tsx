
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductsList from '@/components/products/ProductsList';
import ProductFilters from '@/components/products/ProductFilters';
import { useProductos } from '@/hooks/useProductos';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoriesManager from '@/components/products/CategoriesManager';
import { Product } from '@/types/product';

const Products = () => {
  const [activeTab, setActiveTab] = React.useState<string>('products');
  const navigate = useNavigate();
  
  const {
    filteredProductos,
    categorias,
    companias,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    categoria,
    setCategoria,
    deleteProducto
  } = useProductos();

  // Convert database Producto type to the Product type expected by ProductsList
  const mappedProducts = filteredProductos.map(producto => ({
    id: producto.id || '',
    name: producto.nombre,
    description: producto.descripcion || '',
    categoryId: producto.categoria || '',
    subcategoryId: producto.subcategoria_id || '',
    level3CategoryId: producto.nivel3_id,
    companies: producto.companias || [],
    features: producto.caracteristicas || []
  })) as Product[];

  // Map categories to the format expected by ProductFilters
  const mappedCategories = categorias.map(cat => ({
    id: cat.id,
    name: cat.nombre
  }));

  // Map companies to the format expected by ProductFilters
  const mappedCompanies = companias.map(comp => ({
    id: comp.id,
    name: comp.nombre
  }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateProduct = () => {
    navigate('/productos/crear');
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/productos/${product.id}`);
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProducto.mutateAsync(id.toString());
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Productos</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Gestionar Categorías</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <ProductFilters
            searchTerm={searchTerm}
            categories={mappedCategories}
            companies={mappedCompanies}
            selectedCategoryFilter={categoria}
            selectedCompanyFilter={null}
            onSearchChange={handleSearchChange}
            onCategoryFilterChange={(value) => setCategoria(value)}
            onCompanyFilterChange={() => {}}
            onClearFilters={() => {
              setSearchTerm('');
              setCategoria(null);
            }}
            onCreateClick={handleCreateProduct}
          />
          
          <ProductsList 
            products={mappedProducts}
            isLoading={isLoading} 
            error={error}
            getCategoryName={(id) => {
              const category = categorias.find(cat => cat.id === id.toString());
              return category ? category.nombre : 'Sin categoría';
            }}
            getSubcategoryName={() => 'Sin subcategoría'} // Necesitaríamos implementar esto adecuadamente
            getCompanyNames={(companyIds) => {
              if (!companyIds.length) return 'Sin compañías';
              return companyIds
                .map(id => {
                  const company = companias.find(c => c.id === id.toString());
                  return company ? company.nombre : '';
                })
                .filter(Boolean)
                .join(', ');
            }}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoriesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Products;
