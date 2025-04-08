
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

type CategoryFormData = {
  level: 'category' | 'subcategory' | 'level3';
  name: string;
  parentCategoryId?: number;
  parentSubcategoryId?: number;
};

type Category = {
  id: number;
  name: string;
  subcategories: any[]; // Simplified for the form component
};

type CategoryFormProps = {
  categories: Category[];
  onCategorySubmit: (formData: CategoryFormData) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  categories,
  onCategorySubmit
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    level: 'category',
    name: '',
  });

  const handleCategoryLevelChange = (level: 'category' | 'subcategory' | 'level3') => {
    setFormData({
      ...formData,
      level,
      ...(level === 'category' ? { parentCategoryId: undefined, parentSubcategoryId: undefined } : {}),
    });
  };

  const handleParentCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    setFormData({
      ...formData,
      parentCategoryId: categoryId,
      parentSubcategoryId: undefined,
    });
  };

  const handleParentSubcategoryChange = (value: string) => {
    const subcategoryId = parseInt(value);
    setFormData({
      ...formData,
      parentSubcategoryId: subcategoryId,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (formData.level === 'subcategory' && !formData.parentCategoryId) {
      toast.error("Debe seleccionar una categoría padre");
      return;
    }

    if (formData.level === 'level3' && (!formData.parentCategoryId || !formData.parentSubcategoryId)) {
      toast.error("Debe seleccionar una categoría y subcategoría padre");
      return;
    }

    // Submit the form
    onCategorySubmit(formData);
    
    // Reset form
    setFormData({
      level: 'category',
      name: '',
    });
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Añadir Nueva Categoría</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={formData.level === 'category' ? 'default' : 'outline'}
              onClick={() => handleCategoryLevelChange('category')}
            >
              Categoría Principal
            </Button>
            <Button
              type="button"
              variant={formData.level === 'subcategory' ? 'default' : 'outline'}
              onClick={() => handleCategoryLevelChange('subcategory')}
            >
              Subcategoría
            </Button>
            <Button
              type="button"
              variant={formData.level === 'level3' ? 'default' : 'outline'}
              onClick={() => handleCategoryLevelChange('level3')}
            >
              Nivel 3
            </Button>
          </div>
        </div>
        
        {/* Parent category selector */}
        {/* Form fields would go here - simplified for brevity */}
        
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Nombre de la categoría"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CategoryForm;
