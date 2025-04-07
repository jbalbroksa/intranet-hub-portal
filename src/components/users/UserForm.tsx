
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User as UserIcon } from 'lucide-react';

type Delegation = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

type UserFormProps = {
  formData: {
    name: string;
    email: string;
    role: 'admin' | 'user';
    delegationId: string;
    position: string;
    bio: string;
  };
  delegations: Delegation[];
  formMode: 'create' | 'edit';
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRoleChange: (value: string) => void;
  onDelegationChange: (value: string) => void;
};

const UserForm: React.FC<UserFormProps> = ({
  formData,
  delegations,
  formMode,
  onSubmit,
  onCancel,
  onInputChange,
  onRoleChange,
  onDelegationChange
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Cargo</Label>
            <Input 
              id="position" 
              name="position" 
              value={formData.position} 
              onChange={onInputChange} 
              placeholder="Ingrese el cargo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delegation">Delegación</Label>
            <Select 
              value={formData.delegationId || "0"} 
              onValueChange={onDelegationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar delegación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sin delegación</SelectItem>
                {delegations.map(delegation => (
                  <SelectItem key={delegation.id} value={delegation.id}>
                    {delegation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Biografía</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            value={formData.bio} 
            onChange={onInputChange} 
            rows={3}
            placeholder="Información adicional sobre el usuario"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Rol</Label>
          <RadioGroup 
            value={formData.role} 
            onValueChange={onRoleChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin" className="cursor-pointer flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Administrador
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user" className="cursor-pointer flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Usuario
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {formMode === 'create' && (
          <div className="text-sm text-muted-foreground">
            <p>El usuario recibirá un correo electrónico con instrucciones para establecer su contraseña.</p>
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {formMode === 'create' ? 'Crear' : 'Guardar cambios'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;
