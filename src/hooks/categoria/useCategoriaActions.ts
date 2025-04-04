import { toast } from 'sonner';
import { useSupabaseCreate, useSupabaseDelete } from '../useSupabaseQuery';
import { CategoriaProducto } from '@/types/database';

type UseCategoriaActionsProps = {
  categorias: (CategoriaProducto & {
    es_subcategoria?: boolean;
    parent_id?: string | null;
    nivel?: number;
  })[];
  categoryFormData: {
    name: string;
    parentId: string | null;
    nivel: number;
  };
  setCategoryFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    parentId: string | null;
    nivel: number;
  }>>;
  expandedCategories: string[];
  expandedSubcategories: string[];
  setExpandedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setExpandedSubcategories: React.Dispatch<React.SetStateAction<string[]>>;
  refetchCategorias: () => Promise<any>;
};

export const useCategoriaActions = ({
  categorias,
  categoryFormData,
  setCategoryFormData,
  expandedCategories,
  expandedSubcategories,
  setExpandedCategories,
  setExpandedSubcategories,
  refetchCategorias
}: UseCategoriaActionsProps) => {
  const createCategoria = useSupabaseCreate<CategoriaProducto & {
    es_subcategoria?: boolean;
    parent_id?: string | null;
    nivel?: number;
  }>('categorias_productos');
  
  const deleteCategoria = useSupabaseDelete('categorias_productos');

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
        es_subcategoria: categoryFormData.parentId ? true : false,
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
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(`Error al crear la categoría: ${error.message || ''}`);
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

  // Function to get subcategories for a level 3 category
  const getNivel3Categories = (subcategoriaId: string) => {
    return categorias.filter(
      cat => cat.es_subcategoria && cat.parent_id === subcategoriaId && cat.nivel === 3
    );
  };

  return {
    handleCategoryFormChange,
    handleCategorySubmit,
    handleDeleteCategory,
    toggleCategoryExpansion,
    toggleSubcategoryExpansion,
    getNivel3Categories
  };
};
