import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash, Filter, LayoutGrid, List, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Mock data for companies with explicit type definitions
const mockCompanies: Company[] = [
  { id: 1, logo: '/placeholder.svg', name: 'Mapfre', website: 'mapfre.es', mediatorAccess: 'mapfre.es/mediadores', responsibleEmail: 'mediadores@mapfre.es', category: 'preferred' },
  { id: 2, logo: '/placeholder.svg', name: 'Allianz', website: 'allianz.es', mediatorAccess: 'allianz.es/mediadores', responsibleEmail: 'mediadores@allianz.es', category: 'specific' },
  { id: 3, logo: '/placeholder.svg', name: 'AXA', website: 'axa.es', mediatorAccess: 'axa.es/mediadores', responsibleEmail: 'mediadores@axa.es', category: 'preferred' },
  { id: 4, logo: '/placeholder.svg', name: 'Generali', website: 'generali.es', mediatorAccess: 'generali.es/mediadores', responsibleEmail: 'mediadores@generali.es', category: 'specific' },
  { id: 5, logo: '/placeholder.svg', name: 'Zurich', website: 'zurich.es', mediatorAccess: 'zurich.es/mediadores', responsibleEmail: 'mediadores@zurich.es', category: 'preferred' },
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

type FormMode = 'create' | 'edit';
type ViewMode = 'grid' | 'list';
type CategoryFilter = 'all' | 'specific' | 'preferred';

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [logoUrl, setLogoUrl] = useState<string>('/placeholder.svg');
  
  const [formData, setFormData] = useState<Omit<Company, 'id'>>({
    logo: '/placeholder.svg',
    name: '',
    website: '',
    mediatorAccess: '',
    responsibleEmail: '',
    category: 'all',
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

  // Handle company deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compañía?')) {
      setCompanies(companies.filter(company => company.id !== id));
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
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(company.id)}>
                        <Trash className="h-4 w-4" />
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
