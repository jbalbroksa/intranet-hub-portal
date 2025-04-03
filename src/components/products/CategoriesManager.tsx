
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Plus, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriaProducto } from '@/types/database';
import { useCategoriaProductos } from '@/hooks/useCategoriaProductos';
import { toast } from 'sonner';

const CategoriesManager = () => {
  const {
    categorias,
    loadingCategorias,
    categoriasError,
    activeCategoryTab,
    setActiveCategoryTab,
    expandedCategories,
    toggleCategoryExpansion,
    handleCategorySubmit,
    handleDeleteCategory
  } = useCategoriaProductos();

  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    handleCategorySubmit({ name: categoryName });
    setCategoryName('');
  };

  if (loadingCategorias) {
    return <div className="py-4">Cargando categorías...</div>;
  }

  if (categoriasError) {
    return <div className="py-4 text-red-500">Error al cargar categorías: {categoriasError.message}</div>;
  }

  // Map the categories for display
  const mappedCategories = categorias.map(cat => ({
    id: Number(cat.id),
    name: cat.nombre,
    subcategories: []
  }));

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
            {mappedCategories.length > 0 ? (
              mappedCategories.map(category => (
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
                        <span className="ml-2 font-medium">{category.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id.toString())}
                        className="h-7 w-7 p-0 hover:opacity-100"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
          <h3 className="text-lg font-medium mb-4">Añadir Nueva Categoría</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
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
