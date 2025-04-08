
export type FormMode = 'create' | 'edit' | 'view';
export type ViewMode = 'grid' | 'list';

export type AdvancedFilters = {
  role?: string | null;
  delegation_id?: string | null;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  active?: boolean;
  lastLoginDays?: number | null;
};
