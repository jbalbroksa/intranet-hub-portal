
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Trash } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Company, Specification, SpecCategory } from '@/types/company';
import SpecificationItem from './SpecificationItem';
import CategoryTable from './CategoryTable';

type CompanyDetailProps = {
  company: Company;
  specifications: Specification[];
  specCategories: SpecCategory[];
  activeTab: string;
  onBackClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onTabChange: (value: string) => void;
  onAddSpecClick: () => void;
  onDeleteSpec: (id: number) => void;
  onAddCategoryClick: () => void;
  onDeleteCategory: (id: number) => void;
  getCategoryLabel: (category: string) => string;
};

const CompanyDetail: React.FC<CompanyDetailProps> = ({
  company,
  specifications,
  specCategories,
  activeTab,
  onBackClick,
  onEditClick,
  onDeleteClick,
  onTabChange,
  onAddSpecClick,
  onDeleteSpec,
  onAddCategoryClick,
  onDeleteCategory,
  getCategoryLabel
}) => {
  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBackClick} className="mb-4">
          &larr; Volver a la lista
        </Button>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={onDeleteClick}>
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
                src={company.logo} 
                alt={`${company.name} logo`} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">{company.name}</CardTitle>
              <CardDescription>
                <a 
                  href={`https://${company.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {company.website}
                </a>
              </CardDescription>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {getCategoryLabel(company.category)}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
                    <p className="text-sm">{company.responsibleEmail}</p>
                  </div>
                  <div>
                    <Label>Acceso Mediador</Label>
                    <p className="text-sm">
                      <a 
                        href={`https://${company.mediatorAccess}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {company.mediatorAccess}
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
                    <p className="text-sm">{getCategoryLabel(company.category)}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="specs" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Especificaciones</h3>
              <Button onClick={onAddSpecClick}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Especificación
              </Button>
            </div>
            
            {specifications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {specifications.map((spec) => (
                  <SpecificationItem
                    key={spec.id}
                    specification={spec}
                    specCategories={specCategories}
                    onDelete={onDeleteSpec}
                  />
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
              <Button onClick={onAddCategoryClick}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Categoría
              </Button>
            </div>
            
            {specCategories.length > 0 ? (
              <CategoryTable
                categories={specCategories}
                onDelete={onDeleteCategory}
              />
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No hay categorías definidas. Haga clic en "Añadir Categoría" para crear una.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CompanyDetail;
