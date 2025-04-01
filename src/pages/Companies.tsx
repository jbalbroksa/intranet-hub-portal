
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Company, SpecCategory, Specification } from '@/types/company';
import CompanyFilters from '@/components/companies/CompanyFilters';
import CompanyList from '@/components/companies/CompanyList';
import CompanyDetail from '@/components/companies/CompanyDetail';
import CompanyForm from '@/components/companies/CompanyForm';
import SpecificationForm from '@/components/companies/SpecificationForm';
import CategoryForm from '@/components/companies/CategoryForm';

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
      category: value as 'requirements' | 'procedures' | 'commercial' | 'contacts' | 'other',
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
      
      // Also delete related specifications
      setSpecifications(specifications.filter(spec => spec.companyId !== id));
    }
  };

  const handleDeleteSpec = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta especificación?')) {
      setSpecifications(specifications.filter(spec => spec.id !== id));
      toast.success("Especificación eliminada correctamente");
    }
  };

  const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setCategoryFormData({
      name,
      slug,
    });
  };

  const handleCategorySlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      slug: value,
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

  if (selectedCompany) {
    return (
      <CompanyDetail
        company={selectedCompany}
        specifications={filteredSpecifications}
        specCategories={specCategories}
        activeTab={activeTab}
        onBackClick={backToList}
        onEditClick={() => openEditDialog(selectedCompany)}
        onDeleteClick={() => {
          handleDelete(selectedCompany.id);
          backToList();
        }}
        onTabChange={setActiveTab}
        onAddSpecClick={openAddSpecDialog}
        onDeleteSpec={handleDeleteSpec}
        onAddCategoryClick={openAddCategoryDialog}
        onDeleteCategory={handleDeleteCategory}
        getCategoryLabel={getCategoryLabel}
      />
    );
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      <CompanyFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        viewMode={viewMode}
        onSearchChange={handleSearchChange}
        onCategoryFilterChange={setCategoryFilter}
        onViewModeChange={setViewMode}
        onCreateClick={openCreateDialog}
      />

      <CompanyList
        companies={filteredCompanies}
        viewMode={viewMode}
        getCategoryLabel={getCategoryLabel}
        onViewCompany={viewCompanyDetails}
        onEditCompany={openEditDialog}
        onDeleteCompany={handleDelete}
      />

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
          
          <CompanyForm 
            formData={formData}
            formMode={formMode}
            logoUrl={logoUrl}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            onInputChange={handleInputChange}
            onCategoryChange={handleCategoryChange}
            onLogoUpload={handleLogoUpload}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={specDialogOpen} onOpenChange={setSpecDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Añadir Especificación</DialogTitle>
            <DialogDescription>
              Añada información específica para {selectedCompany?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <SpecificationForm 
            title={specFormData.title}
            content={specFormData.content}
            category={specFormData.category}
            specCategories={specCategories}
            onInputChange={handleSpecInputChange}
            onCategoryChange={handleSpecCategoryChange}
            onCancel={() => setSpecDialogOpen(false)}
            onSubmit={handleSpecSubmit}
          />
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
          
          <CategoryForm 
            name={categoryFormData.name}
            slug={categoryFormData.slug}
            onNameChange={handleCategoryNameChange}
            onSlugChange={handleCategorySlugChange}
            onCancel={() => setCategoryDialogOpen(false)}
            onSubmit={handleCategorySubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
