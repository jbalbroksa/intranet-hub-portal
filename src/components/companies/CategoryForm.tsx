
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type CategoryFormProps = {
  name: string;
  slug: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  name,
  slug,
  onNameChange,
  onSlugChange,
  onCancel,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={onNameChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={onSlugChange}
            required
            placeholder="ejemplo-de-slug"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            El slug se genera automáticamente a partir del nombre, pero puede editarlo si lo desea.
          </p>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CategoryForm;
