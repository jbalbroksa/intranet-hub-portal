
export type Category = {
  id: string | number;
  name: string;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string | number;
  name: string;
  parent_id: string | number;
  level3: Level3Category[];
};

export type Level3Category = {
  id: string | number;
  name: string;
  parent_id: string | number;
};

export type Company = {
  id: string;
  name: string;
};

export type ProductFormData = {
  name: string;
  description: string;
  categoryId: string | number;
  subcategoryId: string | number;
  level3CategoryId?: string | number;
  companies: string[];
  features?: string[];
  strengths?: string;
  weaknesses?: string;
  observations?: string;
};

export type ProductFormProps = {
  formData: ProductFormData;
  categories: Category[];
  companies: Company[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextAreaChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onWysiwygChange: (name: string, content: string) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLevel3Change: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onFeatureChange?: (index: number, value: string) => void;
  addFeature?: () => void;
  removeFeature?: (index: number) => void;
  isLoading?: boolean;
};

// Add this type for Products.tsx
export type Product = {
  id: string | number;
  name: string;
  description: string;
  categoryId: string | number;
  subcategoryId: string | number;
  level3CategoryId?: string | number;
  companies: string[];
  features: string[];
  strengths?: string;
  weaknesses?: string;
  observations?: string;
};
