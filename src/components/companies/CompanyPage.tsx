
import React from 'react';
import CompanyFilters from '@/components/companies/CompanyFilters';
import CompanyList from '@/components/companies/CompanyList';
import CompanyDetail from '@/components/companies/CompanyDetail';
import { useCompanyState } from '@/components/companies/CompanyState';
import { useCompanyActions } from '@/components/companies/CompanyActions';
import { useAuth } from '@/contexts/AuthContext';
import CompanyDialogs from '@/components/companies/CompanyDialogs';

const CompanyPage = () => {
  const state = useCompanyState();
  const actions = useCompanyActions(state);
  const { isAdmin } = useAuth();
  
  const { 
    isLoading, 
    error, 
    searchTerm, 
    selectedCompany, 
    viewMode, 
    categoryFilter, 
    activeTab, 
    specCategories, 
    companias
  } = state;

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
        specifications={state.getFilteredSpecifications(selectedCompany.id)}
        specCategories={specCategories}
        activeTab={activeTab}
        onBackClick={actions.backToList}
        onEditClick={() => isAdmin && actions.openEditDialog(selectedCompany)}
        onDeleteClick={() => isAdmin && actions.handleDelete(selectedCompany.id)}
        onTabChange={state.setActiveTab}
        onAddSpecClick={isAdmin && actions.openAddSpecDialog}
        onDeleteSpec={isAdmin ? actions.handleDeleteSpec : undefined}
        onAddCategoryClick={isAdmin && actions.openAddCategoryDialog}
        onDeleteCategory={isAdmin ? actions.handleDeleteCategory : undefined}
        getCategoryLabel={actions.getCategoryLabel}
      />
    );
  }

  const filteredCompaniesWithCategoryFilter = state.applyFilters();
  const convertedCompanies = state.convertedCompanies(filteredCompaniesWithCategoryFilter);

  return (
    <div className="space-y-6 animate-slideInUp">
      <CompanyFilters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        viewMode={viewMode}
        onSearchChange={(e) => state.setSearchTerm(e.target.value)}
        onCategoryFilterChange={state.setCategoryFilter}
        onViewModeChange={state.setViewMode}
        onCreateClick={isAdmin ? actions.openCreateDialog : undefined}
      />

      <CompanyList
        companies={convertedCompanies}
        viewMode={viewMode}
        getCategoryLabel={actions.getCategoryLabel}
        onViewCompany={(company) => {
          const originalCompany = companias.find(c => c.id === company.id);
          if (originalCompany) {
            actions.viewCompanyDetails({
              ...company,
              descripcion: originalCompany.descripcion,
              direccion: originalCompany.direccion,
              telefono: originalCompany.telefono,
            });
          }
        }}
        onEditCompany={isAdmin ? (company) => {
          const originalCompany = companias.find(c => c.id === company.id);
          if (originalCompany) {
            actions.openEditDialog(originalCompany);
          }
        } : undefined}
        onDeleteCompany={isAdmin ? (id) => actions.handleDelete(id.toString()) : undefined}
      />

      {isAdmin && <CompanyDialogs state={state} actions={actions} />}
    </div>
  );
};

export default CompanyPage;
