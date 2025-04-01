
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

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
  id: number;
  name: string;
};

type FormData = {
  name: string;
  description: string;
  categoryId: number;
  subcategoryId: number;
  level3CategoryId?: number;
  companies: number[];
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
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
  onLevel3Change: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onFeatureChange: (index: number, value: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
};

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  categories,
  companies,
  onSubmit,
  onCancel,
  onInputChange,
  onTextAreaChange,
  onCategoryChange,
  onSubcategoryChange,
  onLevel3Change,
  onCompanyChange,
  onFeatureChange,
  addFeature,
  removeFeature
}) => {
  // Helper function to get available subcategories based on selected category
  const getAvailableSubcategories = () => {
    const category = categories.find(c => c.id === formData.categoryId);
    return category ? category.subcategories : [];
  };

  // Helper function to get available level3 categories based on selected subcategory
  const getAvailableLevel3Categories = () => {
    const category = categories.find(c => c.id === formData.categoryId);
    if (!category) return [];
    
    const subcategory = category.subcategories.find(s => s.id === formData.subcategoryId);
    return subcategory ? subcategory.level3 : [];
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Producto</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.categoryId ? formData.categoryId.toString() : "0"}
            onValueChange={onCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" disabled>Seleccionar categoría</SelectItem>
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
            value={formData.subcategoryId ? formData.subcategoryId.toString() : "0"}
            onValueChange={onSubcategoryChange}
            disabled={!formData.categoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar subcategoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0" disabled>Seleccionar subcategoría</SelectItem>
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
            value={formData.level3CategoryId ? formData.level3CategoryId.toString() : "0"}
            onValueChange={onLevel3Change}
            disabled={!formData.subcategoryId || getAvailableLevel3Categories().length === 0}
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
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onTextAreaChange}
          rows={2}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Compañías</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {companies.map(company => (
            <div key={company.id} className="flex items-center space-x-2">
              <Checkbox
                id={`company-${company.id}`}
                checked={formData.companies.includes(company.id)}
                onCheckedChange={() => onCompanyChange(company.id.toString())}
              />
              <Label htmlFor={`company-${company.id}`} className="cursor-pointer">
                {company.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Características</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            Añadir
          </Button>
        </div>
        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={feature}
                onChange={(e) => onFeatureChange(index, e.target.value)}
                placeholder={`Característica ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFeature(index)}
                className="h-10 w-10 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="strengths">Puntos Fuertes</Label>
          <Textarea
            id="strengths"
            name="strengths"
            value={formData.strengths || ''}
            onChange={onTextAreaChange}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weaknesses">Puntos Débiles</Label>
          <Textarea
            id="weaknesses"
            name="weaknesses"
            value={formData.weaknesses || ''}
            onChange={onTextAreaChange}
            rows={3}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observations">Observaciones</Label>
        <Textarea
          id="observations"
          name="observations"
          value={formData.observations || ''}
          onChange={onTextAreaChange}
          rows={3}
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
