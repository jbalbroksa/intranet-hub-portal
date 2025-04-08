
export type FormMode = 'create' | 'edit' | 'view';
export type ViewMode = 'grid' | 'table';

export type AdvancedFilters = {
  role?: string;
  delegation?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  active?: boolean;
};
