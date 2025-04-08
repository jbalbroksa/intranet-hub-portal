
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Category } from '@/types/product';

type ProductBasicInfoProps = {
  name: string;
  categoryId: string | number;
  subcategoryId: string | number;
  level3CategoryId?: string | number;
  categories: Category[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLevel3Change: (value: string) => void;
};

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  name,
  categoryId,
  subcategoryId,
  level3CategoryId,
  categories,
  onInputChange,
  onCategoryChange,
  onSubcategoryChange,
  onLevel3Change
}) => {
  // Helper function to get available subcategories based on selected category
  const getAvailableSubcategories = () => {
    const category = categories.find(c => c.id.toString() === categoryId.toString());
    return category ? category.subcategories : [];
  };

  // Helper function to get available level3 categories based on selected subcategory
  const getAvailableLevel3Categories = () => {
    const category = categories.find(c => c.id.toString() === categoryId.toString());
    if (!category) return [];
    
    const subcategory = category.subcategories.find(s => s.id.toString() === subcategoryId.toString());
    return subcategory ? subcategory.level3 : [];
  };

  // Convert category and subcategory ids to strings for select component
  const categoryIdStr = categoryId ? categoryId.toString() : "0";
  const subcategoryIdStr = subcategoryId ? subcategoryId.toString() : "0";
  const level3CategoryIdStr = level3CategoryId ? level3CategoryId.toString() : "0";

  // Debug logging to help identify issues
  useEffect(() => {
    console.log("ProductBasicInfo - Current state:", {
      categoryId, 
      categoryIdStr,
      subcategoryId, 
      subcategoryIdStr,
      level3CategoryId,
      level3CategoryIdStr,
      categoriesCount: categories.length,
      availableSubcategories: getAvailableSubcategories().length,
      availableLevel3: getAvailableLevel3Categories().length
    });
  }, [categoryId, subcategoryId, level3CategoryId, categories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Producto</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onInputChange}
          placeholder="Ingrese el nombre del producto"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={categoryIdStr}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Seleccionar categoría</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id.toString()} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subcategory">Subcategoría</Label>
        <Select
          value={subcategoryIdStr}
          onValueChange={onSubcategoryChange}
          disabled={!categoryId || categoryId === "0" || categoryId === 0}
        >
          <SelectTrigger id="subcategory">
            <SelectValue placeholder="Seleccionar subcategoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Seleccionar subcategoría</SelectItem>
            {getAvailableSubcategories().map(subcategory => (
              <SelectItem key={subcategory.id.toString()} value={subcategory.id.toString()}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="level3">Nivel 3 (Opcional)</Label>
        <Select
          value={level3CategoryIdStr}
          onValueChange={onLevel3Change}
          disabled={!subcategoryId || subcategoryId === "0" || subcategoryId === 0 || getAvailableLevel3Categories().length === 0}
        >
          <SelectTrigger id="level3">
            <SelectValue placeholder="Seleccionar nivel 3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Ninguno</SelectItem>
            {getAvailableLevel3Categories().map(level3 => (
              <SelectItem key={level3.id.toString()} value={level3.id.toString()}>
                {level3.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
