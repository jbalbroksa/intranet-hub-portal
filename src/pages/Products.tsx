
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import ProductFilters from '@/components/products/ProductFilters';
import ProductsList from '@/components/products/ProductsList';
import ProductForm from '@/components/products/ProductForm';
import CategoryManager from '@/components/products/CategoryManager';

// Mock data for categories
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
  { id: 1, name: 'Seguro Todo Riesgo Plus', description: 'Seguro a todo riesgo con las mejores coberturas', categoryId: 1, subcategoryId: 1, companies: [1, 3], features: ['Asistencia 24h', 'Vehículo de sustitución', 'Daños propios'], strengths: 'Cobertura completa, precio competitivo', weaknesses: 'Franquicia alta para conductores noveles', observations: 'Recomendado para familias' },
  { id: 2, name: 'Seguro Hogar Completo', description: 'Protección integral para tu hogar', categoryId: 2, subcategoryId: 5, companies: [2, 5], features: ['Daños por agua', 'Robo', 'Responsabilidad civil'], strengths: 'Amplia cobertura en daños estéticos', weaknesses: 'No cubre daños a terceros fuera del hogar', observations: 'Ideal para viviendas de más de 90m²' },
  { id: 3, name: 'Seguro de Vida Ahorro', description: 'Asegura tu futuro y el de tu familia', categoryId: 3, subcategoryId: 8, companies: [1, 4], features: ['Capital garantizado', 'Flexibilidad', 'Fiscalidad ventajosa'], strengths: 'Buena rentabilidad a largo plazo', weaknesses: 'Poca liquidez', observations: 'Recomendado para ahorro superior a 5 años' },
  { id: 4, name: 'Terceros Ampliado', description: 'Seguro a terceros con coberturas adicionales', categoryId: 1, subcategoryId: 3, companies: [3, 5], features: ['Lunas', 'Robo', 'Incendio'], strengths: 'Precio muy competitivo', weaknesses: 'No cubre daños propios', observations: 'Para vehículos de más de 5 años' },
  { id: 5, name: 'Hogar Básico', description: 'Cobertura esencial para tu vivienda', categoryId: 2, subcategoryId: 4, companies: [2, 3], features: ['Incendio', 'Daños por agua', 'Responsabilidad civil'], strengths: 'Precio económico', weaknesses: 'Coberturas limitadas', observations: 'Para viviendas de menos de 90m²' },
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

