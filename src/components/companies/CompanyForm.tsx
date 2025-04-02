
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DialogFooter } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { Company } from '@/types/company';
import { Textarea } from '@/components/ui/textarea';

// Define FormData type that matches both CompaniaFormData and Company structure
export type CompanyFormData = {
  name: string;
  logo: string;
  website: string;
  mediatorAccess: string;
  responsibleEmail: string;
  category: 'specific' | 'preferred' | 'all';
  descripcion?: string;
  direccion?: string;
  telefono?: string;
};

type CompanyFormProps = {
  formData: CompanyFormData;
  formMode: 'create' | 'edit';
  logoUrl: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CompanyForm: React.FC<CompanyFormProps> = ({
  formData,
  formMode,
  logoUrl,
  onSubmit,
  onCancel,
  onInputChange,
  onCategoryChange,
  onLogoUpload
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 border rounded-md flex items-center justify-center overflow-hidden bg-muted/30">
              <img 
                src={logoUrl}
                alt="Company logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm px-3 py-2 border rounded-md hover:bg-muted transition-colors">
                <Upload className="h-4 w-4" />
                <span>Subir logo</span>
              </div>
              <input 
                type="file" 
                id="logo" 
                accept="image/*" 
                className="hidden" 
                onChange={onLogoUpload} 
              />
            </label>
          </div>
        </div>
        
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
            <Label htmlFor="website">Web</Label>
            <Input 
              id="website" 
              name="website" 
              value={formData.website} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mediatorAccess">Acceso Mediador</Label>
            <Input 
              id="mediatorAccess" 
              name="mediatorAccess" 
              value={formData.mediatorAccess} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsibleEmail">Email Responsable</Label>
            <Input 
              id="responsibleEmail" 
              name="responsibleEmail" 
              type="email" 
              value={formData.responsibleEmail} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input 
              id="telefono" 
              name="telefono" 
              value={formData.telefono || ""} 
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea 
            id="descripcion" 
            name="descripcion" 
            value={formData.descripcion || ""} 
            onChange={onInputChange}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Textarea 
            id="direccion" 
            name="direccion" 
            value={formData.direccion || ""} 
            onChange={onInputChange}
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Categoría</Label>
          <RadioGroup 
            value={formData.category} 
            onValueChange={onCategoryChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="specific" />
              <Label htmlFor="specific" className="cursor-pointer">Específica</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="preferred" id="preferred" />
              <Label htmlFor="preferred" className="cursor-pointer">Preferente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer">Todas</Label>
            </div>
          </RadioGroup>
        </div>
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

export default CompanyForm;
