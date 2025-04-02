import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  FileImage, 
  Download, 
  Trash, 
  Package,
  Edit 
} from 'lucide-react';
import { toast } from 'sonner';
import { useProductos } from '@/hooks/useProductos';
import { ProductoFormData } from '@/types/database';

// Mock data for product categories
const productCategories = [
  { id: 1, name: 'Automóvil' },
  { id: 2, name: 'Hogar' },
  { id: 3, name: 'Vida' },
];

const Products = () => {
  const { 
    productos, 
    filteredProductos, 
    isLoading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    categoria,
    setCategoria,
    filtrosActivos,
    setFiltrosActivos,
    createProducto, 
    updateProducto, 
    deleteProducto, 
    refetch 
  } = useProductos();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [newProduct, setNewProduct] = useState<ProductoFormData>({
    nombre: '',
    descripcion: '',
    imagen_url: '',
    categoria: '',
    precio: 0,
    stock: 0,
  });

  // Handle input changes for the new product form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setNewProduct({
      ...newProduct,
      categoria: value
    });
    setCategoria(value);
    setFiltrosActivos(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formMode === 'create') {
      createProducto.mutate(newProduct, {
        onSuccess: () => {
          setDialogOpen(false);
          setNewProduct({
            nombre: '',
            descripcion: '',
            imagen_url: '',
            categoria: '',
            precio: 0,
            stock: 0,
          });
          refetch();
          toast.success('Producto creado correctamente');
        },
        onError: (error) => {
          toast.error(`Error al crear producto: ${error.message}`);
        }
      });
    } else if (formMode === 'edit' && currentProduct) {
      updateProducto.mutate({
        id: currentProduct.id,
        data: newProduct
      }, {
        onSuccess: () => {
          setDialogOpen(false);
          setNewProduct({
            nombre: '',
            descripcion: '',
            imagen_url: '',
            categoria: '',
            precio: 0,
            stock: 0,
          });
          refetch();
          toast.success('Producto actualizado correctamente');
        },
        onError: (error) => {
          toast.error(`Error al actualizar producto: ${error.message}`);
        }
      });
    }
  };

  // Handle product deletion
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProducto.mutate(id, {
        onSuccess: () => {
          toast.success('Producto eliminado correctamente');
          refetch();
        },
        onError: (error) => {
          toast.error(`Error al eliminar producto: ${error.message}`);
        }
      });
    }
  };

  const handleEdit = (product: any) => {
    setFormMode('edit');
    setCurrentProduct(product);
    setNewProduct({
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      imagen_url: product.imagen_url || '',
      categoria: product.categoria || '',
      precio: product.precio || 0,
      stock: product.stock || 0,
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setFormMode('create');
    setCurrentProduct(null);
    setNewProduct({
      nombre: '',
      descripcion: '',
      imagen_url: '',
      categoria: '',
      precio: 0,
      stock: 0,
    });
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!filtrosActivos) {
      setCategoria(null);
    }
  }, [filtrosActivos]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error al cargar productos: {error.message}</div>;
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header with search and buttons */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <Select 
            value={categoria || ''} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por categoría" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              {productCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir producto
          </Button>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductos.length > 0 ? (
          filteredProductos.map(product => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileImage className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-2">{product.nombre}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.descripcion}</p>
                  
                  <div className="mt-auto space-y-2 text-sm">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{product.categoria || 'Sin categoría'}</span>
                      </div>
                      <div className="text-primary">Stock: {product.stock}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>Precio: {product.precio}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileImage className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="mt-4 text-lg font-medium">No se encontraron productos</h3>
            <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o añade un nuevo producto</p>
          </div>
        )}
      </div>

      {/* Add/Edit product dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? 'Añadir producto' : 'Editar producto'}</DialogTitle>
            <DialogDescription>
              {formMode === 'create' ? 'Añade un nuevo producto al sistema' : 'Edita la información del producto'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={newProduct.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  value={newProduct.descripcion || ''}
                  onChange={handleInputChange}
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imagen_url">URL de la imagen</Label>
                <Input
                  id="imagen_url"
                  name="imagen_url"
                  value={newProduct.imagen_url || ''}
                  onChange={handleInputChange}
                  placeholder="URL de la imagen del producto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={newProduct.categoria || ''}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  name="precio"
                  type="number"
                  value={newProduct.precio?.toString() || ''}
                  onChange={handleInputChange}
                  placeholder="Precio del producto"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={newProduct.stock?.toString() || ''}
                  onChange={handleInputChange}
                  placeholder="Stock del producto"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {formMode === 'create' ? 'Añadir producto' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
