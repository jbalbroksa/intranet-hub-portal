
import { useState } from 'react';
import { ProductoDetallado } from './useProductos';

export const useProductFormData = (initialProduct: ProductoDetallado | null) => {
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

  return {
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
  };
};
