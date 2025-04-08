
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import ProductForm from './form/ProductForm';
import { useProductFormData } from '@/hooks/useProductFormData';
import { useCompanias } from '@/hooks/useCompanias';
import { useCategoriaProductos } from '@/hooks/useCategoriaProductos';
import { ProductoDetallado } from '@/hooks/useProductos';
import { Category, Company } from '@/types/product';

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (producto: ProductoDetallado) => Promise<boolean>;
  currentProduct: ProductoDetallado | null;
};

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  currentProduct
}) => {
  const { companias } = useCompanias();
  const { categorias } = useCategoriaProductos();
  const { 
    formData, 
    setFormData,
    handleInputChange,
    handleTextAreaChange,
    handleWysiwygChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleLevel3Change,
    handleCompanyChange,
    handleFeatureChange,
    addFeature,
    removeFeature
  } = useProductFormData(currentProduct);
  
  const [isLoading, setIsLoading] = useState(false);

  // Map categories and companies to the expected format
  const mappedCategories: Category[] = mapCategoriesToFormFormat(categorias);
  const mappedCompanies: Company[] = mapCompaniesToFormFormat(companias);

  // Log mapped categories for debugging
  useEffect(() => {
    console.log("ProductDialog - Mapped categories:", {
      categoriesCount: mappedCategories.length,
      categorias: categorias.length,
      mappedCategories: mappedCategories.map(c => ({ 
        id: c.id, 
        name: c.name, 
        subcategoriesCount: c.subcategories.length 
      }))
    });
  }, [categorias, mappedCategories]);

  // Initialize form when dialog opens or product changes
  useEffect(() => {
    if (open) {
      initializeFormData(currentProduct, setFormData);
    }
  }, [currentProduct, open, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Submitting form data:", formData);
      const success = await onSave(formData);
      if (success) {
        toast.success(currentProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        onOpenChange(false);
      } else {
        toast.error('Error al guardar el producto');
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
      toast.error('Error al procesar el formulario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>
        
        <ProductForm
          formData={{
            name: formData.nombre,
            description: formData.descripcion || '',
            categoryId: formData.categoria || 0,
            subcategoryId: formData.subcategoria_id || 0,
            level3CategoryId: formData.nivel3_id || undefined,
            companies: formData.companias?.map(id => id.toString()) || [],
            features: formData.caracteristicas || [],
            strengths: formData.fortalezas || '',
            weaknesses: formData.debilidades || '',
            observations: formData.observaciones || ''
          }}
          categories={mappedCategories}
          companies={mappedCompanies}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          onInputChange={handleInputChange}
          onTextAreaChange={handleTextAreaChange}
          onWysiwygChange={handleWysiwygChange}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onLevel3Change={handleLevel3Change}
          onCompanyChange={handleCompanyChange}
          onFeatureChange={handleFeatureChange}
          addFeature={addFeature}
          removeFeature={removeFeature}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

// Helper functions
function mapCategoriesToFormFormat(categorias: any[]): Category[] {
  console.log("Raw categorias data:", categorias);
  
  const mainCategories = categorias.filter(cat => !cat.es_subcategoria);
  console.log("Main categories:", mainCategories);
  
  return mainCategories.map(cat => {
    const subcategories = categorias
      .filter(subcat => subcat.es_subcategoria && subcat.parent_id === cat.id && subcat.nivel === 2);
    
    console.log(`Subcategories for ${cat.nombre}:`, subcategories);
    
    return {
      id: cat.id,
      name: cat.nombre,
      subcategories: subcategories.map(subcat => {
        const level3Categories = categorias
          .filter(level3 => level3.es_subcategoria && level3.parent_id === subcat.id && level3.nivel === 3);
        
        console.log(`Level3 categories for ${subcat.nombre}:`, level3Categories);
        
        return {
          id: subcat.id,
          name: subcat.nombre,
          parent_id: cat.id,
          level3: level3Categories.map(level3 => ({
            id: level3.id,
            name: level3.nombre,
            parent_id: subcat.id
          }))
        };
      })
    };
  });
}

function mapCompaniesToFormFormat(companias: any[]): Company[] {
  return companias.map(comp => ({
    id: comp.id,
    name: comp.nombre
  }));
}

function initializeFormData(currentProduct: ProductoDetallado | null, setFormData: React.Dispatch<React.SetStateAction<ProductoDetallado>>) {
  if (currentProduct) {
    setFormData({
      id: currentProduct.id,
      nombre: currentProduct.nombre,
      descripcion: currentProduct.descripcion || '',
      categoria: currentProduct.categoria || '',
      subcategoria_id: currentProduct.subcategoria_id,
      nivel3_id: currentProduct.nivel3_id,
      companias: currentProduct.companias || [],
      caracteristicas: currentProduct.caracteristicas || [],
      fortalezas: currentProduct.fortalezas || '',
      debilidades: currentProduct.debilidades || '',
      observaciones: currentProduct.observaciones || ''
    });
  } else {
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      companias: [],
      caracteristicas: [],
      fortalezas: '',
      debilidades: '',
      observaciones: ''
    });
  }
}

export default ProductDialog;
