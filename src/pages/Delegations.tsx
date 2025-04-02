
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash, Filter } from 'lucide-react';
import { useDelegaciones } from '@/hooks/useDelegaciones';
import { Delegacion } from '@/types/database';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Ciudad</TableHead>
                <TableHead className="hidden md:table-cell">País</TableHead>
                <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredDelegaciones.length > 0 ? (
                filteredDelegaciones.map((delegacion) => (
                  <TableRow key={delegacion.id}>
                    <TableCell className="font-medium">{delegacion.nombre}</TableCell>
                    <TableCell className="hidden md:table-cell">{delegacion.ciudad || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{delegacion.pais || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{delegacion.telefono || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{delegacion.email || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(delegacion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(delegacion.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No se encontraron delegaciones
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre || ''} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input 
                  id="direccion" 
                  name="direccion" 
                  value={formData.direccion || ''} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="codigo_postal">Código Postal</Label>
                <Input 
                  id="codigo_postal" 
                  name="codigo_postal" 
                  value={formData.codigo_postal || ''} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ciudad">Localidad</Label>
                <Input 
                  id="ciudad" 
                  name="ciudad" 
                  value={formData.ciudad || ''} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Input 
                  id="pais" 
                  name="pais" 
                  value={formData.pais || ''} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email || ''} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  name="telefono" 
                  value={formData.telefono || ''} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsable">Responsable</Label>
                <Input 
                  id="responsable" 
                  name="responsable" 
                  value={formData.responsable || ''} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createDelegacion.isPending || updateDelegacion.isPending}>
                {(createDelegacion.isPending || updateDelegacion.isPending) ? 'Guardando...' : formMode === 'create' ? 'Crear' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Delegations;
