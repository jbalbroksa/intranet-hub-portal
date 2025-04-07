
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UserFilters from '@/components/users/UserFilters';
import UserCard from '@/components/users/UserCard';
import UserTable from '@/components/users/UserTable';
import UserDialogs from '@/components/users/UserDialogs';
import EmptyNotifications from '@/components/notifications/EmptyNotifications';
import { useUsers, User } from '@/hooks/useUsers';
import { useUserActions } from '@/hooks/useUserActions';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const UsersPage = () => {
  const { users, filteredUsers, isLoading, error, searchTerm, setSearchTerm, updateUser, deleteUser, refetch } = useUsers();
  const { isAdmin } = useAuth();
  const userActions = useUserActions();
  
  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error("Solo los administradores pueden realizar esta acción");
      return;
    }
    
    if (userActions.formMode === 'edit' && userActions.currentUser) {
      try {
        await updateUser.mutateAsync({
          id: userActions.currentUser.id,
          data: userActions.formData as User
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
        const success = await userActions.createUser(userActions.formData);
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

  // Filter users based on search term and delegation
  const filteredUsersByDelegation = filteredUsers.filter(user => {
    const matchesDelegation = userActions.selectedDelegationFilter === null || user.delegation_id === userActions.selectedDelegationFilter;
    return matchesDelegation;
  });

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
      />

      {/* Users display */}
      {userActions.viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsersByDelegation.length > 0 ? (
            filteredUsersByDelegation.map((user) => (
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
      ) : (
        <Card>
          <CardContent className="p-0">
            <UserTable
              users={filteredUsersByDelegation.map(user => ({
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
      )}

      {/* User Dialogs */}
      <UserDialogs
        dialogOpen={userActions.dialogOpen}
        detailsDialogOpen={userActions.detailsDialogOpen}
        formMode={userActions.formMode}
        currentUser={userActions.currentUser}
        formData={userActions.formData}
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
    </div>
  );
};

export default UsersPage;
