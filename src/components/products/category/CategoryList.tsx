
import React from 'react';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trash } from 'lucide-react';

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

type CategoryListProps = {
  categories: Category[];
  expandedCategories: number[];
  expandedSubcategories: number[];
  onToggleCategoryExpansion: (categoryId: number) => void;
  onToggleSubcategoryExpansion: (subcategoryId: number) => void;
  onDeleteCategory: (id: number) => void;
  onDeleteSubcategory: (categoryId: number, subcategoryId: number) => void;
  onDeleteLevel3: (categoryId: number, subcategoryId: number, level3Id: number) => void;
};

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  expandedCategories,
  expandedSubcategories,
  onToggleCategoryExpansion,
  onToggleSubcategoryExpansion,
  onDeleteCategory,
  onDeleteSubcategory,
  onDeleteLevel3
}) => {
  return (
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
  );
};

export default CategoryList;
