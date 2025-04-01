
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash, Filter, ChevronRight, Package, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Mock data for categories with three levels
const mockCategories = [
  { 
    id: 1, 
    name: 'Automóvil', 
    subcategories: [
      { 
        id: 1, 
        name: 'Todo Riesgo',
        parent_id: 1,
        level3: [
          { id: 1, name: 'Básico', parent_id: 1 },
          { id: 2, name: 'Ampliado', parent_id: 1 },
          { id: 3, name: 'Premium', parent_id: 1 },
        ] 
      },
      { 
        id: 2, 
        name: 'Terceros',
        parent_id: 1,
        level3: [
          { id: 4, name: 'Básico', parent_id: 2 },
          { id: 5, name: 'Ampliado', parent_id: 2 },
        ] 
      },
      { 
        id: 3, 
        name: 'Terceros Ampliado',
        parent_id: 1,
        level3: [] 
      },
    ]
  },
  { 
    id: 2, 
    name: 'Hogar', 
    subcategories: [
      { 
        id: 4, 
        name: 'Básico',
        parent_id: 2,
        level3: [] 
      },
      { 
        id: 5, 
        name: 'Completo',
        parent_id: 2,
        level3: [
          { id: 6, name: 'Estándar', parent_id: 5 },
          { id: 7, name: 'Plus', parent_id: 5 },
        ] 
      },
      { 
        id: 6, 
        name: 'Premium',
        parent_id: 2,
        level3: [] 
      },
    ]
  },
  { 
    id: 3, 
    name: 'Vida', 
    subcategories: [
      { 
        id: 7, 
        name: 'Temporal',
        parent_id: 3,
        level3: [] 
      },
      { 
        id: 8, 
        name: 'Ahorro',
        parent_id: 3,
        level3: [
          { id: 8, name: 'Estándar', parent_id: 8 },
          { id: 9, name: 'Premium', parent_id: 8 },
        ] 
      },
      { 
        id: 9, 
        name: 'Inversión',
        parent_id: 3,
        level3: [] 
      },
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

type Company = {
  id: number;
  name: string;
};

type FormMode = 'create' | 'edit';

// Updated Product type to include level3CategoryId
type Product = {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  subcategoryId: number;
  level3CategoryId?: number;
  companies: number[];
  features: string[];
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [companies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<number[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<number | null>(null);
  const [selectedLevel3Filter, setSelectedLevel3Filter] = useState<number | null>(null);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<number | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState('list');
  
  // Category form state
  const [categoryFormData, setCategoryFormData] = useState<{
    level: 'category' | 'subcategory' | 'level3',
    name: string,
    parentCategoryId?: number,
    parentSubcategoryId?: number
  }>({
    level: 'category',
    name: '',
  });
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    categoryId: 0,
    subcategoryId: 0,
    level3CategoryId: undefined,
    companies: [],
    features: [],
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term and filters - updated for 3 levels
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === null || product.categoryId === selectedCategoryFilter;
    
    const matchesSubcategory = selectedSubcategoryFilter === null || product.subcategoryId === selectedSubcategoryFilter;
    
    const matchesLevel3 = selectedLevel3Filter === null || product.level3CategoryId === selectedLevel3Filter;
    
    const matchesCompany = selectedCompanyFilter === null || product.companies.includes(selectedCompanyFilter);
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesLevel3 && matchesCompany;
  });

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prevExpanded => 
      prevExpanded.includes(categoryId)
        ? prevExpanded.filter(id => id !== categoryId)
        : [...prevExpanded, categoryId]
    );
  };

  // Toggle subcategory expansion
  const toggleSubcategoryExpansion = (subcategoryId: number) => {
    setExpandedSubcategories(prevExpanded => 
      prevExpanded.includes(subcategoryId)
        ? prevExpanded.filter(id => id !== subcategoryId)
        : [...prevExpanded, subcategoryId]
    );
  };

  // Handle category filter selection
  const handleCategoryFilter = (categoryId: number) => {
    setSelectedCategoryFilter(prevCategory => prevCategory === categoryId ? null : categoryId);
    setSelectedSubcategoryFilter(null);
    setSelectedLevel3Filter(null);
  };

  // Handle subcategory filter selection
  const handleSubcategoryFilter = (subcategoryId: number) => {
    setSelectedSubcategoryFilter(prevSubcategory => prevSubcategory === subcategoryId ? null : subcategoryId);
    setSelectedLevel3Filter(null);
  };

  // Handle company filter selection
  const handleCompanyFilter = (companyId: number) => {
    setSelectedCompanyFilter(prevCompany => prevCompany === companyId ? null : companyId);
  };

  // Handle level3 filter selection
  const handleLevel3Filter = (level3Id: number) => {
    setSelectedLevel3Filter(prevLevel3 => prevLevel3 === level3Id ? null : level3Id);
  };

  // Clear all filters - updated to include level3
  const clearFilters = () => {
    setSelectedCategoryFilter(null);
    setSelectedSubcategoryFilter(null);
    setSelectedLevel3Filter(null);
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

  // Handle category selection in form - reset subcategory and level3 when category changes
  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    setFormData({
      ...formData,
      categoryId,
      subcategoryId: 0,
      level3CategoryId: undefined,
    });
  };

  // Handle subcategory selection in form - reset level3 when subcategory changes
  const handleSubcategoryChange = (value: string) => {
    const subcategoryId = parseInt(value);
    setFormData({
      ...formData,
      subcategoryId,
      level3CategoryId: undefined,
    });
  };

  // Handle level3 selection in form
  const handleLevel3Change = (value: string) => {
    const level3Id = parseInt(value);
    setFormData({
      ...formData,
      level3CategoryId: level3Id,
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

  // Reset form data - updated to include level3CategoryId
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: 0,
      subcategoryId: 0,
      level3CategoryId: undefined,
      companies: [],
      features: [''],
    });
  };

  // Reset category form data
  const resetCategoryForm = () => {
    setCategoryFormData({
      level: 'category',
      name: '',
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
      level3CategoryId: product.level3CategoryId,
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

  // Open dialog for creating a new category
  const openCategoryDialog = () => {
    resetCategoryForm();
    setCategoryDialogOpen(true);
  };

  // Handle category level change
  const handleCategoryLevelChange = (level: 'category' | 'subcategory' | 'level3') => {
    setCategoryFormData({
      ...categoryFormData,
      level,
      ...(level === 'category' ? { parentCategoryId: undefined, parentSubcategoryId: undefined } : {}),
    });
  };

  // Handle parent category selection for subcategories
  const handleParentCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    setCategoryFormData({
      ...categoryFormData,
      parentCategoryId: categoryId,
      parentSubcategoryId: undefined,
    });
  };

  // Handle parent subcategory selection for level3
  const handleParentSubcategoryChange = (value: string) => {
    const subcategoryId = parseInt(value);
    setCategoryFormData({
      ...categoryFormData,
      parentSubcategoryId: subcategoryId,
    });
  };

  // Handle category form input changes
  const handleCategoryFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value,
    });
  };

  // Handle category form submission
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (categoryFormData.level === 'category') {
      // Add new main category
      const newCategory: Category = {
        id: Math.max(0, ...categories.map(c => c.id)) + 1,
        name: categoryFormData.name,
        subcategories: [],
      };
      
      setCategories([...categories, newCategory]);
      toast.success("Categoría añadida correctamente");
    } 
    else if (categoryFormData.level === 'subcategory' && categoryFormData.parentCategoryId) {
      // Add new subcategory to existing category
      const newSubcategoryId = Math.max(0, ...categories.flatMap(c => c.subcategories.map(s => s.id))) + 1;
      
      const updatedCategories = categories.map(category => {
        if (category.id === categoryFormData.parentCategoryId) {
          return {
            ...category,
            subcategories: [
              ...category.subcategories,
              {
                id: newSubcategoryId,
                name: categoryFormData.name,
                parent_id: category.id,
                level3: [],
              }
            ],
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      toast.success("Subcategoría añadida correctamente");
    }
    else if (categoryFormData.level === 'level3' && categoryFormData.parentCategoryId && categoryFormData.parentSubcategoryId) {
      // Add new level3 to existing subcategory
      const newLevel3Id = Math.max(
        0, 
        ...categories.flatMap(c => 
          c.subcategories.flatMap(s => 
            s.level3.map(l => l.id)
          )
        )
      ) + 1;
      
      const updatedCategories = categories.map(category => {
        if (category.id === categoryFormData.parentCategoryId) {
          return {
            ...category,
            subcategories: category.subcategories.map(subcategory => {
              if (subcategory.id === categoryFormData.parentSubcategoryId) {
                return {
                  ...subcategory,
                  level3: [
                    ...subcategory.level3,
                    {
                      id: newLevel3Id,
                      name: categoryFormData.name,
                      parent_id: subcategory.id,
                    }
                  ],
                };
              }
              return subcategory;
            }),
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      toast.success("Subcategoría de nivel 3 añadida correctamente");
    }
    
    setCategoryDialogOpen(false);
    resetCategoryForm();
  };

  // Handle product deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  // Handle category deletion
  const handleDeleteCategory = (categoryId: number) => {
    // Check if category is in use
    const categoryInUse = products.some(product => product.categoryId === categoryId);
    
    if (categoryInUse) {
      toast.error("No se puede eliminar esta categoría porque está en uso por productos");
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      setCategories(categories.filter(category => category.id !== categoryId));
      toast.success("Categoría eliminada correctamente");
    }
  };

  // Handle subcategory deletion
  const handleDeleteSubcategory = (categoryId: number, subcategoryId: number) => {
    // Check if subcategory is in use
    const subcategoryInUse = products.some(product => 
      product.categoryId === categoryId && product.subcategoryId === subcategoryId
    );
    
    if (subcategoryInUse) {
      toast.error("No se puede eliminar esta subcategoría porque está en uso por productos");
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.filter(subcategory => subcategory.id !== subcategoryId),
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      toast.success("Subcategoría eliminada correctamente");
    }
  };

  // Handle level3 deletion
  const handleDeleteLevel3 = (categoryId: number, subcategoryId: number, level3Id: number) => {
    // Check if level3 is in use
    const level3InUse = products.some(product => 
      product.categoryId === categoryId && 
      product.subcategoryId === subcategoryId &&
      product.level3CategoryId === level3Id
    );
    
    if (level3InUse) {
      toast.error("No se puede eliminar esta subcategoría porque está en uso por productos");
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            subcategories: category.subcategories.map(subcategory => {
              if (subcategory.id === subcategoryId) {
                return {
                  ...subcategory,
                  level3: subcategory.level3.filter(level3 => level3.id !== level3Id),
                };
              }
              return subcategory;
            }),
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      toast.success("Subcategoría de nivel 3 eliminada correctamente");
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

  // Get level3 name by id
  const getLevel3Name = (categoryId: number, subcategoryId: number, level3Id?: number) => {
    if (!level3Id) return '';
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '';
    
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return '';
    
    const level3 = subcategory.level3.find(l => l.id === level3Id);
    return level3 ? level3.name : '';
  };

  // Get available subcategories for the selected category
  const getAvailableSubcategories = () => {
    const category = categories.find(c => c.id === formData.categoryId);
    return category ? category.subcategories : [];
  };

  // Get available level3 categories for the selected subcategory
  const getAvailableLevel3Categories = () => {
    const category = categories.find(c => c.id === formData.categoryId);
    if (!category) return [];
    
    const subcategory = category.subcategories.find(s => s.id === formData.subcategoryId);
    return subcategory ? subcategory.level3 : [];
  };

  // Get subcategories for a specific category (used in category management)
  const getSubcategoriesForCategory = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
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
                  {/* Categories filter with three levels */}
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
                                    <Collapsible
                                      open={expandedSubcategories.includes(subcategory.id)}
                                      onOpenChange={() => toggleSubcategoryExpansion(subcategory.id)}
                                    >
                                      <div className="flex items-center">
                                        <button 
                                          type="button"
                                          className={`text-sm w-full text-left px-2 py-1.5 rounded-md ${selectedSubcategoryFilter === subcategory.id ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted'}`}
                                          onClick={() => handleSubcategoryFilter(subcategory.id)}
                                        >
                                          {subcategory.name}
                                        </button>
                                        
                                        {subcategory.level3.length > 0 && (
                                          <CollapsibleTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                                              <ChevronRight className={`h-4 w-4 transition-transform ${expandedSubcategories.includes(subcategory.id) ? 'rotate-90' : ''}`} />
                                            </Button>
                                          </CollapsibleTrigger>
                                        )}
                                      </div>
                                      
                                      {subcategory.level3.length > 0 && (
                                        <CollapsibleContent>
                                          <ul className="pl-4 mt-1 space-y-1">
                                            {subcategory.level3.map(level3 => (
                                              <li key={level3.id}>
                                                <button 
                                                  type="button"
                                                  className={`text-sm w-full text-left px-2 py-1.5 rounded-md ${selectedLevel3Filter === level3.id ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted'}`}
                                                  onClick={() => handleLevel3Filter(level3.id)}
                                                >
                                                  {level3.name}
                                                </button>
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
        
        {/* Products list and categories management */}
        <div className="md:col-span-3 space-y-4">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="categories">Gestionar Categorías</TabsTrigger>
            </TabsList>
            
            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
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
                                {product.level3CategoryId && (
                                  <div className="text-xs text-muted-foreground">
                                    {getLevel3Name(product.categoryId, product.subcategoryId, product.level3CategoryId)}
                                  </div>
                                )}
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
            </TabsContent>
            
            {/* Categories Management Tab */}
            <TabsContent value="categories" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Gestión de Categorías</h3>
                <div className="flex gap-2">
                  <Tabs value={activeCategoryTab} onValueChange={setActiveCategoryTab} className="w-auto">
                    <TabsList>
                      <TabsTrigger value="list">Lista</TabsTrigger>
                      <TabsTrigger value="tree">Árbol</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button onClick={openCategoryDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Categoría
                  </Button>
                </div>
              </div>

              {/* Categories List View */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Padre</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Level 1 Categories */}
                      {categories.map((category) => (
                        <React.Fragment key={category.id}>
                          <TableRow>
                            <TableCell>
                              <div className="font-medium">{category.name}</div>
                            </TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {/* Level 2 Categories - Subcategories */}
                          {category.subcategories.map((subcategory) => (
                            <React.Fragment key={subcategory.id}>
                              <TableRow>
                                <TableCell>
                                  <div className="font-medium pl-4">{subcategory.name}</div>
                                </TableCell>
                                <TableCell>Subcategoría</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}>
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              
                              {/* Level 3 Categories */}
                              {subcategory.level3.map((level3) => (
                                <TableRow key={level3.id}>
                                  <TableCell>
                                    <div className="font-medium pl-8">{level3.name}</div>
                                  </TableCell>
                                  <TableCell>Nivel 3</TableCell>
                                  <TableCell>{subcategory.name}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="sm" onClick={() => handleDeleteLevel3(category.id, subcategory.id, level3.id)}>
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Dialog for creating categories */}
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Categoría</DialogTitle>
                    <DialogDescription>
                      Rellena el formulario para crear una nueva categoría o subcategoría
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCategorySubmit}>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryLevel">Tipo</Label>
                          <Select
                            value={categoryFormData.level}
                            onValueChange={(value) => handleCategoryLevelChange(value as 'category' | 'subcategory' | 'level3')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="category">Categoría</SelectItem>
                              <SelectItem value="subcategory">Subcategoría</SelectItem>
                              <SelectItem value="level3">Nivel 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {categoryFormData.level !== 'category' && (
                          <div className="space-y-2">
                            <Label htmlFor="parentCategory">Categoría Padre</Label>
                            <Select
                              value={categoryFormData.parentCategoryId?.toString() || ""}
                              onValueChange={handleParentCategoryChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la categoría padre" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {categoryFormData.level === 'level3' && categoryFormData.parentCategoryId && (
                          <div className="space-y-2">
                            <Label htmlFor="parentSubcategory">Subcategoría Padre</Label>
                            <Select
                              value={categoryFormData.parentSubcategoryId?.toString() || ""}
                              onValueChange={handleParentSubcategoryChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la subcategoría padre" />
                              </SelectTrigger>
                              <SelectContent>
                                {getSubcategoriesForCategory(categoryFormData.parentCategoryId).map((subcategory) => (
                                  <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                    {subcategory.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Nombre</Label>
                          <Input
                            id="categoryName"
                            name="name"
                            value={categoryFormData.name}
                            onChange={handleCategoryFormInputChange}
                            placeholder="Nombre de la categoría"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Guardar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Dialog for creating/editing products */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Crear Nuevo Producto' : 'Editar Producto'}
            </DialogTitle>
            <DialogDescription>
              Rellena el formulario para {formMode === 'create' ? 'crear un nuevo producto' : 'editar el producto'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nombre del producto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción del producto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.categoryId ? formData.categoryId.toString() : ""}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.categoryId > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategoría</Label>
                    <Select
                      value={formData.subcategoryId ? formData.subcategoryId.toString() : ""}
                      onValueChange={handleSubcategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableSubcategories().map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {formData.subcategoryId > 0 && getAvailableLevel3Categories().length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="level3">Nivel 3</Label>
                    <Select
                      value={formData.level3CategoryId ? formData.level3CategoryId.toString() : ""}
                      onValueChange={handleLevel3Change}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel 3" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableLevel3Categories().map((level3) => (
                          <SelectItem key={level3.id} value={level3.id.toString()}>
                            {level3.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Compañías</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`company-${company.id}`}
                          checked={formData.companies.includes(company.id)}
                          onChange={() => handleCompanyChange(company.id.toString())}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={`company-${company.id}`}>{company.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Características</Label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
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
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                    className="w-full mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Característica
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{formMode === 'create' ? 'Crear' : 'Actualizar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
