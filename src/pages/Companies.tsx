
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

// Mock data for companies with explicit type definitions
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

type Company = {
  id: number;
  logo: string;
  name: string;
  website: string;
  mediatorAccess: string;
  responsibleEmail: string;
  category: 'specific' | 'preferred' | 'all';
};

type Specification = {
  id: number;
  companyId: number;
  title: string;
  content: string;
  category: 'requirements' | 'procedures' | 'commercial' | 'contacts' | 'other';
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter companies based on search term and category
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || company.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter specifications for the selected company
  const filteredSpecifications = specifications.filter(spec => {
    return selectedCompany ? spec.companyId === selectedCompany.id : false;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value as 'specific' | 'preferred' | 'all',
    });
  };

  // Handle specification form input changes
  const handleSpecInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpecFormData({
      ...specFormData,
      [name]: value,
    });
  };

  // Handle specification category change
  const handleSpecCategoryChange = (value: string) => {
    setSpecFormData({
      ...specFormData,
      category: value as 'requirements' | 'procedures' | 'commercial' | 'contacts' | 'other',
    });
  };

  // Reset form data
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

  // Reset specification form data
  const resetSpecForm = () => {
    setSpecFormData({
      title: '',
      content: '',
      category: 'procedures',
    });
  };

  // Open dialog for creating a new company
  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing an existing company
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

  // Open dialog for adding a new specification
  const openAddSpecDialog = () => {
    if (!selectedCompany) return;
    resetSpecForm();
    setSpecDialogOpen(true);
  };

  // View company details and specifications
  const viewCompanyDetails = (company: Company) => {
    setSelectedCompany(company);
    setActiveTab('info');
  };

  // Go back to company list
  const backToList = () => {
    setSelectedCompany(null);
  };

  // Simulate file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // and get a URL back. Here we're just creating a temporary URL.
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      setFormData({
        ...formData,
        logo: url,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      // Create new company
      const newCompany: Company = {
        id: Math.max(0, ...companies.map(c => c.id)) + 1,
        ...formData,
      };
      setCompanies([...companies, newCompany]);
    } else if (formMode === 'edit' && currentCompany) {
      // Update existing company
      const updatedCompanies = companies.map(company => 
        company.id === currentCompany.id ? { ...company, ...formData } : company
      );
      setCompanies(updatedCompanies);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  // Handle specification form submission
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

  // Handle company deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compañía?')) {
      setCompanies(companies.filter(company => company.id !== id));
      
      // Also delete all specifications for this company
      setSpecifications(specifications.filter(spec => spec.companyId !== id));
    }
  };

  // Handle specification deletion
  const handleDeleteSpec = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta especificación?')) {
      setSpecifications(specifications.filter(spec => spec.id !== id));
      toast.success("Especificación eliminada correctamente");
    }
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'specific': return 'Específica';
      case 'preferred': return 'Preferente';
      default: return 'Todas';
    }
  };

  // Get specification category label
  const getSpecCategoryLabel = (category: string) => {
    switch(category) {
      case 'requirements': return 'Requisitos';
      case 'procedures': return 'Procedimientos';
      case 'commercial': return 'Comercial';
      case 'contacts': return 'Contactos';
      case 'other': return 'Otros';
      default: return 'Desconocido';
    }
  };

  // Get specification category color
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

  // If a company is selected, show company details and specifications
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Información General</TabsTrigger>
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
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
          </Tabs>
        </Card>
        
        {/* Add Specification Dialog */}
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
                      <SelectItem value="requirements">Requisitos</SelectItem>
                      <SelectItem value="procedures">Procedimientos</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                      <SelectItem value="contacts">Contactos</SelectItem>
                      <SelectItem value="other">Otros</SelectItem>
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
      </div>
    );
  }

  // Company list view
  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Search and filter bar */}
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

      {/* Companies display */}
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

      {/* Create/Edit dialog */}
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
              {/* Logo upload */}
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
