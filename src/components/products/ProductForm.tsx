
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import ProductBasicInfo from './form/ProductBasicInfo';
import ProductDescriptionEditor from './form/ProductDescriptionEditor';
import ProductFeatures from './form/ProductFeatures';
import ProductCompanies from './form/ProductCompanies';

type Category = {
  id: number;
  name: string;
  subcategories: Subcategory[];
};

type Subcategory = {
  id: number;
  name: string;
  parent_id: number;
  level3: Level3Category[];
};

type Level3Category = {
  id: number;
  name: string;
  parent_id: number;
};

type Company = {
  id: string;
  name: string;
};

type FormData = {
  name: string;
  description: string;
  categoryId: number;
  subcategoryId: number;
  level3CategoryId?: number;
  companies: string[];
  features: string[];
  strengths?: string;
  weaknesses?: string;
  observations?: string;
};

type ProductFormProps = {
  formData: FormData;
  categories: Category[];
  companies: Company[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onWysiwygChange: (name: string, content: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLevel3Change: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onFeatureChange: (index: number, value: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  isLoading?: boolean;
};

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
