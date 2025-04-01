
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { SpecCategory } from '@/types/company';

type SpecFormData = {
  title: string;
  content: string;
  category: string;
};

type SpecificationFormProps = {
  formData: SpecFormData;
  specCategories: SpecCategory[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

const SpecificationForm: React.FC<SpecificationFormProps> = ({
  formData,
  specCategories,
  onInputChange,
  onCategoryChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={onCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {specCategories.map(category => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Contenido</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={onInputChange}
            rows={6}
            required
          />
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

export default SpecificationForm;
