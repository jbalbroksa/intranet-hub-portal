
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ProductoDetallado, useProductos } from '@/hooks/useProductos';
import { useCompanias } from '@/hooks/useCompanias';
import { useCategoriaProductos } from '@/hooks/useCategoriaProductos';
import { useProductFormData } from '@/hooks/useProductFormData';
import ProductBasicInfo from '@/components/products/form/ProductBasicInfo';
import ProductDescriptionEditor from '@/components/products/form/ProductDescriptionEditor';
import ProductCompanies from '@/components/products/form/ProductCompanies';
import ProductFeatures from '@/components/products/form/ProductFeatures';
import { Category, Company } from '@/types/product';
import { ArrowLeft } from 'lucide-react';

const ProductCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { saveProducto, productos } = useProductos();
  const { companias } = useCompanias();
  const { categorias } = useCategoriaProductos();
  const [isLoading, setIsLoading] = useState(false);
  
  // Find the product if we are editing
  const currentProduct = id ? productos.find(p => p.id === id) : null;
  const pageTitle = currentProduct ? 'Editar Producto' : 'Crear Producto';

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

  // Map categories and companies to the expected format
  const mappedCategories: Category[] = categorias
    .filter(cat => !cat.es_subcategoria)
    .map(cat => ({
      id: cat.id,
      name: cat.nombre,
      subcategories: categorias
        .filter(subcat => subcat.es_subcategoria && subcat.parent_id === cat.id && subcat.nivel === 2)
        .map(subcat => ({
          id: subcat.id,
          name: subcat.nombre,
          parent_id: cat.id,
          level3: categorias
            .filter(level3 => level3.es_subcategoria && level3.parent_id === subcat.id && level3.nivel === 3)
            .map(level3 => ({
              id: level3.id,
              name: level3.nombre,
              parent_id: subcat.id
            }))
        }))
    }));

  const mappedCompanies: Company[] = companias.map(comp => ({
    id: comp.id,
    name: comp.nombre
  }));

  // Log mapping information for debugging
  useEffect(() => {
    console.log("ProductCreate - Categories mapping:", {
      rawCategoriesCount: categorias.length,
      mappedCategoriesCount: mappedCategories.length,
      mappedCategories: mappedCategories.map(c => ({ 
        id: c.id, 
        name: c.name,
        subcategories: c.subcategories.map(s => ({ id: s.id, name: s.name }))
      }))
    });
  }, [categorias, mappedCategories]);

  // Initialize form when product changes
  useEffect(() => {
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
  }, [currentProduct, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Submitting product form with data:", formData);
      const success = await saveProducto(formData);
      if (success) {
        toast.success(currentProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        navigate('/productos');
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
    <div className="space-y-6 animate-slideInUp">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/productos')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">{pageTitle}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProductBasicInfo
              name={formData.nombre}
              categoryId={formData.categoria || 0}
              subcategoryId={formData.subcategoria_id || 0}
              level3CategoryId={formData.nivel3_id}
              categories={mappedCategories}
              onInputChange={(e) => handleInputChange({
                target: { name: 'nombre', value: e.target.value }
              } as React.ChangeEvent<HTMLInputElement>)}
              onCategoryChange={handleCategoryChange}
              onSubcategoryChange={handleSubcategoryChange}
              onLevel3Change={handleLevel3Change}
            />
            
            <ProductDescriptionEditor
              description={formData.descripcion || ''}
              strengths={formData.fortalezas || ''}
              weaknesses={formData.debilidades || ''}
              observations={formData.observaciones || ''}
              onWysiwygChange={handleWysiwygChange}
            />
            
            <ProductCompanies
              companies={mappedCompanies}
              selectedCompanies={formData.companias || []}
              onCompanyChange={handleCompanyChange}
            />
            
            <ProductFeatures
              features={formData.caracteristicas || []}
              onFeatureChange={handleFeatureChange}
              addFeature={addFeature}
              removeFeature={removeFeature}
            />
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate('/productos')} 
                disabled={isLoading}
              >
                Cancelar
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCreate;
