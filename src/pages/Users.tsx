import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, Plus, Edit, Trash, Shield, User as UserIcon, LayoutGrid, List, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

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
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedDelegationFilter?.toString() || "all"}
            onValueChange={handleDelegationFilter}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{selectedDelegationFilter ? 'Delegación: ' + getDelegationName(selectedDelegationFilter) : 'Todas las delegaciones'}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las delegaciones</SelectItem>
              {delegations.map(delegation => (
                <SelectItem key={delegation.id} value={delegation.id.toString()}>
                  {delegation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => toggleViewMode('grid')}
              className="rounded-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => toggleViewMode('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Users display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-poppins font-medium text-lg">{user.name}</h3>
                  
                  <div className="text-sm text-muted-foreground mt-1">{user.position}</div>
                  
                  <div className="mt-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted ml-2">
                      {getDelegationName(user.delegationId)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 w-full">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => openDetailsDialog(user)}
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Ver detalles
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="hidden md:table-cell">Delegación</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Rol</TableHead>
                  <TableHead className="hidden md:table-cell">Último acceso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                            <div className="text-sm text-muted-foreground">{user.position}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{getDelegationName(user.delegationId)}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="h-4 w-4 text-primary" />
                              <span>Administrador</span>
                            </>
                          ) : (
                            <>
                              <UserIcon className="h-4 w-4" />
                              <span>Usuario</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDetailsDialog(user)}>
                            <UserIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input 
                    id="position" 
                    name="position" 
                    value={formData.position} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delegation">Delegación</Label>
                  <Select 
                    value={formData.delegationId ? formData.delegationId.toString() : "0"} 
                    onValueChange={handleDelegationChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar delegación" />
                    </SelectTrigger>
                    <SelectContent>
                      {delegations.map(delegation => (
                        <SelectItem key={delegation.id} value={delegation.id.toString()}>
                          {delegation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange} 
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Rol</Label>
                <RadioGroup 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="cursor-pointer flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Administrador
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="cursor-pointer flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Usuario
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {formMode === 'create' && (
                <div className="text-sm text-muted-foreground">
                  <p>El usuario recibirá un correo electrónico con instrucciones para establecer su contraseña.</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {formMode === 'create' ? 'Crear' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User details dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          
          {currentUser && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarFallback className="text-lg">{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                
                <h3 className="font-medium text-xl">{currentUser.name}</h3>
                <div className="text-muted-foreground">{currentUser.position}</div>
                
                <div className="flex gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentUser.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                    {currentUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                    {getDelegationName(currentUser.delegationId)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                  <p>{currentUser.email}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Delegación</h4>
                  <p>{getDelegationName(currentUser.delegationId)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Último acceso</h4>
                  <p>{currentUser.lastLogin}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Biografía</h4>
                  <p className="text-sm whitespace-pre-line">{currentUser.bio}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => {
                  setDetailsDialogOpen(false);
                  openEditDialog(currentUser);
                }}>
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
