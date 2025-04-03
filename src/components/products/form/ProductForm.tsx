
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import ProductBasicInfo from './ProductBasicInfo';
import ProductDescriptionEditor from './ProductDescriptionEditor';
import ProductFeatures from './ProductFeatures';
import ProductCompanies from './ProductCompanies';
import { ProductFormProps } from '@/types/product';

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  categories,
  companies,
  onSubmit,
  onCancel,
  onInputChange,
  onTextAreaChange,
  onWysiwygChange,
  onCategoryChange,
  onSubcategoryChange,
  onLevel3Change,
  onCompanyChange,
  onFeatureChange,
  addFeature,
  removeFeature,
  isLoading = false
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProductBasicInfo
        name={formData.name}
        categoryId={formData.categoryId}
        subcategoryId={formData.subcategoryId}
        level3CategoryId={formData.level3CategoryId}
        categories={categories}
        onInputChange={onInputChange}
        onCategoryChange={onCategoryChange}
        onSubcategoryChange={onSubcategoryChange}
        onLevel3Change={onLevel3Change}
      />
      
      <ProductDescriptionEditor
        description={formData.description}
        strengths={formData.strengths}
        weaknesses={formData.weaknesses}
        observations={formData.observations}
        onWysiwygChange={onWysiwygChange}
      />
      
      <ProductCompanies
        companies={companies}
        selectedCompanies={formData.companies}
        onCompanyChange={onCompanyChange}
      />
      
      <ProductFeatures
        features={formData.features}
        onFeatureChange={onFeatureChange}
        addFeature={addFeature}
        removeFeature={removeFeature}
      />
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
