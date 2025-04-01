import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash, Filter, LayoutGrid, List, Upload, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for companies
const mockCompanies: Company[] = [
  { id: 1, logo: '/placeholder.svg', name: 'Mapfre', website: 'mapfre.es', mediatorAccess: 'mapfre.es/mediadores', responsibleEmail: 'mediadores@mapfre.es', category: 'preferred' },
  { id: 2, logo: '/placeholder.svg', name: 'Allianz', website: 'allianz.es', mediatorAccess: 'allianz.es/mediadores', responsibleEmail: 'mediadores@allianz.es', category: 'specific' },
  { id: 3, logo: '/placeholder.svg', name: 'AXA', website: 'axa.es', mediatorAccess: 'axa.es/mediadores', responsibleEmail: 'mediadores@axa.es', category: 'preferred' },
  { id: 4, logo: '/placeholder.svg', name: 'Generali', website: 'generali.es', mediatorAccess: 'generali.es/mediadores', responsibleEmail: 'mediadores@generali.es', category: 'specific' },
  { id: 5, logo: '/placeholder.svg', name: 'Zurich', website: 'zurich.es', mediatorAccess: 'zurich.es/mediadores', responsibleEmail: 'mediadores@zurich.es', category: 'preferred' },
];

// Mock data for specifications
const mockSpecifications: Specification[] = [
  { id: 1, companyId: 1, title: 'Requisitos de Contratación', content: 'Documentación necesaria para la contratación de pólizas.', category: 'requirements' },
  { id: 2, companyId: 1, title: 'Proceso de Siniestros', content: 'Pasos a seguir para la gestión de siniestros con esta compañía.', category: 'procedures' },
  { id: 3, companyId: 2, title: 'Comisiones', content: 'Detalles sobre las comisiones por producto.', category: 'commercial' },
  { id: 4, companyId: 3, title: 'Contactos Clave', content: 'Listado de contactos clave para diferentes departamentos.', category: 'contacts' },
  { id: 5, companyId: 3, title: 'Procedimiento de Renovación', content: 'Información sobre el proceso de renovación de pólizas.', category: 'procedures' },
];

// Mock data for specification categories
const mockSpecCategories: SpecCategory[] = [
  { id: 1, name: 'Requisitos', slug: 'requirements' },
  { id: 2, name: 'Procedimientos', slug: 'procedures' },
  { id: 3, name: 'Comercial', slug: 'commercial' },
  { id: 4, name: 'Contactos', slug: 'contacts' },
  { id: 5, name: 'Otros', slug: 'other' },
];

type Company = {
  id: number;
  logo: string;
  name: string;
  website: string;
  mediatorAccess: string;
  responsibleEmail: string;
  category: 'specific' | 'preferred' | 'all';
};

type SpecificationCategory = 'requirements' | 'procedures' | 'commercial' | 'contacts' | 'other';

type Specification = {
  id: number;
  companyId: number;
  title: string;
  content: string;
  category: SpecificationCategory;
};

type SpecCategory = {
  id: number;
  name: string;
  slug: string;
};

