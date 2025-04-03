
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Plus, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoriaProductos } from '@/hooks/useCategoriaProductos';
import { toast } from 'sonner';

const CategoriesManager = () => {
  const {
    categorias,
    categoriasOrganizadas,
    loadingCategorias,
    categoriasError,
    activeCategoryTab,
    setActiveCategoryTab,
    expandedCategories,
    expandedSubcategories,
    toggleCategoryExpansion,
    toggleSubcategoryExpansion,
    categoryFormData,
    handleCategoryFormChange,
    handleCategorySubmit,
    handleDeleteCategory,
    getNivel3Categories
  } = useCategoriaProductos();

  if (loadingCategorias) {
    return <div className="py-4">Cargando categorías...</div>;
  }

  if (categoriasError) {
    return <div className="py-4 text-red-500">Error al cargar categorías: {categoriasError.message}</div>;
  }

  return (
    <Tabs value={activeCategoryTab} onValueChange={setActiveCategoryTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="list">Explorar Categorías</TabsTrigger>
        <TabsTrigger value="add">Añadir Categoría</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Estructura de Categorías</h3>
          
          <ul className="space-y-2">
            {categoriasOrganizadas.length > 0 ? (
              categoriasOrganizadas.map(category => (
                <li key={category.id}>
                  <Collapsible 
                    open={expandedCategories.includes(category.id)}
                    onOpenChange={() => toggleCategoryExpansion(category.id)}
                  >
                    <div className="flex items-center justify-between rounded-md hover:bg-muted p-2">
                      <div className="flex items-center">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategories.includes(category.id) ? 'rotate-90' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <span className="ml-2 font-medium">{category.nombre}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="h-7 w-7 p-0 hover:opacity-100"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CollapsibleContent>
                      <ul className="pl-6 mt-1 space-y-1">
                        {category.subcategorias.map(subcategory => (
                          <li key={subcategory.id}>
                            <Collapsible
                              open={expandedSubcategories.includes(subcategory.id)}
                              onOpenChange={() => toggleSubcategoryExpansion(subcategory.id)}
                            >
                              <div className="flex items-center justify-between rounded-md hover:bg-muted p-2">
                                <div className="flex items-center">
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                      <ChevronRight className={`h-4 w-4 transition-transform ${expandedSubcategories.includes(subcategory.id) ? 'rotate-90' : ''}`} />
                                    </Button>
                                  </CollapsibleTrigger>
                                  <span className="ml-2">{subcategory.nombre}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCategory(subcategory.id)}
                                  className="h-7 w-7 p-0 hover:opacity-100"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <CollapsibleContent>
                                <ul className="pl-6 mt-1 space-y-1">
                                  {getNivel3Categories(subcategory.id).map(nivel3 => (
                                    <li key={nivel3.id}>
                                      <div className="flex items-center justify-between rounded-md hover:bg-muted p-2">
                                        <div className="flex items-center">
                                          <span className="ml-2 text-sm">{nivel3.nombre}</span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteCategory(nivel3.id)}
                                          className="h-7 w-7 p-0 hover:opacity-100"
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </CollapsibleContent>
                            </Collapsible>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              ))
            ) : (
              <p className="text-muted-foreground py-4">No hay categorías disponibles. Añade una nueva categoría.</p>
            )}
          </ul>
        </Card>
      </TabsContent>
      
      <TabsContent value="add" className="space-y-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            {categoryFormData.parentId 
              ? (categoryFormData.nivel === 2 ? 'Añadir Subcategoría' : 'Añadir Categoría Nivel 3') 
              : 'Añadir Categoría Principal'}
          </h3>
          
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parent">Categoría Padre (Opcional)</Label>
              <Select 
                value={categoryFormData.parentId || ''} 
                onValueChange={(value) => {
                  const selectedCategory = categorias.find(cat => cat.id === value);
                  const newNivel = selectedCategory?.nivel === 2 ? 3 : 2;
                  
                  handleCategoryFormChange('parentId', value || null);
                  handleCategoryFormChange('nivel', newNivel.toString());
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ninguna (Categoría Principal)</SelectItem>
                  {/* Solo mostrar categorías principales y subcategorías como posibles padres */}
                  {categorias
                    .filter(cat => !cat.es_subcategoria || (cat.es_subcategoria && cat.nivel === 2))
                    .map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.es_subcategoria ? `└ ${cat.nombre}` : cat.nombre}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={categoryFormData.name}
                onChange={(e) => handleCategoryFormChange('name', e.target.value)}
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

export default CategoriesManager;
