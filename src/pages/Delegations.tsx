
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash, Filter } from 'lucide-react';

// Mock data for delegations
const mockDelegations = [
  { id: 1, name: 'Delegación Madrid', address: 'Calle Gran Vía 28', postalCode: '28013', city: 'Madrid', province: 'Madrid', email: 'madrid@example.com', phone: '915555555', website: 'madrid.example.com' },
  { id: 2, name: 'Delegación Barcelona', address: 'Passeig de Gràcia 43', postalCode: '08007', city: 'Barcelona', province: 'Barcelona', email: 'barcelona@example.com', phone: '935555555', website: 'barcelona.example.com' },
  { id: 3, name: 'Delegación Valencia', address: 'Calle Colón 60', postalCode: '46004', city: 'Valencia', province: 'Valencia', email: 'valencia@example.com', phone: '965555555', website: 'valencia.example.com' },
  { id: 4, name: 'Delegación Sevilla', address: 'Avenida de la Constitución 20', postalCode: '41004', city: 'Sevilla', province: 'Sevilla', email: 'sevilla@example.com', phone: '955555555', website: 'sevilla.example.com' },
  { id: 5, name: 'Delegación Bilbao', address: 'Gran Vía 15', postalCode: '48001', city: 'Bilbao', province: 'Vizcaya', email: 'bilbao@example.com', phone: '945555555', website: 'bilbao.example.com' },
];

type Delegation = {
  id: number;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  email: string;
  phone: string;
  website: string;
};

type FormMode = 'create' | 'edit';

const Delegations = () => {
  const [delegations, setDelegations] = useState<Delegation[]>(mockDelegations);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [currentDelegation, setCurrentDelegation] = useState<Delegation | null>(null);
  const [formData, setFormData] = useState<Omit<Delegation, 'id'>>({
    name: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    email: '',
    phone: '',
    website: '',
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter delegations based on search term
  const filteredDelegations = delegations.filter(delegation => 
    delegation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delegation.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      postalCode: '',
      city: '',
      province: '',
      email: '',
      phone: '',
      website: '',
    });
  };

  // Open dialog for creating a new delegation
  const openCreateDialog = () => {
    setFormMode('create');
    resetForm();
    setDialogOpen(true);
  };

  // Open dialog for editing an existing delegation
  const openEditDialog = (delegation: Delegation) => {
    setFormMode('edit');
    setCurrentDelegation(delegation);
    setFormData({
      name: delegation.name,
      address: delegation.address,
      postalCode: delegation.postalCode,
      city: delegation.city,
      province: delegation.province,
      email: delegation.email,
      phone: delegation.phone,
      website: delegation.website,
    });
    setDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'create') {
      // Create new delegation
      const newDelegation: Delegation = {
        id: Math.max(0, ...delegations.map(d => d.id)) + 1,
        ...formData,
      };
      setDelegations([...delegations, newDelegation]);
    } else if (formMode === 'edit' && currentDelegation) {
      // Update existing delegation
      const updatedDelegations = delegations.map(delegation => 
        delegation.id === currentDelegation.id ? { ...delegation, ...formData } : delegation
      );
      setDelegations(updatedDelegations);
    }
    
    setDialogOpen(false);
    resetForm();
  };

  // Handle delegation deletion
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta delegación?')) {
      setDelegations(delegations.filter(delegation => delegation.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar delegaciones..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Delegación
          </Button>
        </div>
      </div>

      {/* Delegations table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Ciudad</TableHead>
                <TableHead className="hidden md:table-cell">Provincia</TableHead>
                <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDelegations.length > 0 ? (
                filteredDelegations.map((delegation) => (
                  <TableRow key={delegation.id}>
                    <TableCell className="font-medium">{delegation.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{delegation.city}</TableCell>
                    <TableCell className="hidden md:table-cell">{delegation.province}</TableCell>
                    <TableCell className="hidden md:table-cell">{delegation.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">{delegation.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(delegation)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(delegation.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No se encontraron delegaciones
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'Crear nueva delegación' : 'Editar delegación'}
            </DialogTitle>
            <DialogDescription>
              Complete todos los campos para {formMode === 'create' ? 'crear una nueva' : 'actualizar la'} delegación.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="address">Dirección</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Código Postal</Label>
                <Input 
                  id="postalCode" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Localidad</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">Provincia</Label>
                <Input 
                  id="province" 
                  name="province" 
                  value={formData.province} 
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
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Web</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleInputChange} 
                />
              </div>
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
    </div>
  );
};

export default Delegations;
