
import { useState } from 'react';
import { useCategoriaQueries } from './categoria/useCategoriaQueries';
import { useCategoriaActions } from './categoria/useCategoriaActions';

export type Subcategoria = {
  id: string;
  nombre: string;
  categoria_id: string;
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
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('list');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    parentId: null as string | null,
    nivel: 1
  });

  // Get category data and queries
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
    categorias,
    categoriasOrganizadas,
    loadingCategorias,
    categoriasError,
    activeCategoryTab,
    setActiveCategoryTab,
    expandedCategories,
    expandedSubcategories,
    toggleCategoryExpansion,
    toggleSubcategoryExpansion,
    categoryFormData,
    handleCategoryFormChange,
    handleCategorySubmit,
    handleDeleteCategory,
    getNivel3Categories,
    refetchCategorias
  };
};
