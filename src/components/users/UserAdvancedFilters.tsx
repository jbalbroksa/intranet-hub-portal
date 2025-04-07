
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, User as UserIcon } from 'lucide-react';

type Delegation = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

type UserAdvancedFiltersProps = {
  isOpen: boolean;
  onClose: () => void;
  delegations: Delegation[];
  filters: {
    role: string | null;
    delegation_id: string | null;
    lastLoginDays: number | null;
  };
  onApplyFilters: (filters: {
    role: string | null;
    delegation_id: string | null;
    lastLoginDays: number | null;
  }) => void;
  onResetFilters: () => void;
};

const UserAdvancedFilters: React.FC<UserAdvancedFiltersProps> = ({
  isOpen,
  onClose,
  delegations,
  filters,
  onApplyFilters,
  onResetFilters
}) => {
  // Local state to manage filter changes
  const [localFilters, setLocalFilters] = React.useState({
    role: filters.role,
    delegation_id: filters.delegation_id,
    lastLoginDays: filters.lastLoginDays
  });

  // Reset local filters when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        role: filters.role,
        delegation_id: filters.delegation_id,
        lastLoginDays: filters.lastLoginDays
      });
    }
  }, [isOpen, filters]);

  // Handle filter changes
  const handleRoleChange = (value: string) => {
    setLocalFilters({ ...localFilters, role: value === 'all' ? null : value });
  };

  const handleDelegationChange = (value: string) => {
    setLocalFilters({ ...localFilters, delegation_id: value === 'all' ? null : value });
  };

  const handleLastLoginChange = (value: string) => {
    setLocalFilters({ 
      ...localFilters, 
      lastLoginDays: value === 'all' ? null : parseInt(value) 
    });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  // Handle reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      role: null,
      delegation_id: null,
      lastLoginDays: null
    };
    setLocalFilters(resetFilters);
    onResetFilters();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtros avanzados</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rol</Label>
            <RadioGroup 
              value={localFilters.role || 'all'} 
              onValueChange={handleRoleChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-roles" />
                <Label htmlFor="all-roles" className="cursor-pointer">Todos los roles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin-role" />
                <Label htmlFor="admin-role" className="cursor-pointer flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Administrador
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="user-role" />
                <Label htmlFor="user-role" className="cursor-pointer flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Usuario
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delegation">Delegación</Label>
            <Select 
              value={localFilters.delegation_id || "all"} 
              onValueChange={handleDelegationChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las delegaciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las delegaciones</SelectItem>
                {delegations.map(delegation => (
                  <SelectItem key={delegation.id} value={delegation.id}>
                    {delegation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastLogin">Último acceso</Label>
            <Select 
              value={localFilters.lastLoginDays?.toString() || "all"} 
              onValueChange={handleLastLoginChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquier fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier fecha</SelectItem>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
                <SelectItem value="-1">Nunca ha accedido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleResetFilters}>
            Resetear filtros
          </Button>
          <Button onClick={handleApplyFilters}>
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserAdvancedFilters;
