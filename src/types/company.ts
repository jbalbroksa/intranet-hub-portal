
export type Company = {
  id: number;
  logo: string;
  name: string;
  website: string;
  mediatorAccess: string;
  responsibleEmail: string;
  category: 'specific' | 'preferred' | 'all';
};

export type SpecificationCategory = 'requirements' | 'procedures' | 'commercial' | 'contacts' | 'other';

export type Specification = {
  id: number;
  companyId: number;
  title: string;
  content: string;
  category: SpecificationCategory;
};

export type SpecCategory = {
  id: number;
  name: string;
  slug: string;
};
