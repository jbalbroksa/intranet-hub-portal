
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <Tabs value={activeCategoryTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        <TabsTrigger value="list">Explorar Categorías</TabsTrigger>
        <TabsTrigger value="add">Añadir Categoría</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Estructura de Categorías</h3>
          
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category.id}>
                <Collapsible 
                  open={expandedCategories.includes(category.id)}
                  onOpenChange={() => onToggleCategoryExpansion(category.id)}
                >
                  <div className="flex items-center justify-between rounded-md hover:bg-muted p-2">
                    <div className="flex items-center">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategories.includes(category.id) ? 'rotate-90' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      <span className="ml-2 font-medium">{category.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCategory(category.id)}
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CollapsibleContent>
                    <ul className="pl-6 mt-1 space-y-1">
                      {category.subcategories.map(subcategory => (
                        <li key={subcategory.id}>
                          <Collapsible
                            open={expandedSubcategories.includes(subcategory.id)}
                            onOpenChange={() => onToggleSubcategoryExpansion(subcategory.id)}
                          >
                            <div className="flex items-center justify-between rounded-md hover:bg-muted p-2">
                              <div className="flex items-center">
                                {subcategory.level3.length > 0 ? (
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedSubcategories.includes(subcategory.id) ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </CollapsibleTrigger>
                                ) : (
                                  <div className="w-6" />
                                )}
                                <span className="ml-1">{subcategory.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteSubcategory(category.id, subcategory.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            
                            {subcategory.level3.length > 0 && (
                              <CollapsibleContent>
                                <ul className="pl-8 mt-1 space-y-1">
                                  {subcategory.level3.map(level3 => (
                                    <li key={level3.id} className="flex items-center justify-between rounded-md hover:bg-muted p-2">
                                      <span className="text-sm">{level3.name}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDeleteLevel3(category.id, subcategory.id, level3.id)}
                                        className="h-5 w-5 p-0"
                                      >
                                        <Trash className="h-3 w-3" />
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                              </CollapsibleContent>
                            )}
                          </Collapsible>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            ))}
          </ul>
        </Card>
      </TabsContent>
      
      <TabsContent value="add" className="space-y-4">
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
            
            {formData.level !== 'category' && (
              <div className="space-y-2">
                <Label htmlFor="parentCategory">Categoría Principal</Label>
                <Select
                  value={formData.parentCategoryId?.toString() || ""}
                  onValueChange={handleParentCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría principal" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {formData.level === 'level3' && formData.parentCategoryId && (
              <div className="space-y-2">
                <Label htmlFor="parentSubcategory">Subcategoría</Label>
                <Select
                  value={formData.parentSubcategoryId?.toString() || ""}
                  onValueChange={handleParentSubcategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar subcategoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .find(c => c.id === formData.parentCategoryId)
                      ?.subcategories.map(subcategory => (
                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
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
      </TabsContent>
    </Tabs>
  );
};

export default CategoryManager;