type FormMode = 'create' | 'edit';
type ViewMode = 'grid' | 'list';
type CategoryFilter = 'all' | 'specific' | 'preferred';

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [specifications, setSpecifications] = useState<Specification[]>(mockSpecifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [specDialogOpen, setSpecDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [logoUrl, setLogoUrl] = useState<string>('/placeholder.svg');
  const [activeTab, setActiveTab] = useState<string>('info');
  const [specCategories, setSpecCategories] = useState<SpecCategory[]>(mockSpecCategories);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Omit<SpecCategory, 'id'>>({
    name: '',
    slug: '',
  });

  const [formData, setFormData] = useState<Omit<Company, 'id'>>({
    logo: '/placeholder.svg',
    name: '',
    website: '',
    mediatorAccess: '',
    responsibleEmail: '',
    category: 'all',
  });

  const [specFormData, setSpecFormData] = useState<Omit<Specification, 'id' | 'companyId'>>({
    title: '',
    content: '',
    category: 'procedures',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || company.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredSpecifications = specifications.filter(spec => {
    return selectedCompany ? spec.companyId === selectedCompany.id : false;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value as 'specific' | 'preferred' | 'all',
    });
  };

  const handleSpecInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpecFormData({
      ...specFormData,
      [name]: value,
    });
  };

  const handleSpecCategoryChange = (value: string) => {
    setSpecFormData({
      ...specFormData,
      category: value as SpecificationCategory,
    });
  };

  const resetForm = () => {
    setFormData({
      logo: '/placeholder.svg',
      name: '',
      website: '',
      mediatorAccess: '',
      responsibleEmail: '',
      category: 'all',
    });
    setLogoUrl('/placeholder.svg');
  };

  const resetSpecForm = () => {
    setSpecFormData({
      title: '',
      content: '',
      category: 'procedures',
    });
  };

  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (company: Company) => {
    setFormMode('edit');
    setCurrentCompany(company);
    setFormData({
      logo: company.logo,
      name: company.name,
      website: company.website,
      mediatorAccess: company.mediatorAccess,
      responsibleEmail: company.responsibleEmail,
      category: company.category,
    });
    setLogoUrl(company.logo);
    setDialogOpen(true);
  };

  const openAddSpecDialog = () => {
    if (!selectedCompany) return;
    resetSpecForm();
    setSpecDialogOpen(true);
  };

  const viewCompanyDetails = (company: Company) => {
    setSelectedCompany(company);
    setActiveTab('info');
  };

  const backToList = () => {
    setSelectedCompany(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      setFormData({
        ...formData,
        logo: url,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      const newCompany: Company = {
        id: Math.max(0, ...companies.map(c => c.id)) + 1,
        ...formData,
      };
      setCompanies([...companies, newCompany]);
    } else if (formMode === 'edit' && currentCompany) {
      const updatedCompanies = companies.map(company => 
        company.id === currentCompany.id ? { ...company, ...formData } : company
      );
      setCompanies(updatedCompanies);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  const handleSpecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany) return;
    
    const newSpecification: Specification = {
      id: Math.max(0, ...specifications.map(s => s.id)) + 1,
      companyId: selectedCompany.id,
      ...specFormData,
    };
    
    setSpecifications([...specifications, newSpecification]);
    setSpecDialogOpen(false);
    resetSpecForm();
    toast.success("Especificación añadida correctamente");
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compañía?')) {
      setCompanies(companies.filter(company => company.id !== id));
      
      setSpecifications(specifications.filter(spec => spec.companyId !== id));
    }
  };

  const handleDeleteSpec = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta especificación?')) {
      setSpecifications(specifications.filter(spec => spec.id !== id));
      toast.success("Especificación eliminada correctamente");
    }
  };

  const handleDeleteCategory = (id: number) => {
    const categoryInUse = specifications.some(spec => {
      const category = specCategories.find(c => c.id === id);
      return category && spec.category === category.slug;
    });
    
    if (categoryInUse) {
      toast.error("No se puede eliminar esta categoría porque está en uso");
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      setSpecCategories(specCategories.filter(category => category.id !== id));
      toast.success("Categoría eliminada correctamente");
    }
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value,
    });
  };

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setCategoryFormData({
      ...categoryFormData,
      name,
      slug,
    });
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      slug: '',
    });
  };

  const openAddCategoryDialog = () => {
    resetCategoryForm();
    setCategoryDialogOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCategory: SpecCategory = {
      id: Math.max(0, ...specCategories.map(c => c.id)) + 1,
      ...categoryFormData,
    };
    
    setSpecCategories([...specCategories, newCategory]);
    setCategoryDialogOpen(false);
    resetCategoryForm();
    toast.success("Categoría añadida correctamente");
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'specific': return 'Específica';
      case 'preferred': return 'Preferente';
      default: return 'Todas';
    }
  };

  const getSpecCategoryLabel = (categorySlug: string) => {
    const category = specCategories.find(c => c.slug === categorySlug);
    return category ? category.name : 'Desconocido';
  };

  const getSpecCategoryColor = (category: string) => {
    switch(category) {
      case 'requirements': return 'bg-blue-100 text-blue-800';
      case 'procedures': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'contacts': return 'bg-orange-100 text-orange-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedCompany) {
    return (
      <div className="space-y-6 animate-slideInUp">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={backToList} className="mb-4">
            &larr; Volver a la lista
          </Button>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => openEditDialog(selectedCompany)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(selectedCompany.id)}>
              <Trash className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <div className="bg-muted/30 p-2 rounded-md h-16 w-16 flex items-center justify-center">
                <img 
                  src={selectedCompany.logo} 
                  alt={`${selectedCompany.name} logo`} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-2xl">{selectedCompany.name}</CardTitle>
                <CardDescription>
                  <a 
                    href={`https://${selectedCompany.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {selectedCompany.website}
                  </a>
                </CardDescription>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {getCategoryLabel(selectedCompany.category)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Información General</TabsTrigger>
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
              <TabsTrigger value="categories">Categorías</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Información de Contacto</h3>
                  <div className="space-y-2">
                    <div>
                      <Label>Email Responsable</Label>
                      <p className="text-sm">{selectedCompany.responsibleEmail}</p>
                    </div>
                    <div>
                      <Label>Acceso Mediador</Label>
                      <p className="text-sm">
                        <a 
                          href={`https://${selectedCompany.mediatorAccess}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {selectedCompany.mediatorAccess}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Detalles Adicionales</h3>
                  <div className="space-y-2">
                    <div>
                      <Label>Categoría</Label>
                      <p className="text-sm">{getCategoryLabel(selectedCompany.category)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Especificaciones</h3>
                <Button onClick={openAddSpecDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Especificación
                </Button>
              </div>
              
              {filteredSpecifications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredSpecifications.map((spec) => (
                    <Card key={spec.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{spec.title}</CardTitle>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecCategoryColor(spec.category)}`}>
                                {getSpecCategoryLabel(spec.category)}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSpec(spec.id)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Eliminar</span>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-line">{spec.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No hay especificaciones para esta compañía. Haga clic en "Añadir Especificación" para crear una.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="categories" className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Categorías de Especificaciones</h3>
                <Button onClick={openAddCategoryDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Categoría
                </Button>
              </div>
              
              {specCategories.length > 0 ? (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Eliminar</span>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No hay categorías definidas. Haga clic en "Añadir Categoría" para crear una.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
        
        <Dialog open={specDialogOpen} onOpenChange={setSpecDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Añadir Especificación</DialogTitle>
              <DialogDescription>
                Añada información específica para {selectedCompany.name}.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSpecSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={specFormData.title}
                    onChange={handleSpecInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={specFormData.category}
                    onValueChange={handleSpecCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {specCategories.map(category => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Contenido</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={specFormData.content}
                    onChange={handleSpecInputChange}
                    rows={6}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setSpecDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Añadir Categoría de Especificación</DialogTitle>
              <DialogDescription>
                Cree una nueva categoría para organizar las especificaciones.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    value={categoryFormData.name}
                    onChange={handleCategoryNameChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={categoryFormData.slug}
                    onChange={handleCategoryInputChange}
                    required
                    placeholder="ejemplo-de-slug"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    El slug se genera automáticamente a partir del nombre, pero puede editarlo si lo desea.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setCategoryDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar compañías..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="preferred">Preferentes</TabsTrigger>
              <TabsTrigger value="specific">Específicas</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 ml-auto">
            <div className="border rounded-md flex overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Compañía
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 bg-muted/30 flex items-center justify-center h-40">
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-poppins font-medium text-lg">{company.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {company.website}
                        </a>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {getCategoryLabel(company.category)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm" onClick={() => viewCompanyDetails(company)} className="h-8 px-2">
                        <FileText className="h-4 w-4 mr-1" /> Ver
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(company)} className="h-8 px-2">
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(company.id)} className="h-8 px-2">
                        <Trash className="h-4 w-4 mr-1" /> Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No se encontraron compañías</p>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Web</TableHead>
                  <TableHead className="hidden md:table-cell">Email Responsable</TableHead>
                  <TableHead className="hidden md:table-cell">Categoría</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <img 
                          src={company.logo} 
                          alt={`${company.name} logo`} 
                          className="h-10 w-10 object-contain"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {company.website}
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{company.responsibleEmail}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {getCategoryLabel(company.category)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => viewCompanyDetails(company)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(company)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(company.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No se encontraron compañías
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Crear nueva compañía' : 'Editar compañía'}
            </DialogTitle>
            <DialogDescription>
              Complete todos los campos para {formMode === 'create' ? 'crear una nueva' : 'actualizar la'} compañía.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 border rounded-md flex items-center justify-center overflow-hidden bg-muted/30">
                    <img 
                      src={logoUrl}
                      alt="Company logo" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm px-3 py-2 border rounded-md hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Subir logo</span>
                    </div>
                    <input 
                      type="file" 
                      id="logo" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleLogoUpload} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="website">Web</Label>
                  <Input 
                    id="website" 
                    name="website" 
                    value={formData.website} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mediatorAccess">Acceso Mediador</Label>
                  <Input 
                    id="mediatorAccess" 
                    name="mediatorAccess" 
                    value={formData.mediatorAccess} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsibleEmail">Email Responsable</Label>
                  <Input 
                    id="responsibleEmail" 
                    name="responsibleEmail" 
                    type="email" 
                    value={formData.responsibleEmail} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Categoría</Label>
                <RadioGroup 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific" />
                    <Label htmlFor="specific" className="cursor-pointer">Específica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="preferred" id="preferred" />
                    <Label htmlFor="preferred" className="cursor-pointer">Preferente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="cursor-pointer">Todas</Label>
                  </div>
                </RadioGroup>
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

export default Companies;
