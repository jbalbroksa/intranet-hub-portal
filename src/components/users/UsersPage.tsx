
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UserFilters from '@/components/users/UserFilters';
import UserCard from '@/components/users/UserCard';
import UserTable from '@/components/users/UserTable';
import UserDialogs from '@/components/users/UserDialogs';
import UserPagination from '@/components/users/UserPagination';
import UserAdvancedFilters from '@/components/users/UserAdvancedFilters';
import EmptyNotifications from '@/components/notifications/EmptyNotifications';
import { useUsers, User } from '@/hooks/useUsers';
import { useUserActions } from '@/hooks/useUserActions';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const UsersPage = () => {
  const { users, filteredUsers, isLoading, error, searchTerm, setSearchTerm, updateUser, deleteUser, refetch } = useUsers();
  const { isAdmin } = useAuth();
  const userActions = useUserActions();
  
  // Calculate users for current page
  const applyFilters = () => {
    // First apply quick filters (search and delegation)
    let filtered = filteredUsers.filter(user => {
      // Apply main delegation filter
      const matchesDelegation = userActions.selectedDelegationFilter === null || 
        user.delegation_id === userActions.selectedDelegationFilter;
      
      return matchesDelegation;
    });
    
    // Then apply advanced filters
    if (userActions.advancedFilters.role) {
      filtered = filtered.filter(user => user.role === userActions.advancedFilters.role);
    }
    
    if (userActions.advancedFilters.delegation_id) {
      filtered = filtered.filter(user => user.delegation_id === userActions.advancedFilters.delegation_id);
    }
    
    if (userActions.advancedFilters.lastLoginDays !== null) {
      const now = new Date();
      if (userActions.advancedFilters.lastLoginDays === -1) {
        // Filter users who never logged in
        filtered = filtered.filter(user => !user.last_login || user.last_login === "Nunca");
      } else {
        // Filter users by last login date
        const cutoffDate = new Date(now.setDate(now.getDate() - userActions.advancedFilters.lastLoginDays!));
        filtered = filtered.filter(user => {
          if (!user.last_login || user.last_login === "Nunca") return false;
          const lastLogin = new Date(user.last_login);
          return lastLogin >= cutoffDate;
        });
      }
    }
    
    return filtered;
  };
  
  const filteredAndPaginatedUsers = () => {
    const filteredUsers = applyFilters();
    const startIndex = (userActions.currentPage - 1) * userActions.pageSize;
    return filteredUsers.slice(startIndex, startIndex + userActions.pageSize);
  };
  
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

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Acceso restringido</h2>
        <p className="text-muted-foreground">Solo los administradores pueden acceder a la gestión de usuarios.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">Error al cargar usuarios: {error.message}</div>;
  }

  const filteredUsersList = applyFilters();
  const paginatedUsers = filteredAndPaginatedUsers();

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

      {/* Users display */}
      {userActions.viewMode === 'grid' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.last_login || 'Nunca',
                    delegationId: user.delegation_id || '',
                    position: user.position || '',
                    bio: user.bio || '',
                  }}
                  delegationName={userActions.getDelegationName(user.delegation_id || '')}
                  getInitials={userActions.getInitials}
                  onDetailsClick={() => userActions.openDetailsDialog(user)}
                  onEditClick={() => userActions.openEditDialog(user)}
                  onDeleteClick={() => handleDelete(user.id)}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyNotifications />
              </div>
            )}
          </div>
          {filteredUsersList.length > userActions.pageSize && (
            <UserPagination
              totalUsers={filteredUsersList.length}
              currentPage={userActions.currentPage}
              pageSize={userActions.pageSize}
              onPageChange={userActions.handlePageChange}
            />
          )}
        </>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <UserTable
                users={paginatedUsers.map(user => ({
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  lastLogin: user.last_login || 'Nunca',
                  delegationId: user.delegation_id || '',
                  position: user.position || '',
                  bio: user.bio || '',
                }))}
                getDelegationName={userActions.getDelegationName}
                getInitials={userActions.getInitials}
                onDetailsClick={user => userActions.openDetailsDialog({ 
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  position: user.position,
                  delegation_id: user.delegationId,
                  bio: user.bio,
                  last_login: user.lastLogin
                })}
                onEditClick={user => userActions.openEditDialog({ 
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  position: user.position,
                  delegation_id: user.delegationId,
                  bio: user.bio,
                  last_login: user.lastLogin
                })}
                onDeleteClick={user => handleDelete(user.id)}
              />
            </CardContent>
          </Card>
          {filteredUsersList.length > userActions.pageSize && (
            <UserPagination
              totalUsers={filteredUsersList.length}
              currentPage={userActions.currentPage}
              pageSize={userActions.pageSize}
              onPageChange={userActions.handlePageChange}
            />
          )}
        </>
      )}

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
