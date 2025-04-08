
import { useUserFilters } from './users/useUserFilters';
import { useUserPagination } from './users/useUserPagination';
import { useUserDialogs } from './users/useUserDialogs';
import { useUserHelpers } from './users/useUserHelpers';
import { useUserMutations } from './users/useUserMutations';
import type { FormMode, ViewMode } from './users/useUserTypes';

export type { FormMode, ViewMode };

export const useUserActions = () => {
  const filters = useUserFilters();
  const pagination = useUserPagination();
  const dialogs = useUserDialogs();
  const helpers = useUserHelpers();
  const mutations = useUserMutations();

  return {
    // Re-export all the hooks functionality
    ...filters,
    ...pagination,
    ...dialogs,
    ...helpers,
    ...mutations
  };
};
