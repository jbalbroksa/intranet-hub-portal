
import { toast } from 'sonner';
import { CompanyStateType } from './CompanyState';
import { Company } from '@/types/company';

export function useCompanyActions(state: CompanyStateType) {
  const {
    setFormData, 
    setLogoUrl,
    setDialogOpen, 
    setFormMode, 
    setCurrentCompany,
    setSelectedCompany,
    setActiveTab,
    setSpecFormData,
    setSpecDialogOpen,
    setSpecifications,
    specifications,
    setCategoryFormData,
    setCategoryDialogOpen,
    setSpecCategories,
    specCategories,
    createCompania,
    updateCompania,
    deleteCompania,
    refetch
  } = state;

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '/placeholder.svg',
      website: '',
      mediatorAccess: '',
      responsibleEmail: '',
      category: 'all',
      telefono: '',
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

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      slug: '',
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
      name: company.nombre,
      logo: company.logo_url || '/placeholder.svg',
      website: company.sitio_web || '',
      mediatorAccess: company.sitio_web || '',
      responsibleEmail: company.email || '',
      category: (company.categoria as 'specific' | 'preferred' | 'all') || 'all',
      telefono: company.telefono || '',
    });
    
    setLogoUrl(company.logo_url || '/placeholder.svg');
    setDialogOpen(true);
  };

  const openAddSpecDialog = () => {
    if (!state.selectedCompany) return;
    resetSpecForm();
    setSpecDialogOpen(true);
  };

  const openAddCategoryDialog = () => {
    resetCategoryForm();
    setCategoryDialogOpen(true);
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
      setFormData(prev => ({
        ...prev,
        logo: url,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { formData, formMode, currentCompany } = state;
    
    const databaseModel = {
      nombre: formData.name,
      logo_url: formData.logo,
      sitio_web: formData.website,
      email: formData.responsibleEmail,
      categoria: formData.category,
      telefono: formData.telefono,
    };
    
    if (formMode === 'create') {
      createCompania.mutate(databaseModel, {
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
        data: databaseModel
      }, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
          toast.success('Compañía actualizada correctamente');
          refetch();
          
          if (state.selectedCompany && state.selectedCompany.id === currentCompany.id) {
            setSelectedCompany(null);
          }
        }
      });
    }
  };

  const handleSpecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.selectedCompany) return;
    
    const newSpecification = {
      id: Math.max(0, ...specifications.map(s => s.id)) + 1,
      companyId: state.selectedCompany.id,
      title: state.specFormData.title,
      content: state.specFormData.content,
      category: state.specFormData.category,
    };
    
    setSpecifications([...specifications, newSpecification]);
    setSpecDialogOpen(false);
    resetSpecForm();
    toast.success("Especificación añadida correctamente");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compañía?')) {
      deleteCompania.mutate(id, {
        onSuccess: () => {
          toast.success('Compañía eliminada correctamente');
          refetch();
          if (state.selectedCompany && state.selectedCompany.id === id) {
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
    setCategoryFormData(prev => ({
      ...prev,
      slug: value,
    }));
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCategory = {
      id: Math.max(0, ...specCategories.map(c => c.id)) + 1,
      name: state.categoryFormData.name,
      slug: state.categoryFormData.slug,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value as 'specific' | 'preferred' | 'all',
    }));
  };

  const handleSpecInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpecFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecCategoryChange = (value: string) => {
    setSpecFormData(prev => ({
      ...prev,
      category: value as any,
    }));
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

  return {
    openCreateDialog,
    openEditDialog,
    openAddSpecDialog,
    viewCompanyDetails,
    backToList,
    handleLogoUpload,
    handleSubmit,
    handleSpecSubmit,
    handleDelete,
    handleDeleteSpec,
    handleCategoryNameChange,
    handleCategorySlugChange,
    handleCategorySubmit,
    handleDeleteCategory,
    handleInputChange,
    handleCategoryChange,
    handleSpecInputChange,
    handleSpecCategoryChange,
    getCategoryLabel,
    getSpecCategoryLabel,
    openAddCategoryDialog,
    resetForm,
    resetSpecForm,
    resetCategoryForm
  };
}

export type CompanyActionsType = ReturnType<typeof useCompanyActions>;
