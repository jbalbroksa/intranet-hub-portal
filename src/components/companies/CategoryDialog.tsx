
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from './CategoryForm';

export type CategoryFormData = {
  name: string;
  slug: string;
};

type CategoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
  initialData?: CategoryFormData;
};

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
    } else {
      setName('');
      setSlug('');
    }
  }, [initialData, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Si el usuario no ha editado manualmente el slug, actualizarlo automáticamente
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, slug });
  };

  // Función para generar slug a partir del nombre
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar categoría' : 'Añadir categoría'}
          </DialogTitle>
        </DialogHeader>
        
        <CategoryForm 
          name={name}
          slug={slug}
          onNameChange={handleNameChange}
          onSlugChange={handleSlugChange}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
