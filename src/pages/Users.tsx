
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserFilters from '@/components/users/UserFilters';
import UserCard from '@/components/users/UserCard';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import UserDetail from '@/components/users/UserDetail';
import EmptyNotifications from '@/components/notifications/EmptyNotifications';
import { useUsers, User } from '@/hooks/useUsers';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type FormMode = 'create' | 'edit';
type ViewMode = 'grid' | 'list';

type Delegation = {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
};

const Users = () => {
  const { users, filteredUsers, isLoading, error, searchTerm, setSearchTerm, updateUser, deleteUser, refetch } = useUsers();
  const { isAdmin } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDelegationFilter, setSelectedDelegationFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const { data: delegations = [] } = useSupabaseQuery<Delegation>(
    'delegaciones',
    ['delegaciones'],
    undefined,
    {
      select: 'id, nombre, direccion, telefono',
      orderBy: { column: 'nombre', ascending: true }
    }
  );
  
  const [formData, setFormData] = useState<Omit<User, 'id' | 'created_at'>>({
    name: '',
    email: '',
    role: 'user',
    position: '',
    delegation_id: '',
    bio: '',
    last_login: new Date().toISOString(),
  });

  // Filter users based on search term and delegation
  const filteredUsersByDelegation = filteredUsers.filter(user => {
    const matchesDelegation = selectedDelegationFilter === null || user.delegation_id === selectedDelegationFilter;
    return matchesDelegation;
  });

  // Handle form input changes
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
      delegation_id: value,
    });
  };

  // Handle role change
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as 'admin' | 'user',
    });
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      toast.error("Solo los administradores pueden realizar esta acción");
      return;
    }
    
    if (formMode === 'edit' && currentUser) {
      try {
        await updateUser.mutateAsync({
          id: currentUser.id,
          data: formData as User
        });
        setDialogOpen(false);
        resetForm();
        toast.success('Usuario actualizado correctamente');
        refetch();
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Error al actualizar usuario');
      }
    } else {
      toast.error("La creación de usuarios debe realizarse a través del proceso de registro");
      setDialogOpen(false);
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

  // Set delegation filter
  const handleDelegationFilter = (delegationId: string) => {
    setSelectedDelegationFilter(delegationId === "all" ? null : delegationId);
  };

  // Toggle view mode between grid and list
  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
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
        selectedDelegationFilter={selectedDelegationFilter}
        viewMode={viewMode}
        delegations={delegations.map(d => ({ id: Number(d.id), name: d.nombre, address: d.direccion || '', phone: d.telefono || '' }))}
        onSearchChange={handleSearchChange}
        onDelegationFilterChange={handleDelegationFilter}
        onViewModeToggle={toggleViewMode}
        onCreateUserClick={openCreateDialog}
      />

      {/* Users display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsersByDelegation.length > 0 ? (
            filteredUsersByDelegation.map((user) => (
              <UserCard
                key={user.id}
                user={{
                  id: Number(user.id),
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  lastLogin: user.last_login || 'Nunca',
                  delegationId: Number(user.delegation_id || 0),
                  position: user.position || '',
                  bio: user.bio || '',
                }}
                delegationName={getDelegationName(user.delegation_id)}
                getInitials={getInitials}
                onDetailsClick={() => openDetailsDialog(user)}
                onEditClick={() => openEditDialog(user)}
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
                id: Number(user.id),
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: user.last_login || 'Nunca',
                delegationId: Number(user.delegation_id || 0),
                position: user.position || '',
                bio: user.bio || '',
              }))}
              getDelegationName={delegationId => getDelegationName(delegationId?.toString())}
              getInitials={getInitials}
              onDetailsClick={user => openDetailsDialog({ 
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                position: user.position,
                delegation_id: user.delegationId?.toString(),
                bio: user.bio,
                last_login: user.lastLogin
              })}
              onEditClick={user => openEditDialog({ 
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                position: user.position,
                delegation_id: user.delegationId?.toString(),
                bio: user.bio,
                last_login: user.lastLogin
              })}
              onDeleteClick={user => handleDelete(user.id.toString())}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Crear nuevo usuario' : 'Editar usuario'}
            </DialogTitle>
            <DialogDescription>
              Complete todos los campos para {formMode === 'create' ? 'crear un nuevo' : 'actualizar el'} usuario.
            </DialogDescription>
          </DialogHeader>
          
          <UserForm
            formData={{
              name: formData.name,
              email: formData.email,
              role: formData.role,
              position: formData.position || '',
              delegationId: Number(formData.delegation_id) || 0,
              bio: formData.bio || '',
            }}
            delegations={delegations.map(d => ({ id: Number(d.id), name: d.nombre, address: d.direccion || '', phone: d.telefono || '' }))}
            formMode={formMode}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            onInputChange={handleInputChange}
            onRoleChange={handleRoleChange}
            onDelegationChange={handleDelegationChange}
          />
        </DialogContent>
      </Dialog>

      {/* User details dialog */}
      <UserDetail
        user={currentUser ? {
          id: Number(currentUser.id),
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          lastLogin: currentUser.last_login || 'Nunca',
          delegationId: Number(currentUser.delegation_id || 0),
          position: currentUser.position || '',
          bio: currentUser.bio || '',
        } : null}
        isOpen={detailsDialogOpen}
        getDelegationName={delegationId => getDelegationName(delegationId?.toString())}
        getInitials={getInitials}
        onClose={() => setDetailsDialogOpen(false)}
        onEdit={() => {
          setDetailsDialogOpen(false);
          if (currentUser) {
            openEditDialog(currentUser);
          }
        }}
      />
    </div>
  );
};

export default Users;
