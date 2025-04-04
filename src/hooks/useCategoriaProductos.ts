
import { useState } from 'react';
import { useCategoriaQueries } from './categoria/useCategoriaQueries';
import { useCategoriaActions } from './categoria/useCategoriaActions';

export type Subcategoria = {
  id: string;
  nombre: string;
  categoria_id?: string; // Made optional to fix type error
  es_subcategoria: boolean;
  parent_id: string | null;
  nivel: number;
};

export type CategoriaConSubcategorias = {
  id: string;
  nombre: string;
  subcategorias: Subcategoria[];
};

export const useCategoriaProductos = () => {
  // UI state
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('list');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  
  // Form state
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    parentId: null as string | null,
    nivel: 1
  });

  // Get category data through queries
  const {
    categorias,
    categoriasOrganizadas,
    loadingCategorias,
    categoriasError,
    refetchCategorias
  } = useCategoriaQueries();

  // Get category actions
  const {
    handleCategoryFormChange,
    handleCategorySubmit,
    handleDeleteCategory,
    toggleCategoryExpansion,
    toggleSubcategoryExpansion,
    getNivel3Categories
  } = useCategoriaActions({
    categorias,
    categoryFormData,
    setCategoryFormData,
    expandedCategories,
    expandedSubcategories,
    setExpandedCategories,
    setExpandedSubcategories,
    refetchCategorias
  });

  return {
    // Data
    categorias,
    categoriasOrganizadas,
    loadingCategorias,
    categoriasError,
    
    // UI state
    activeCategoryTab,
    setActiveCategoryTab,
    expandedCategories,
    expandedSubcategories,
    
    // Form state
    categoryFormData,
    
    // Actions
    handleCategoryFormChange,
    handleCategorySubmit,
    handleDeleteCategory,
    toggleCategoryExpansion,
    toggleSubcategoryExpansion,
    getNivel3Categories,
    refetchCategorias
  };
};
