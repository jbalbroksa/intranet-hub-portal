
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

type Category = {
  id: number;
  name: string;
  subcategories: {
    id: number;
    name: string;
    parent_id: number;
    level3: {
      id: number;
      name: string;
      parent_id: number;
    }[];
  }[];
};

type ProductBasicInfoProps = {
  name: string;
  categoryId: number;
  subcategoryId: number;
  level3CategoryId?: number;
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
    const category = categories.find(c => c.id === categoryId);
    return category ? category.subcategories : [];
  };

  // Helper function to get available level3 categories based on selected subcategory
  const getAvailableLevel3Categories = () => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];
    
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.level3 : [];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Producto</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={categoryId ? categoryId.toString() : "0"}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Seleccionar categoría</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subcategory">Subcategoría</Label>
        <Select
          value={subcategoryId ? subcategoryId.toString() : "0"}
          onValueChange={onSubcategoryChange}
          disabled={!categoryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar subcategoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Seleccionar subcategoría</SelectItem>
            {getAvailableSubcategories().map(subcategory => (
              <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                {subcategory.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="level3">Nivel 3 (Opcional)</Label>
        <Select
          value={level3CategoryId ? level3CategoryId.toString() : "0"}
          onValueChange={onLevel3Change}
          disabled={!subcategoryId || getAvailableLevel3Categories().length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar nivel 3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Ninguno</SelectItem>
            {getAvailableLevel3Categories().map(level3 => (
              <SelectItem key={level3.id} value={level3.id.toString()}>
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
