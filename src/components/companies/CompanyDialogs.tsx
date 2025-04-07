
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CompanyForm from '@/components/companies/CompanyForm';
import SpecificationForm from '@/components/companies/SpecificationForm';
import CategoryForm from '@/components/companies/CategoryForm';

type CompanyDialogsProps = {
  state: any; // Using any here for brevity
  actions: any;
};

const CompanyDialogs: React.FC<CompanyDialogsProps> = ({ state, actions }) => {
  const { 
    dialogOpen, 
    specDialogOpen, 
    categoryDialogOpen, 
    formMode, 
    selectedCompany, 
    logoUrl, 
    formData, 
    specFormData, 
    categoryFormData, 
    specCategories 
  } = state;

  return (
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
  );
};

export default CompanyDialogs;
