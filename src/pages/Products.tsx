import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash, Filter, ChevronRight, Package } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mock data for categories and subcategories
const mockCategories = [
  { 
    id: 1, 
    name: 'Automóvil', 
    subcategories: [
      { id: 1, name: 'Todo Riesgo' },
      { id: 2, name: 'Terceros' },
      { id: 3, name: 'Terceros Ampliado' },
    ]
  },
  { 
    id: 2, 
    name: 'Hogar', 
    subcategories: [
      { id: 4, name: 'Básico' },
      { id: 5, name: 'Completo' },
      { id: 6, name: 'Premium' },
    ]
  },
  { 
    id: 3, 
    name: 'Vida', 
    subcategories: [
      { id: 7, name: 'Temporal' },
      { id: 8, name: 'Ahorro' },
      { id: 9, name: 'Inversión' },
    ]
  },
];

// Mock data for companies
const mockCompanies = [
  { id: 1, name: 'Mapfre' },
  { id: 2, name: 'Allianz' },
  { id: 3, name: 'AXA' },
  { id: 4, name: 'Generali' },
  { id: 5, name: 'Zurich' },
];

// Mock data for products
const mockProducts = [
  { id: 1, name: 'Seguro Todo Riesgo Plus', description: 'Seguro a todo riesgo con las mejores coberturas', categoryId: 1, subcategoryId: 1, companies: [1, 3], features: ['Asistencia 24h', 'Vehículo de sustitución', 'Daños propios'] },
  { id: 2, name: 'Seguro Hogar Completo', description: 'Protección integral para tu hogar', categoryId: 2, subcategoryId: 5, companies: [2, 5], features: ['Daños por agua', 'Robo', 'Responsabilidad civil'] },
  { id: 3, name: 'Seguro de Vida Ahorro', description: 'Asegura tu futuro y el de tu familia', categoryId: 3, subcategoryId: 8, companies: [1, 4], features: ['Capital garantizado', 'Flexibilidad', 'Fiscalidad ventajosa'] },
  { id: 4, name: 'Terceros Ampliado', description: 'Seguro a terceros con coberturas adicionales', categoryId: 1, subcategoryId: 3, companies: [3, 5], features: ['Lunas', 'Robo', 'Incendio'] },
  { id: 5, name: 'Hogar Básico', description: 'Cobertura esencial para tu vivienda', categoryId: 2, subcategoryId: 4, companies: [2, 3], features: ['Incendio', 'Daños por agua', 'Responsabilidad civil'] },
];

type Category = {
  id: number;
  name: string;
  subcategories: Subcategory[];
};

type Subcategory = {
  id: number;
  name: string;
};

type Company = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  subcategoryId: number;
  companies: number[];
  features: string[];
};

