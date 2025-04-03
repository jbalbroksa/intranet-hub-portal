
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { CategoriaProducto } from '@/types/database';
import { toast } from 'sonner';

export type Subcategoria = {
  id: number;
  nombre: string;
  categoria_id: number;
};

export type CategoriaConSubcategorias = {
  id: number;
  nombre: string;
  subcategorias: Subcategoria[];
};

export const useCategoriaProductos = () => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('list');
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<number[]>([]);

  const {
    data: categorias = [],
    isLoading: loadingCategorias,
    error: categoriasError,
    refetch: refetchCategorias,
  } = useSupabaseQuery<CategoriaProducto>(
    'categorias_productos',
    ['categorias_productos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const createCategoria = useSupabaseCreate<CategoriaProducto>('categorias_productos');
  const updateCategoria = useSupabaseUpdate<CategoriaProducto>('categorias_productos');
  const deleteCategoria = useSupabaseDelete('categorias_productos');

  // Function to toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Function to toggle subcategory expansion
  const toggleSubcategoryExpansion = (subcategoryId: number) => {
    setExpandedSubcategories(prev => 
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  // Function to handle category submission
  const handleCategorySubmit = async (formData: any) => {
    try {
      // Create a slug from the name
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-');
      
      await createCategoria.mutateAsync({
        nombre: formData.name,
        slug: slug
      });
      
      toast.success('Categoría creada correctamente');
      refetchCategorias();
    } catch (error) {
      toast.error('Error al crear la categoría');
      console.error(error);
    }
  };

  // Function to handle category deletion
  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoria.mutateAsync(id);
      toast.success('Categoría eliminada correctamente');
      refetchCategorias();
    } catch (error) {
      toast.error('Error al eliminar la categoría');
      console.error(error);
    }
  };

  return {
    categorias,
    loadingCategorias,
    categoriasError,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    activeCategoryTab,
    setActiveCategoryTab,
    expandedCategories,
    expandedSubcategories,
    toggleCategoryExpansion,
    toggleSubcategoryExpansion,
    handleCategorySubmit,
    handleDeleteCategory,
    refetchCategorias
  };
};