type Product = {
  id: number;
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

type CategoryFormData = {
  level: 'category' | 'subcategory' | 'level3';
  name: string;
  parentCategoryId?: number;
  parentSubcategoryId?: number;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [companies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<number[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<number | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState('list');
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    categoryId: 0,
    subcategoryId: 0,
    level3CategoryId: undefined,
    companies: [],
    features: [''],
    strengths: '',
    weaknesses: '',
    observations: '',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === null || product.categoryId === selectedCategoryFilter;
    
    const matchesCompany = selectedCompanyFilter === null || product.companies.includes(selectedCompanyFilter);
    
    return matchesSearch && matchesCategory && matchesCompany;
  });

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prevExpanded => 
      prevExpanded.includes(categoryId)
        ? prevExpanded.filter(id => id !== categoryId)
        : [...prevExpanded, categoryId]
    );
  };

  const toggleSubcategoryExpansion = (subcategoryId: number) => {
    setExpandedSubcategories(prevExpanded => 
      prevExpanded.includes(subcategoryId)
        ? prevExpanded.filter(id => id !== subcategoryId)
        : [...prevExpanded, subcategoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategoryFilter(null);
    setSelectedCompanyFilter(null);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    setFormData({
      ...formData,
      categoryId,
      subcategoryId: 0,
      level3CategoryId: undefined,
    });
  };

  const handleSubcategoryChange = (value: string) => {
    const subcategoryId = parseInt(value);
    setFormData({
      ...formData,
      subcategoryId,
      level3CategoryId: undefined,
    });
  };

  const handleLevel3Change = (value: string) => {
    const level3Id = parseInt(value);
    setFormData({
      ...formData,
      level3CategoryId: level3Id === 0 ? undefined : level3Id,
    });
  };

  const handleCompanyChange = (value: string) => {
    const companyId = parseInt(value);
    setFormData({
      ...formData,
      companies: formData.companies.includes(companyId)
        ? formData.companies.filter(id => id !== companyId)
        : [...formData.companies, companyId],
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: 0,
      subcategoryId: 0,
      level3CategoryId: undefined,
      companies: [],
      features: [''],
      strengths: '',
      weaknesses: '',
      observations: '',
    });
  };

  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

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
      strengths: product.strengths,
      weaknesses: product.weaknesses,
      observations: product.observations,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      const newProduct: Product = {
        id: Math.max(0, ...products.map(p => p.id)) + 1,
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
      };
      setProducts([...products, newProduct]);
      toast.success("Producto creado exitosamente");
    } else if (formMode === 'edit' && currentProduct) {
      const updatedProducts = products.map(product => 
        product.id === currentProduct.id 
          ? { 
              ...product, 
              ...formData,
              features: formData.features.filter(f => f.trim() !== ''),
            } 
          : product
      );
      setProducts(updatedProducts);
      toast.success("Producto actualizado exitosamente");
    }
    
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
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

  const handleDeleteSubcategory = (categoryId: number, subcategoryId: number) => {
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

  const handleDeleteLevel3 = (categoryId: number, subcategoryId: number, level3Id: number) => {
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

  const handleCategorySubmit = (categoryFormData: CategoryFormData) => {
    if (categoryFormData.level === 'category') {
      const newCategory: Category = {
        id: Math.max(0, ...categories.map(c => c.id)) + 1,
        name: categoryFormData.name,
        subcategories: [],
      };
      
      setCategories([...categories, newCategory]);
      toast.success("Categoría añadida correctamente");
    } 
    else if (categoryFormData.level === 'subcategory' && categoryFormData.parentCategoryId) {
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
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  };

  const getSubcategoryName = (categoryId: number, subcategoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 'Sin subcategoría';
    
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : 'Sin subcategoría';
  };

  const getCompanyNames = (companyIds: number[]) => {
    return companyIds.map(id => {
      const company = companies.find(c => c.id === id);
      return company ? company.name : '';
    }).filter(Boolean).join(', ');
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategoryManager
            categories={categories}
            activeCategoryTab={activeCategoryTab}
            expandedCategories={expandedCategories}
            expandedSubcategories={expandedSubcategories}
            onTabChange={setActiveCategoryTab}
            onToggleCategoryExpansion={toggleCategoryExpansion}
            onToggleSubcategoryExpansion={toggleSubcategoryExpansion}
            onDeleteCategory={handleDeleteCategory}
            onDeleteSubcategory={handleDeleteSubcategory}
            onDeleteLevel3={handleDeleteLevel3}
            onCategorySubmit={handleCategorySubmit}
          />
        </div>

        <div className="md:col-span-3 space-y-4">
          <ProductFilters
            searchTerm={searchTerm}
            categories={categories}
            companies={companies}
            selectedCategoryFilter={selectedCategoryFilter}
            selectedCompanyFilter={selectedCompanyFilter}
            onSearchChange={handleSearchChange}
            onCategoryFilterChange={setSelectedCategoryFilter}
            onCompanyFilterChange={setSelectedCompanyFilter}
            onClearFilters={clearFilters}
            onCreateClick={openCreateDialog}
          />

          <ProductsList
            products={filteredProducts}
            getCategoryName={getCategoryName}
            getSubcategoryName={getSubcategoryName}
            getCompanyNames={getCompanyNames}
            onEditProduct={openEditDialog}
            onDeleteProduct={handleDelete}
          />
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Crear nuevo producto' : 'Editar producto'}
            </DialogTitle>
            <DialogDescription>
              Complete todos los campos para {formMode === 'create' ? 'crear un nuevo' : 'actualizar el'} producto.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm
            formData={formData}
            categories={categories}
            companies={companies}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            onInputChange={handleInputChange}
            onTextAreaChange={handleTextAreaChange}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            onLevel3Change={handleLevel3Change}
            onCompanyChange={handleCompanyChange}
            onFeatureChange={handleFeatureChange}
            addFeature={addFeature}
            removeFeature={removeFeature}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
