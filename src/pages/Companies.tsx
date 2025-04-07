
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CompanyFilters from '@/components/companies/CompanyFilters';
import CompanyList from '@/components/companies/CompanyList';
import CompanyDetail from '@/components/companies/CompanyDetail';
import CompanyForm from '@/components/companies/CompanyForm';
import SpecificationForm from '@/components/companies/SpecificationForm';
import CategoryForm from '@/components/companies/CategoryForm';
import { useCompanyState } from '@/components/companies/CompanyState';
import { useCompanyActions } from '@/components/companies/CompanyActions';
import { useAuth } from '@/contexts/AuthContext';

const Companies = () => {
  const state = useCompanyState();
  const actions = useCompanyActions(state);
  const { isAdmin } = useAuth();
  
  const { 
    isLoading, 
    error, 
    searchTerm, 
    dialogOpen, 
    specDialogOpen, 
    categoryDialogOpen, 
    formMode, 
    selectedCompany, 
    viewMode, 
    categoryFilter, 
    logoUrl, 
    activeTab, 
    formData, 
    specFormData, 
    categoryFormData, 
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

      {isAdmin && (
        <>
          <Dialog open={dialogOpen} onOpenChange={state.setDialogOpen}>
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
                onSubmit={actions.handleSubmit}
                onCancel={() => state.setDialogOpen(false)}
                onInputChange={actions.handleInputChange}
                onCategoryChange={actions.handleCategoryChange}
                onLogoUpload={actions.handleLogoUpload}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={specDialogOpen} onOpenChange={state.setSpecDialogOpen}>
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
                onInputChange={actions.handleSpecInputChange}
                onCategoryChange={actions.handleSpecCategoryChange}
                onCancel={() => state.setSpecDialogOpen(false)}
                onSubmit={actions.handleSpecSubmit}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={categoryDialogOpen} onOpenChange={state.setCategoryDialogOpen}>
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
                onNameChange={actions.handleCategoryNameChange}
                onSlugChange={actions.handleCategorySlugChange}
                onCancel={() => state.setCategoryDialogOpen(false)}
                onSubmit={actions.handleCategorySubmit}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Companies;
