
import React, { useState } from 'react';
import { useCompanias } from '@/hooks/useCompanias';
import { Company, Specification, SpecCategory } from '@/types/company';
import { CompanyFormData } from './CompanyForm';

const mockSpecifications: Specification[] = [
  { id: 1, companyId: "1", title: 'Requisitos de Contratación', content: 'Documentación necesaria para la contratación de pólizas.', category: 'requirements' },
  { id: 2, companyId: "1", title: 'Proceso de Siniestros', content: 'Pasos a seguir para la gestión de siniestros con esta compañía.', category: 'procedures' },
  { id: 3, companyId: "2", title: 'Comisiones', content: 'Detalles sobre las comisiones por producto.', category: 'commercial' },
  { id: 4, companyId: "3", title: 'Contactos Clave', content: 'Listado de contactos clave para diferentes departamentos.', category: 'contacts' },
  { id: 5, companyId: "3", title: 'Procedimiento de Renovación', content: 'Información sobre el proceso de renovación de pólizas.', category: 'procedures' },
];

const mockSpecCategories: SpecCategory[] = [
  { id: 1, name: 'Requisitos', slug: 'requirements' },
  { id: 2, name: 'Procedimientos', slug: 'procedures' },
  { id: 3, name: 'Comercial', slug: 'commercial' },
  { id: 4, name: 'Contactos', slug: 'contacts' },
  { id: 5, name: 'Otros', slug: 'other' },
];

export function useCompanyState() {
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
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentCompany, setCurrentCompany] = useState<any | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'specific' | 'preferred'>('all');
  const [logoUrl, setLogoUrl] = useState<string>('/placeholder.svg');
  const [activeTab, setActiveTab] = useState<string>('info');
  const [specCategories, setSpecCategories] = useState<SpecCategory[]>(mockSpecCategories);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
  });

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    logo: '/placeholder.svg',
    website: '',
    mediatorAccess: '',
    responsibleEmail: '',
    category: 'all',
    telefono: '',
  });

  const [specFormData, setSpecFormData] = useState({
    title: '',
    content: '',
    category: 'procedures' as 'requirements' | 'procedures' | 'commercial' | 'contacts' | 'other',
  });

  // Convert database companies to app Company model
  const convertedCompanies = (companies: any[]): Company[] => {
    return companies.map(company => ({
      id: company.id,
      logo: company.logo_url || '/placeholder.svg',
      name: company.nombre,
      website: company.sitio_web || '',
      mediatorAccess: company.sitio_web || '',
      responsibleEmail: company.email || '',
      category: (company.categoria as 'specific' | 'preferred' | 'all') || 'all',
      descripcion: company.descripcion,
      direccion: company.direccion,
      telefono: company.telefono,
    }));
  };

  // Apply category filter
  const applyFilters = () => {
    const filtered = filteredCompanias.filter(company => {
      const matchesCategory = categoryFilter === 'all' || 
        (company.categoria && company.categoria.toLowerCase() === categoryFilter);
      return matchesCategory;
    });
    return filtered;
  };

  // Get filtered specifications for a company
  const getFilteredSpecifications = (companyId: string | undefined) => {
    return specifications.filter(spec => {
      return companyId ? spec.companyId === companyId : false;
    });
  };

  return {
    companias,
    filteredCompanias,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createCompania,
    updateCompania,
    deleteCompania,
    refetch,
    specifications,
    setSpecifications,
    dialogOpen,
    setDialogOpen,
    specDialogOpen,
    setSpecDialogOpen,
    formMode,
    setFormMode,
    currentCompany,
    setCurrentCompany,
    selectedCompany,
    setSelectedCompany,
    viewMode,
    setViewMode,
    categoryFilter,
    setCategoryFilter,
    logoUrl,
    setLogoUrl,
    activeTab,
    setActiveTab,
    specCategories,
    setSpecCategories,
    categoryDialogOpen,
    setCategoryDialogOpen,
    categoryFormData,
    setCategoryFormData,
    formData,
    setFormData,
    specFormData,
    setSpecFormData,
    convertedCompanies,
    applyFilters,
    getFilteredSpecifications
  };
}

export type CompanyStateType = ReturnType<typeof useCompanyState>;
