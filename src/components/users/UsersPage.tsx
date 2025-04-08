
import React from 'react';
import UserFilters from '@/components/users/UserFilters';
import UserDialogs from '@/components/users/UserDialogs';
import UserPagination from '@/components/users/UserPagination';
import UserAdvancedFilters from '@/components/users/UserAdvancedFilters';
import UserList from '@/components/users/UserList';
import UserFilterManager from '@/components/users/UserFilterManager';
import { useUsers, User } from '@/hooks/useUsers';
import { useUserActions } from '@/hooks/useUserActions';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ViewMode } from '@/hooks/users/useUserTypes';

const UsersPage = () => {
  const { users, isLoading, error, searchTerm, setSearchTerm, updateUser, deleteUser, refetch } = useUsers();
  const { user, isAdmin } = useAuth();
  const userActions = useUserActions();
  
  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    userActions.handlePageChange(1); // Reset to first page when searching
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error("Solo los administradores pueden realizar esta acción");
      return;
    }
    
    // Ensure all required fields have values before submitting
    const formDataForSubmit = {
      ...userActions.formData,
      position: userActions.formData.position || '', // Ensure position has a value, even if empty string
      delegation_id: userActions.formData.delegation_id || '',
      bio: userActions.formData.bio || ''
    };
    
    if (userActions.formMode === 'edit' && userActions.currentUser) {
      try {
        await updateUser.mutateAsync({
          id: userActions.currentUser.id,
          data: formDataForSubmit as User
        });
        userActions.setDialogOpen(false);
        userActions.resetForm();
        toast.success('Usuario actualizado correctamente');
        refetch();
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Error al actualizar usuario');
      }
    } else if (userActions.formMode === 'create') {
      try {
        const success = await userActions.createUser(formDataForSubmit);
        if (success) {
          userActions.setDialogOpen(false);
          userActions.resetForm();
          refetch();
        }
      } catch (error) {
        console.error('Error creating user:', error);
        toast.error('Error al crear usuario');
      }
    }
  };

  // Handle user deletion
  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.error("Solo los administradores pueden realizar esta acción");
      return;
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteUser.mutateAsync(id);
        toast.success('Usuario eliminado correctamente');
        refetch();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error al eliminar usuario');
      }
    }
  };

  // If loading or error, show appropriate message
  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error al cargar usuarios: {error.message}</div>;
  }

  // If user is not admin, show access denied message
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Acceso restringido</h2>
        <p className="text-muted-foreground">Solo los administradores pueden acceder a la gestión de usuarios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Search and filter bar */}
      <UserFilters
        searchTerm={searchTerm}
        selectedDelegationFilter={userActions.selectedDelegationFilter}
        viewMode={userActions.viewMode}
        delegations={userActions.delegations.map(d => ({ id: d.id, name: d.nombre, address: d.direccion || '', phone: d.telefono || '' }))}
        onSearchChange={handleSearchChange}
        onDelegationFilterChange={userActions.handleDelegationFilter}
        onViewModeToggle={userActions.toggleViewMode}
        onCreateUserClick={userActions.openCreateDialog}
        onAdvancedFiltersClick={userActions.openAdvancedFilters}
        activeFiltersCount={userActions.countActiveFilters()}
      />

      {/* Users display with filtering and pagination */}
      <UserFilterManager
        users={users}
        searchTerm={searchTerm}
        selectedDelegationFilter={userActions.selectedDelegationFilter}
        advancedFilters={userActions.advancedFilters}
      >
        {(filteredUsers) => {
          // Pagination
          const startIndex = (userActions.currentPage - 1) * userActions.pageSize;
          const paginatedUsers = filteredUsers.slice(startIndex, startIndex + userActions.pageSize);
          
          return (
            <>
              <UserList
                users={paginatedUsers}
                viewMode={userActions.viewMode}
                delegationName={userActions.getDelegationName}
                getInitials={userActions.getInitials}
                onDetailsClick={userActions.openDetailsDialog}
                onEditClick={userActions.openEditDialog}
                onDeleteClick={handleDelete}
              />
              
              {filteredUsers.length > userActions.pageSize && (
                <UserPagination
                  totalUsers={filteredUsers.length}
                  currentPage={userActions.currentPage}
                  pageSize={userActions.pageSize}
                  onPageChange={userActions.handlePageChange}
                />
              )}
            </>
          );
        }}
      </UserFilterManager>

      {/* User Dialogs */}
      <UserDialogs
        dialogOpen={userActions.dialogOpen}
        detailsDialogOpen={userActions.detailsDialogOpen}
        formMode={userActions.formMode}
        currentUser={userActions.currentUser}
        formData={{
          name: userActions.formData.name,
          email: userActions.formData.email,
          role: userActions.formData.role,
          position: userActions.formData.position || '',
          delegation_id: userActions.formData.delegation_id || '',
          bio: userActions.formData.bio || '',
        }}
        delegations={userActions.delegations.map(d => ({ id: d.id, name: d.nombre, address: d.direccion || '', phone: d.telefono || '' }))}
        getDelegationName={userActions.getDelegationName}
        getInitials={userActions.getInitials}
        onSetDialogOpen={userActions.setDialogOpen}
        onSetDetailsDialogOpen={userActions.setDetailsDialogOpen}
        onInputChange={userActions.handleInputChange}
        onRoleChange={userActions.handleRoleChange}
        onDelegationChange={userActions.handleDelegationChange}
        onSubmit={handleSubmit}
        onEdit={() => {
          userActions.setDetailsDialogOpen(false);
          if (userActions.currentUser) {
            userActions.openEditDialog(userActions.currentUser);
          }
        }}
      />

      {/* Advanced Filters Dialog */}
      <UserAdvancedFilters
        isOpen={userActions.advancedFiltersOpen}
        onClose={() => userActions.setAdvancedFiltersOpen(false)}
        delegations={userActions.delegations.map(d => ({ id: d.id, name: d.nombre, address: d.direccion || '', phone: d.telefono || '' }))}
        filters={userActions.advancedFilters}
        onApplyFilters={userActions.applyAdvancedFilters}
        onResetFilters={userActions.resetAllFilters}
      />
    </div>
  );
};

export default UsersPage;
