
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import ProductForm from './ProductForm';
import { useCompanias } from '@/hooks/useCompanias';
import { useCategoriaProductos } from '@/hooks/useCategoriaProductos';
import { ProductoDetallado } from '@/hooks/useProductos';

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
  
  const [formData, setFormData] = useState<ProductoDetallado>({
    nombre: '',
    descripcion: '',
    categoria: '',
    caracteristicas: [],
    companias: [],
    fortalezas: '',
    debilidades: '',
    observaciones: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Mapear las categorías y compañías al formato esperado por el formulario
  const mappedCategories = categorias
    .filter(cat => !cat.es_subcategoria) // Solo categorías principales para el primer nivel
    .map(cat => ({
      id: Number(cat.id),
      name: cat.nombre,
      subcategories: categorias
        .filter(subcat => subcat.es_subcategoria && subcat.parent_id === cat.id && subcat.nivel === 2)
        .map(subcat => ({
          id: Number(subcat.id),
          name: subcat.nombre,
          parent_id: Number(cat.id),
          level3: categorias
            .filter(level3 => level3.es_subcategoria && level3.parent_id === subcat.id && level3.nivel === 3)
            .map(level3 => ({
              id: Number(level3.id),
              name: level3.nombre,
              parent_id: Number(subcat.id)
            }))
        }))
    }));

  const mappedCompanies = companias.map(comp => ({
    id: comp.id,
    name: comp.nombre
  }));

  // Inicializar el formulario cuando se abre el diálogo o cambia el producto actual
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        id: currentProduct.id,
        nombre: currentProduct.nombre,
        descripcion: currentProduct.descripcion || '',
        categoria: currentProduct.categoria || '',
        subcategoria_id: currentProduct.subcategoria_id,
        nivel3_id: currentProduct.nivel3_id,
        caracteristicas: currentProduct.caracteristicas || [],
        companias: currentProduct.companias || [],
        fortalezas: currentProduct.fortalezas || '',
        debilidades: currentProduct.debilidades || '',
        observaciones: currentProduct.observaciones || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        categoria: '',
        caracteristicas: [],
        companias: [],
        fortalezas: '',
        debilidades: '',
        observaciones: ''
      });
    }
  }, [currentProduct, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWysiwygChange = (name: string, content: string) => {
    setFormData(prev => ({ ...prev, [name]: content }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      categoria: value === "0" ? "" : value,
      subcategoria_id: undefined,
      nivel3_id: undefined
    }));
  };

  const handleSubcategoryChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      subcategoria_id: value === "0" ? undefined : value,
      nivel3_id: undefined
    }));
  };

  const handleLevel3Change = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      nivel3_id: value === "0" ? undefined : value 
    }));
  };

  const handleCompanyChange = (companiaId: string) => {
    setFormData(prev => {
      const currentCompanias = prev.companias || [];
      
      if (currentCompanias.includes(companiaId)) {
        return { 
          ...prev, 
          companias: currentCompanias.filter(id => id !== companiaId) 
        };
      } else {
        return { 
          ...prev, 
          companias: [...currentCompanias, companiaId] 
        };
      }
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => {
      const caracteristicas = [...(prev.caracteristicas || [])];
      caracteristicas[index] = value;
      return { ...prev, caracteristicas };
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: [...(prev.caracteristicas || []), '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => {
      const caracteristicas = [...(prev.caracteristicas || [])];
      caracteristicas.splice(index, 1);
      return { ...prev, caracteristicas };
    });
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
            categoryId: formData.categoria ? Number(formData.categoria) : 0,
            subcategoryId: formData.subcategoria_id ? Number(formData.subcategoria_id) : 0,
            level3CategoryId: formData.nivel3_id ? Number(formData.nivel3_id) : undefined,
            companies: formData.companias?.map(id => id.toString()) || [],
            features: formData.caracteristicas || [],
            strengths: formData.fortalezas,
            weaknesses: formData.debilidades,
            observations: formData.observaciones
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

export default ProductDialog;