type FormMode = 'create' | 'edit';

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);
  const [companies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<number | null>(null);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    categoryId: 0,
    subcategoryId: 0,
    companies: [],
    features: [],
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === null || product.categoryId === selectedCategoryFilter;
    
    const matchesSubcategory = selectedSubcategoryFilter === null || product.subcategoryId === selectedSubcategoryFilter;
    
    const matchesCompany = selectedCompanyFilter === null || product.companies.includes(selectedCompanyFilter);
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesCompany;
  });

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prevExpanded => 
      prevExpanded.includes(categoryId)
        ? prevExpanded.filter(id => id !== categoryId)
        : [...prevExpanded, categoryId]
    );
  };

  // Handle category filter selection
  const handleCategoryFilter = (categoryId: number) => {
    setSelectedCategoryFilter(prevCategory => prevCategory === categoryId ? null : categoryId);
    setSelectedSubcategoryFilter(null);
  };

  // Handle subcategory filter selection
  const handleSubcategoryFilter = (subcategoryId: number) => {
    setSelectedSubcategoryFilter(prevSubcategory => prevSubcategory === subcategoryId ? null : subcategoryId);
  };

  // Handle company filter selection
  const handleCompanyFilter = (companyId: number) => {
    setSelectedCompanyFilter(prevCompany => prevCompany === companyId ? null : companyId);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategoryFilter(null);
    setSelectedSubcategoryFilter(null);
    setSelectedCompanyFilter(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle category selection in form
  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    setFormData({
      ...formData,
      categoryId,
      subcategoryId: 0, // Reset subcategory when category changes
    });
  };

  // Handle subcategory selection in form
  const handleSubcategoryChange = (value: string) => {
    const subcategoryId = parseInt(value);
    setFormData({
      ...formData,
      subcategoryId,
    });
  };

  // Handle company selection in form
  const handleCompanyChange = (value: string) => {
    const companyId = parseInt(value);
    setFormData({
      ...formData,
      companies: formData.companies.includes(companyId)
        ? formData.companies.filter(id => id !== companyId)
        : [...formData.companies, companyId],
    });
  };

  // Handle feature input
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  // Add a new feature field
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  // Remove a feature field
  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: 0,
      subcategoryId: 0,
      companies: [],
      features: [''],
    });
  };

  // Open dialog for creating a new product
  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing an existing product
  const openEditDialog = (product: Product) => {
    setFormMode('edit');
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      companies: [...product.companies],
      features: [...product.features],
    });
    setDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      // Create new product
      const newProduct: Product = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''), // Remove empty features
      };
      setProducts([...products, newProduct]);
    } else if (formMode === 'edit' && currentProduct) {
      // Update existing product
      const updatedProducts = products.map(product => 
        product.id === currentProduct.id 
          ? { 
              ...product, 
              ...formData,
              features: formData.features.filter(f => f.trim() !== ''), // Remove empty features
            } 
          : product
      );
      setProducts(updatedProducts);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  // Handle product deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  // Get subcategory name by id
  const getSubcategoryName = (categoryId: number, subcategoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 'Sin subcategoría';
    
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : 'Sin subcategoría';
  };

  // Get company names by ids
  const getCompanyNames = (companyIds: number[]) => {
    return companyIds.map(id => {
      const company = companies.find(c => c.id === id);
      return company ? company.name : '';
    }).filter(Boolean).join(', ');
  };

  // Get available subcategories for the selected category
  const getAvailableSubcategories = () => {
    const category = categories.find(c => c.id === formData.categoryId);
    return category ? category.subcategories : [];
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filtros</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpiar
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Categories filter */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Categorías</h4>
                    <ul className="space-y-1">
                      {categories.map(category => (
                        <li key={category.id}>
                          <Collapsible 
                            open={expandedCategories.includes(category.id)}
                            onOpenChange={() => toggleCategoryExpansion(category.id)}
                          >
                            <div className="flex items-center">
                              <button 
                                type="button"
                                className={`text-sm flex items-center justify-between w-full px-2 py-1.5 rounded-md ${selectedCategoryFilter === category.id ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted'}`}
                                onClick={() => handleCategoryFilter(category.id)}
                              >
                                <span>{category.name}</span>
                              </button>
                              
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                                  <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategories.includes(category.id) ? 'rotate-90' : ''}`} />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                            
                            <CollapsibleContent>
                              <ul className="pl-4 mt-1 space-y-1">
                                {category.subcategories.map(subcategory => (
                                  <li key={subcategory.id}>
                                    <button 
                                      type="button"
                                      className={`text-sm w-full text-left px-2 py-1.5 rounded-md ${selectedSubcategoryFilter === subcategory.id ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted'}`}
                                      onClick={() => handleSubcategoryFilter(subcategory.id)}
                                    >
                                      {subcategory.name}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </CollapsibleContent>
                          </Collapsible>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Companies filter */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Compañías</h4>
                    <ul className="space-y-1">
                      {companies.map(company => (
                        <li key={company.id}>
                          <button 
                            type="button"
                            className={`text-sm w-full text-left px-2 py-1.5 rounded-md ${selectedCompanyFilter === company.id ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted'}`}
                            onClick={() => handleCompanyFilter(company.id)}
                          >
                            {company.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Products list */}
        <div className="md:col-span-3 space-y-4">
          {/* Search and actions */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-9"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
          
          {/* Products table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="hidden md:table-cell">Compañías</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>
                            <div>{getCategoryName(product.categoryId)}</div>
                            <div className="text-sm text-muted-foreground">{getSubcategoryName(product.categoryId, product.subcategoryId)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{getCompanyNames(product.companies)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Crear nuevo producto' : 'Editar producto'}
            </DialogTitle>
            <DialogDescription>
              Complete todos los campos para {formMode === 'create' ? 'crear un nuevo' : 'actualizar el'} producto.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select 
                    value={formData.categoryId ? formData.categoryId.toString() : "0"} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategoría</Label>
                  <Select 
                    value={formData.subcategoryId ? formData.subcategoryId.toString() : "0"} 
                    onValueChange={handleSubcategoryChange}
                    disabled={!formData.categoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSubcategories().map(subcategory => (
                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Compañías</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {companies.map(company => (
                    <div key={company.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`company-${company.id}`}
                        checked={formData.companies.includes(company.id)}
                        onChange={() => handleCompanyChange(company.id.toString())}
                        className="rounded border-input"
                      />
                      <Label htmlFor={`company-${company.id}`} className="cursor-pointer">
                        {company.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Características</Label>
                <div className="space-y-2">
                  {formData.features.length === 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addFeature}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir característica
                    </Button>
                  )}
                  
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Característica del producto"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="flex-shrink-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {formData.features.length > 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addFeature}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir otra
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {formMode === 'create' ? 'Crear' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
