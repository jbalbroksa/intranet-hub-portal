
export type Company = {
  id: string;
  logo: string;
  name: string;
  website: string;
  mediatorAccess: string;
  responsibleEmail: string;
  category: 'specific' | 'preferred' | 'all';
  descripcion?: string;
  direccion?: string;
  telefono?: string;
};

export type SpecificationCategory = 'requirements' | 'procedures' | 'commercial' | 'contacts' | 'other';

export type Specification = {
  id: number;
  companyId: string;
  title: string;
  content: string;
  category: SpecificationCategory;
};

export type SpecCategory = {
  id: number;
  name: string;
  slug: string;
};
