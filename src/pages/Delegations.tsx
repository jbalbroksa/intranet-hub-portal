
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Filter } from 'lucide-react';
import { useDelegaciones } from '@/hooks/useDelegaciones';
import { Delegacion } from '@/types/database';
import { toast } from '@/components/ui/use-toast';
import DelegationList from '@/components/delegations/DelegationList';
import DelegationForm from '@/components/delegations/DelegationForm';

type FormMode = 'create' | 'edit';

const Delegations = () => {
  const {
    filteredDelegaciones,
    isLoading,
    searchTerm,
    setSearchTerm,
    createDelegacion,
    updateDelegacion,
    deleteDelegacion
  } = useDelegaciones();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentDelegacion, setCurrentDelegacion] = useState<Delegacion | null>(null);
  const [formData, setFormData] = useState<Partial<Delegacion>>({
    nombre: '',
    direccion: '',
    codigo_postal: '',
    ciudad: '',
    pais: '',
    email: '',
    telefono: '',
    responsable: '',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      direccion: '',
      codigo_postal: '',
      ciudad: '',
      pais: '',
      email: '',
      telefono: '',
      responsable: '',
    });
  };

  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (delegacion: Delegacion) => {
    setFormMode('edit');
    setCurrentDelegacion(delegacion);
    setFormData({
      nombre: delegacion.nombre,
      direccion: delegacion.direccion || '',
      codigo_postal: delegacion.codigo_postal || '',
      ciudad: delegacion.ciudad || '',
      pais: delegacion.pais || '',
      email: delegacion.email || '',
      telefono: delegacion.telefono || '',
      responsable: delegacion.responsable || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formMode === 'create') {
        await createDelegacion.mutateAsync(formData);
        toast({
          title: "Delegación creada",
          description: "La delegación ha sido creada exitosamente",
        });
      } else if (formMode === 'edit' && currentDelegacion) {
        await updateDelegacion.mutateAsync({ 
          id: currentDelegacion.id, 
          data: formData 
        });
        toast({
          title: "Delegación actualizada",
          description: "La delegación ha sido actualizada exitosamente",
        });
      }
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar delegación:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al guardar la delegación",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta delegación?')) {
      try {
        await deleteDelegacion.mutateAsync(id);
        toast({
          title: "Delegación eliminada",
          description: "La delegación ha sido eliminada exitosamente",
        });
      } catch (error) {
        console.error('Error al eliminar delegación:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al eliminar la delegación",
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar delegaciones..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Delegación
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <DelegationList 
            delegaciones={filteredDelegaciones} 
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Crear nueva delegación' : 'Editar delegación'}
            </DialogTitle>
            <DialogDescription>
              Complete todos los campos para {formMode === 'create' ? 'crear una nueva' : 'actualizar la'} delegación.
            </DialogDescription>
          </DialogHeader>
          
          <DelegationForm
            formData={formData}
            formMode={formMode}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isPending={createDelegacion.isPending || updateDelegacion.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Delegations;
