import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsList from "@/components/products/ProductsList";
import ProductFilters from "@/components/products/ProductFilters";
import ProductDetail from "@/components/products/ProductDetail";
import { useProductos } from "@/hooks/useProductos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoriesManager from "@/components/products/CategoriesManager";
import { Product } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";

const Products = () => {
  const [activeTab, setActiveTab] = useState<string>("products");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const {
    filteredProductos = [],
    categorias = [],
    companias = [],
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    categoria,
    setCategoria,
    deleteProducto,
    clearFilters,
  } = useProductos() || {};

  // Convert database Producto type to the Product type expected by ProductsList
  const mappedProducts =
    filteredProductos?.map((producto) => ({
      id: producto.id || "",
      name: producto.nombre,
      description: producto.descripcion || "",
      categoryId: producto.categoria || "",
      subcategoryId: producto.subcategoria_id || "",
      level3CategoryId: producto.nivel3_id || "",
      companies: producto.companias || [],
    })) || [];

  // Handle navigation to create product page
  const handleCreateProduct = () => {
    navigate("/productos/crear");
  };

  // Handle product deletion
  const handleDeleteProduct = (id: string) => {
    deleteProducto.mutate(id);
  };

  // Handle product selection for detail view
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setDetailDialogOpen(true);
  };

  // Handle edit from detail view
  const handleEditFromDetail = () => {
    if (selectedProduct) {
      navigate(`/productos/editar/${selectedProduct.id}`);
    }
    setDetailDialogOpen(false);
  };

  // Map categorias to the format expected by ProductFilters
  const mappedCategories =
    categorias?.map((cat) => ({
      id: cat.id || "",
      name: cat.nombre || "",
    })) || [];

  // Map companias to the format expected by ProductFilters
  const mappedCompanies =
    companias?.map((comp) => ({
      id: comp.id || "",
      name: comp.nombre || "",
    })) || [];

  // Helper functions for ProductsList
  const getCategoryName = (categoryId: string | number) => {
    const category = categorias?.find((cat) => cat.id === categoryId);
    return category ? category.nombre : "Categoría desconocida";
  };

  const getSubcategoryName = (
    categoryId: string | number,
    subcategoryId: string | number,
  ) => {
    // This is a simplified implementation - you might need to adjust based on your data structure
    return subcategoryId ? `Subcategoría ${subcategoryId}` : "Sin subcategoría";
  };

  const getCompanyNames = (companyIds: string[]) => {
    // Join company names with commas
    return (
      companyIds
        .map((id) => {
          const company = companias?.find((comp) => comp.id === id);
          return company ? company.nombre : "";
        })
        .filter(Boolean)
        .join(", ") || "Sin compañías"
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando productos...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 py-8">
        Error al cargar productos: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
          </TabsList>

          {isAdmin && activeTab === "products" && (
            <button
              onClick={handleCreateProduct}
              className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Crear Producto
            </button>
          )}
        </div>

        <TabsContent value="products" className="space-y-6">
          <ProductFilters
            searchTerm={searchTerm}
            categories={mappedCategories}
            companies={mappedCompanies}
            selectedCategoryFilter={categoria}
            selectedCompanyFilter={null}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onCategoryFilterChange={setCategoria}
            onCompanyFilterChange={() => {}}
            onClearFilters={clearFilters || (() => {})}
            onCreateClick={handleCreateProduct}
          />
          <ProductsList
            products={mappedProducts}
            onDelete={isAdmin ? handleDeleteProduct : undefined}
            onEditProduct={handleProductSelect}
            getCategoryName={getCategoryName}
            getSubcategoryName={getSubcategoryName}
            getCompanyNames={getCompanyNames}
          />

          {/* Product Detail Dialog */}
          <ProductDetail
            product={selectedProduct}
            isOpen={detailDialogOpen}
            onClose={() => setDetailDialogOpen(false)}
            onEdit={isAdmin ? handleEditFromDetail : undefined}
            getCategoryName={getCategoryName}
            getSubcategoryName={getSubcategoryName}
            getCompanyNames={getCompanyNames}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoriesManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Products;
