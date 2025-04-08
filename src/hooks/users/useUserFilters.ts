
import { useState } from 'react';
import { ViewMode, AdvancedFilters } from '@/hooks/users/useUserTypes';

export const useUserFilters = () => {
  // Filter state
  const [selectedDelegationFilter, setSelectedDelegationFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<{
    role: string | null;
    delegation_id: string | null;
    lastLoginDays: number | null;
  }>({
    role: null,
    delegation_id: null,
    lastLoginDays: null
  });
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (advancedFilters.role) count++;
    if (advancedFilters.delegation_id) count++;
    if (advancedFilters.lastLoginDays !== null) count++;
    return count;
  };

  // Set delegation filter
  const handleDelegationFilter = (delegationId: string) => {
    setSelectedDelegationFilter(delegationId === "all" ? null : delegationId);
  };

  // Toggle view mode between grid and table
  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Open advanced filters dialog
  const openAdvancedFilters = () => {
    setAdvancedFiltersOpen(true);
  };

  // Apply advanced filters
  const applyAdvancedFilters = (filters: {
    role: string | null;
    delegation_id: string | null;
    lastLoginDays: number | null;
  }) => {
    setAdvancedFilters(filters);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setAdvancedFilters({
      role: null,
      delegation_id: null,
      lastLoginDays: null
    });
    setSelectedDelegationFilter(null);
  };

  return {
    // Filter state
    selectedDelegationFilter,
    viewMode,
    advancedFiltersOpen,
    setAdvancedFiltersOpen,
    advancedFilters,
    countActiveFilters,
    
    // Actions
    handleDelegationFilter,
    toggleViewMode,
    openAdvancedFilters,
    applyAdvancedFilters,
    resetAllFilters
  };
};
