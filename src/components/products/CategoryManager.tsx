
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import CategoryHeader from './category/CategoryHeader';
import CategoryList from './category/CategoryList';
import CategoryForm from './category/CategoryForm';

type Level3Category = {
  id: number;
  name: string;
  parent_id: number;
};

type Subcategory = {
  id: number;
  name: string;
  parent_id: number;
  level3: Level3Category[];
};

type Category = {
  id: number;
  name: string;
  subcategories: Subcategory[];
};

type CategoryFormData = {
  level: 'category' | 'subcategory' | 'level3';
  name: string;
  parentCategoryId?: number;
  parentSubcategoryId?: number;
};

type CategoryManagerProps = {
  categories: Category[]; 
  activeCategoryTab: string;
  expandedCategories: number[];
  expandedSubcategories: number[];
  onTabChange: (value: string) => void;
  onToggleCategoryExpansion: (categoryId: number) => void;
  onToggleSubcategoryExpansion: (subcategoryId: number) => void;
  onDeleteCategory: (id: number) => void;
  onDeleteSubcategory: (categoryId: number, subcategoryId: number) => void;
  onDeleteLevel3: (categoryId: number, subcategoryId: number, level3Id: number) => void;
  onCategorySubmit: (formData: CategoryFormData) => void;
};

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  activeCategoryTab,
  expandedCategories,
  expandedSubcategories,
  onTabChange,
  onToggleCategoryExpansion,
  onToggleSubcategoryExpansion,
  onDeleteCategory,
  onDeleteSubcategory,
  onDeleteLevel3,
  onCategorySubmit
}) => {
  return (
    <Tabs value={activeCategoryTab} onValueChange={onTabChange} className="space-y-4">
      <CategoryHeader 
        activeCategoryTab={activeCategoryTab} 
        onTabChange={onTabChange} 
      />
      
      <TabsContent value="list" className="space-y-4">
        <CategoryList 
          categories={categories}
          expandedCategories={expandedCategories}
          expandedSubcategories={expandedSubcategories}
          onToggleCategoryExpansion={onToggleCategoryExpansion}
          onToggleSubcategoryExpansion={onToggleSubcategoryExpansion}
          onDeleteCategory={onDeleteCategory}
          onDeleteSubcategory={onDeleteSubcategory}
          onDeleteLevel3={onDeleteLevel3}
        />
      </TabsContent>
      
      <TabsContent value="add" className="space-y-4">
        <CategoryForm 
          categories={categories}
          onCategorySubmit={onCategorySubmit}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CategoryManager;
