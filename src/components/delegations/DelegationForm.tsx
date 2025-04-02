
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Delegacion } from '@/types/database';

interface DelegationFormProps {
  formData: Partial<Delegacion>;
  formMode: 'create' | 'edit';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
}

const DelegationForm: React.FC<DelegationFormProps> = ({
  formData,
  formMode,
  onInputChange,
  onSubmit,
  onCancel,
  isPending
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input 
            id="nombre" 
            name="nombre" 
            value={formData.nombre || ''} 
            onChange={onInputChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input 
            id="direccion" 
            name="direccion" 
            value={formData.direccion || ''} 
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="codigo_postal">Código Postal</Label>
          <Input 
            id="codigo_postal" 
            name="codigo_postal" 
            value={formData.codigo_postal || ''} 
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ciudad">Localidad</Label>
          <Input 
            id="ciudad" 
            name="ciudad" 
            value={formData.ciudad || ''} 
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pais">País</Label>
          <Input 
            id="pais" 
            name="pais" 
            value={formData.pais || ''} 
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email || ''} 
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input 
            id="telefono" 
            name="telefono" 
            value={formData.telefono || ''} 
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="responsable">Responsable</Label>
          <Input 
            id="responsable" 
            name="responsable" 
            value={formData.responsable || ''} 
            onChange={onInputChange}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : formMode === 'create' ? 'Crear' : 'Guardar cambios'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default DelegationForm;
