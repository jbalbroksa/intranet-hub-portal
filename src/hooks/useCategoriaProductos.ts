
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { CategoriaProducto } from '@/types/database';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  const {
    data: categorias = [],
    isLoading: loadingCategorias,
    error: categoriasError,
    refetch: refetchCategorias,
  } = useSupabaseQuery<CategoriaProducto & { 
    es_subcategoria?: boolean;
    parent_id?: string | null;
    nivel?: number;
  }>(
    'categorias_productos',
    ['categorias_productos'],
    undefined,
    {
      select: '*',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  const createCategoria = useSupabaseCreate<CategoriaProducto & {
    es_subcategoria?: boolean;
    parent_id?: string | null;
    nivel?: number;
  }>('categorias_productos');
  
  const updateCategoria = useSupabaseUpdate<CategoriaProducto & {
    es_subcategoria?: boolean;
    parent_id?: string | null;
    nivel?: number;
  }>('categorias_productos');
  
  const deleteCategoria = useSupabaseDelete('categorias_productos');

  // Organiza las categorías en una estructura jerárquica
  const categoriasOrganizadas = categorias.reduce((acc, cat) => {
    // Si es una categoría principal (nivel 1)
    if (!cat.es_subcategoria) {
      const subcategorias = categorias.filter(
        sub => sub.es_subcategoria && sub.parent_id === cat.id && sub.nivel === 2
      );
      
      acc.push({
        id: cat.id,
        nombre: cat.nombre,
        subcategorias
      });
    }
    return acc;
  }, [] as CategoriaConSubcategorias[]);

  // Function to toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Function to toggle subcategory expansion
  const toggleSubcategoryExpansion = (subcategoryId: string) => {
    setExpandedSubcategories(prev => 
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  // Function to handle category form data change
  const handleCategoryFormChange = (field: string, value: string | null) => {
    setCategoryFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to handle category submission
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!categoryFormData.name.trim()) {
        toast.error("El nombre no puede estar vacío");
        return;
      }
      
      // Create a slug from the name
      const slug = categoryFormData.name.toLowerCase().replace(/\s+/g, '-');
      
      const newCategory = {
        nombre: categoryFormData.name,
        slug: slug,
        es_subcategoria: !!categoryFormData.parentId,
        parent_id: categoryFormData.parentId,
        nivel: categoryFormData.nivel
      };
      
      await createCategoria.mutateAsync(newCategory);
      
      toast.success(
        categoryFormData.parentId 
          ? 'Subcategoría creada correctamente' 
          : 'Categoría creada correctamente'
      );
      
      // Reset form
      setCategoryFormData({
        name: '',
        parentId: null,
        nivel: 1
      });
      
      refetchCategorias();
    } catch (error) {
      toast.error('Error al crear la categoría');
      console.error(error);
    }
  };

  // Function to handle category deletion
  const handleDeleteCategory = async (id: string) => {
    try {
      // Check if there are subcategories
      const subcategorias = categorias.filter(cat => cat.parent_id === id);
      
      if (subcategorias.length > 0) {
        if (!window.confirm('Esta categoría tiene subcategorías que también serán eliminadas. ¿Desea continuar?')) {
          return;
        }
        
        // Delete subcategories first
        for (const subcat of subcategorias) {
          await deleteCategoria.mutateAsync(subcat.id);
        }
      }
      
      // Then delete the category
      await deleteCategoria.mutateAsync(id);
      toast.success('Categoría eliminada correctamente');
      refetchCategorias();
    } catch (error) {
      toast.error('Error al eliminar la categoría');
      console.error(error);
    }
  };

  // Function to get subcategories for a level 3 category
  const getNivel3Categories = (subcategoriaId: string) => {
    return categorias.filter(
      cat => cat.es_subcategoria && cat.parent_id === subcategoriaId && cat.nivel === 3
    );
  };

  return {
    categorias,
    categoriasOrganizadas,
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
    categoryFormData,
    handleCategoryFormChange,
    handleCategorySubmit,
    handleDeleteCategory,
    getNivel3Categories,
    refetchCategorias
  };
};
