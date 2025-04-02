import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CompaniaFormData } from '@/types/database';
import CompanyFilters from '@/components/companies/CompanyFilters';
import CompanyList from '@/components/companies/CompanyList';
import CompanyDetail from '@/components/companies/CompanyDetail';
import CompanyForm from '@/components/companies/CompanyForm';
import SpecificationForm from '@/components/companies/SpecificationForm';
import CategoryForm from '@/components/companies/CategoryForm';
import { useCompanias } from '@/hooks/useCompanias';
import { Company, Specification, SpecCategory } from '@/types/company';

type FormMode = 'create' | 'edit';
type ViewMode = 'grid' | 'list';
type CategoryFilter = 'all' | 'specific' | 'preferred';

// Mock data for specifications
const mockSpecifications = [
  { id: 1, companyId: "1", title: 'Requisitos de Contratación', content: 'Documentación necesaria para la contratación de pólizas.', category: 'requirements' },
  { id: 2, companyId: "1", title: 'Proceso de Siniestros', content: 'Pasos a seguir para la gestión de siniestros con esta compañía.', category: 'procedures' },
  { id: 3, companyId: "2", title: 'Comisiones', content: 'Detalles sobre las comisiones por producto.', category: 'commercial' },
  { id: 4, companyId: "3", title: 'Contactos Clave', content: 'Listado de contactos clave para diferentes departamentos.', category: 'contacts' },
  { id: 5, companyId: "3", title: 'Procedimiento de Renovación', content: 'Información sobre el proceso de renovación de pólizas.', category: 'procedures' },
];

// Mock data for specification categories
const mockSpecCategories = [
  { id: 1, name: 'Requisitos', slug: 'requirements' },
  { id: 2, name: 'Procedimientos', slug: 'procedures' },
  { id: 3, name: 'Comercial', slug: 'commercial' },
  { id: 4, name: 'Contactos', slug: 'contacts' },
  { id: 5, name: 'Otros', slug: 'other' },
];

const Companies = () => {
  const { 
    companias, 
    filteredCompanias, 
    isLoading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    createCompania, 
    updateCompania, 
    deleteCompania, 
    refetch 
  } = useCompanias();

  const [specifications, setSpecifications] = useState<Specification[]>(mockSpecifications);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [specDialogOpen, setSpecDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentCompany, setCurrentCompany] = useState<any | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [logoUrl, setLogoUrl] = useState<string>('/placeholder.svg');
  const [activeTab, setActiveTab] = useState<string>('info');
  const [specCategories, setSpecCategories] = useState<SpecCategory[]>(mockSpecCategories);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
  });

  const [formData, setFormData] = useState<CompaniaFormData>({
    nombre: '',
    descripcion: '',
    logo_url: '/placeholder.svg',
    sitio_web: '',
    direccion: '',
    telefono: '',
    email: '',
    categoria: '',
  });

  const [specFormData, setSpecFormData] = useState<any>({
    title: '',
    content: '',
    category: 'procedures',
  });

  const applyFilters = () => {
    const filtered = filteredCompanias.filter(company => {
      const matchesCategory = categoryFilter === 'all' || 
        (company.categoria && company.categoria.toLowerCase() === categoryFilter);
      return matchesCategory;
    });
    return filtered;
  };

  const filteredCompaniesWithCategoryFilter = applyFilters();

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
      categoria: value,
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
      nombre: '',
      descripcion: '',
      logo_url: '/placeholder.svg',
      sitio_web: '',
      direccion: '',
      telefono: '',
      email: '',
      categoria: '',
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

  const openEditDialog = (company: any) => {
    setFormMode('edit');
    setCurrentCompany(company);
    setFormData({
      nombre: company.nombre,
      descripcion: company.descripcion || '',
      logo_url: company.logo_url || '/placeholder.svg',
      sitio_web: company.sitio_web || '',
      direccion: company.direccion || '',
      telefono: company.telefono || '',
      email: company.email || '',
      categoria: company.categoria || '',
    });
    setLogoUrl(company.logo_url || '/placeholder.svg');
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
        logo_url: url,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      createCompania.mutate(formData, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
          toast.success('Compañía creada correctamente');
          refetch();
        }
      });
    } else if (formMode === 'edit' && currentCompany) {
      updateCompania.mutate({
        id: currentCompany.id,
        data: formData
      }, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
          toast.success('Compañía actualizada correctamente');
          refetch();
          
          if (selectedCompany && selectedCompany.id === currentCompany.id) {
            setSelectedCompany(null);
          }
        }
      });
    }
  };

  const handleSpecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany) return;
    
    const newSpecification = {
      id: Math.max(0, ...specifications.map(s => s.id)) + 1,
      companyId: selectedCompany.id,
      title: specFormData.title,
      content: specFormData.content,
      category: specFormData.category,
    } as Specification;
    
    setSpecifications([...specifications, newSpecification]);
    setSpecDialogOpen(false);
    resetSpecForm();
    toast.success("Especificación añadida correctamente");
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compañía?')) {
      deleteCompania.mutate(id, {
        onSuccess: () => {
          toast.success('Compañía eliminada correctamente');
          refetch();
          if (selectedCompany && selectedCompany.id === id) {
            setSelectedCompany(null);
          }
        }
      });
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
    
    const newCategory = {
      id: Math.max(0, ...specCategories.map(c => c.id)) + 1,
      name: categoryFormData.name,
      slug: categoryFormData.slug,
    } as SpecCategory;
    
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

  const getCategoryLabel = (category: string | null | undefined) => {
    if (!category) return 'Todas';
    
    switch(category.toLowerCase()) {
      case 'specific': 
        return 'Específica';
      case 'preferred': 
        return 'Preferente';
      default: 
        return 'Todas';
    }
  };

  const getSpecCategoryLabel = (categorySlug: string) => {
    const category = specCategories.find(c => c.slug === categorySlug);
    return category ? category.name : 'Desconocido';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando compañías...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error al cargar compañías: {error.message}</div>;
  }

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

  const convertedCompanies: Company[] = filteredCompaniesWithCategoryFilter.map(company => ({
    id: company.id,
    logo: company.logo_url || '/placeholder.svg',
    name: company.nombre,
    website: company.sitio_web || '',
    mediatorAccess: company.sitio_web || '',  // Using sitio_web as a default for mediatorAccess
    responsibleEmail: company.email || '',
    category: (company.categoria as 'specific' | 'preferred' | 'all') || 'all',
  }));

  return (
    <div className="space-y-6 animate-slideInUp">
      <CompanyFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        viewMode={viewMode}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onCategoryFilterChange={setCategoryFilter}
        onViewModeChange={setViewMode}
        onCreateClick={openCreateDialog}
      />

      <CompanyList
        companies={convertedCompanies}
        viewMode={viewMode}
        getCategoryLabel={getCategoryLabel}
        onViewCompany={(company) => {
          const originalCompany = companias.find(c => c.id === company.id);
          if (originalCompany) {
            viewCompanyDetails({
              ...company,
              descripcion: originalCompany.descripcion,
              direccion: originalCompany.direccion,
              telefono: originalCompany.telefono,
              // Add any other fields needed
            });
          }
        }}
        onEditCompany={(company) => {
          const originalCompany = companias.find(c => c.id === company.id);
          if (originalCompany) {
            openEditDialog(originalCompany);
          }
        }}
        onDeleteCompany={(id) => handleDelete(id.toString())}
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
