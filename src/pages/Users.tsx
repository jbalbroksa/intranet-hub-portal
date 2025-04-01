
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserFilters from '@/components/users/UserFilters';
import UserCard from '@/components/users/UserCard';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import UserDetail from '@/components/users/UserDetail';
import EmptyNotifications from '@/components/notifications/EmptyNotifications';

// Mock data for delegations
const mockDelegations: Delegation[] = [
  { id: 1, name: 'Madrid', address: 'Calle Principal 123, Madrid', phone: '911234567' },
  { id: 2, name: 'Barcelona', address: 'Avenida Diagonal 456, Barcelona', phone: '931234567' },
  { id: 3, name: 'Valencia', address: 'Calle del Mar 789, Valencia', phone: '961234567' },
  { id: 4, name: 'Sevilla', address: 'Avenida de la Constitución 23, Sevilla', phone: '951234567' },
];

// Mock data for users with explicit type definitions
const mockUsers: User[] = [
  { id: 1, name: 'Admin Usuario', email: 'admin@example.com', role: 'admin', lastLogin: '2023-05-01', delegationId: 1, position: 'Director', bio: 'Profesional con más de 15 años de experiencia en el sector asegurador.' },
  { id: 2, name: 'Usuario Normal', email: 'usuario@example.com', role: 'user', lastLogin: '2023-05-05', delegationId: 1, position: 'Agente', bio: 'Especialista en seguros de vida y salud.' },
  { id: 3, name: 'María García', email: 'maria@example.com', role: 'user', lastLogin: '2023-05-10', delegationId: 2, position: 'Administrativa', bio: 'Responsable de atención al cliente y gestión administrativa.' },
  { id: 4, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'admin', lastLogin: '2023-05-12', delegationId: 2, position: 'Responsable', bio: 'Experto en productos de protección patrimonial y planificación financiera.' },
  { id: 5, name: 'Laura Pérez', email: 'laura@example.com', role: 'user', lastLogin: '2023-05-15', delegationId: 3, position: 'Comercial', bio: 'Especializada en seguros de empresas y responsabilidad civil.' },
  { id: 6, name: 'Javier Martínez', email: 'javier@example.com', role: 'user', lastLogin: '2023-05-18', delegationId: 3, position: 'Técnico', bio: 'Técnico especialista en valoración de riesgos industriales.' },
  { id: 7, name: 'Ana López', email: 'ana@example.com', role: 'user', lastLogin: '2023-05-20', delegationId: 4, position: 'Agente', bio: 'Profesional con amplia experiencia en seguros del hogar y automóvil.' },
  { id: 8, name: 'Miguel Sánchez', email: 'miguel@example.com', role: 'admin', lastLogin: '2023-05-22', delegationId: 4, position: 'Director', bio: 'Responsable de operaciones y desarrollo de negocio.' },
];

type Delegation = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: string;
  delegationId: number;
  position: string;
  bio: string;
};

type FormMode = 'create' | 'edit';
type ViewMode = 'grid' | 'list';

const Users = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [delegations] = useState<Delegation[]>(mockDelegations);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDelegationFilter, setSelectedDelegationFilter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const [formData, setFormData] = useState<Omit<User, 'id' | 'lastLogin'>>({
    name: '',
    email: '',
    role: 'user',
    delegationId: 0,
    position: '',
    bio: '',
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term and delegation
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDelegation = selectedDelegationFilter === null || user.delegationId === selectedDelegationFilter;
    
    return matchesSearch && matchesDelegation;
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
      delegationId: parseInt(value),
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
      delegationId: 0,
      position: '',
      bio: '',
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
      delegationId: user.delegationId,
      position: user.position,
      bio: user.bio,
    });
    setDialogOpen(true);
  };

  // Open dialog for viewing user details
  const openDetailsDialog = (user: User) => {
    setCurrentUser(user);
    setDetailsDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      // Create new user
      const newUser: User = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        ...formData,
        lastLogin: 'Nunca',
      };
      setUsers([...users, newUser]);
    } else if (formMode === 'edit' && currentUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  // Handle user deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  // Set delegation filter
  const handleDelegationFilter = (delegationId: string) => {
    setSelectedDelegationFilter(delegationId === "all" ? null : parseInt(delegationId));
  };

  // Toggle view mode between grid and list
  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Get delegation name by id
  const getDelegationName = (delegationId: number) => {
    const delegation = delegations.find(d => d.id === delegationId);
    return delegation ? delegation.name : 'Sin delegación';
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

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Search and filter bar */}
      <UserFilters
        searchTerm={searchTerm}
        selectedDelegationFilter={selectedDelegationFilter}
        viewMode={viewMode}
        delegations={delegations}
        onSearchChange={handleSearchChange}
        onDelegationFilterChange={handleDelegationFilter}
        onViewModeToggle={toggleViewMode}
        onCreateUserClick={openCreateDialog}
      />

      {/* Users display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                delegationName={getDelegationName(user.delegationId)}
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
              users={filteredUsers}
              getDelegationName={getDelegationName}
              getInitials={getInitials}
              onDetailsClick={openDetailsDialog}
              onEditClick={openEditDialog}
              onDeleteClick={handleDelete}
            />
          </CardContent>
        </Card>
      )}

      {/* Create/Edit dialog */}
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
            formData={formData}
            delegations={delegations}
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
        user={currentUser}
        isOpen={detailsDialogOpen}
        getDelegationName={getDelegationName}
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
