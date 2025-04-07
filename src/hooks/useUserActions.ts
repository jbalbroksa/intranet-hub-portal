
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '@/hooks/useUsers';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';

type Delegation = {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
};

export type FormMode = 'create' | 'edit';
export type ViewMode = 'grid' | 'list';

export const useUserActions = () => {
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // Fetch delegations
  const { data: delegations = [] } = useSupabaseQuery<Delegation>(
    'delegaciones',
    ['delegaciones'],
    undefined,
    {
      select: 'id, nombre, direccion, telefono',
      orderBy: { column: 'nombre', ascending: true }
    }
  );
  
  // Form data
  const [formData, setFormData] = useState<Omit<User, 'id' | 'created_at'>>({
    name: '',
    email: '',
    role: 'user',
    position: '',
    delegation_id: '',
    bio: '',
    last_login: new Date().toISOString(),
  });

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (advancedFilters.role) count++;
    if (advancedFilters.delegation_id) count++;
    if (advancedFilters.lastLoginDays !== null) count++;
    return count;
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      position: '',
      delegation_id: '',
      bio: '',
      last_login: new Date().toISOString(),
    });
  };

  // Open dialog for creating a new user
  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing an existing user
  const openEditDialog = (user: User) => {
    setFormMode('edit');
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      position: user.position || '',
      delegation_id: user.delegation_id || '',
      bio: user.bio || '',
      last_login: user.last_login || new Date().toISOString(),
    });
    setDialogOpen(true);
  };

  // Open dialog for viewing user details
  const openDetailsDialog = (user: User) => {
    setCurrentUser(user);
    setDetailsDialogOpen(true);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle delegation change
  const handleDelegationChange = (value: string) => {
    setFormData({
      ...formData,
      delegation_id: value === "0" ? "" : value,
    });
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as 'admin' | 'user',
    });
  };

  // Set delegation filter
  const handleDelegationFilter = (delegationId: string) => {
    setSelectedDelegationFilter(delegationId === "all" ? null : delegationId);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Toggle view mode between grid and list
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
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Reset all filters
  const resetAllFilters = () => {
    setAdvancedFilters({
      role: null,
      delegation_id: null,
      lastLoginDays: null
    });
    setSelectedDelegationFilter(null);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get delegation name by id
  const getDelegationName = (delegationId?: string) => {
    if (!delegationId) return 'Sin delegación';
    const delegation = delegations.find(d => d.id === delegationId);
    return delegation ? delegation.nombre : 'Sin delegación';
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Create a new user
  const createUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
    try {
      // First, create an auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: Math.random().toString(36).slice(-8), // Generate a random password
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      });

      if (authError) throw authError;

      // Update the user record with additional information
      const { error: updateError } = await supabase
        .from('users')
        .update({
          position: userData.position,
          delegation_id: userData.delegation_id,
          bio: userData.bio,
          role: userData.role
        })
        .eq('id', authData.user.id);

      if (updateError) throw updateError;

      toast.success('Usuario creado correctamente. Se ha enviado un correo para establecer la contraseña.');
      return true;
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(`Error al crear usuario: ${error.message}`);
      return false;
    }
  };

  return {
    // Dialog state
    dialogOpen,
    setDialogOpen,
    detailsDialogOpen,
    setDetailsDialogOpen,
    formMode,
    currentUser,
    
    // Filter state
    selectedDelegationFilter,
    viewMode,
    advancedFiltersOpen,
    setAdvancedFiltersOpen,
    advancedFilters,
    countActiveFilters,
    
    // Pagination state
    currentPage,
    pageSize,
    
    // Form data
    formData,
    delegations,
    
    // Actions
    openCreateDialog,
    openEditDialog,
    openDetailsDialog,
    resetForm,
    handleInputChange,
    handleDelegationChange,
    handleRoleChange,
    handleDelegationFilter,
    toggleViewMode,
    openAdvancedFilters,
    applyAdvancedFilters,
    resetAllFilters,
    handlePageChange,
    getDelegationName,
    getInitials,
    createUser,
    setCurrentUser
  };
};
