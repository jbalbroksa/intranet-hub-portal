
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, LayoutGrid, List, Plus } from 'lucide-react';

type Delegation = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

type UserFiltersProps = {
  searchTerm: string;
  selectedDelegationFilter: string | null;
  viewMode: 'grid' | 'list';
  delegations: Delegation[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelegationFilterChange: (delegationId: string) => void;
  onViewModeToggle: (mode: 'grid' | 'list') => void;
  onCreateUserClick: () => void;
};

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  selectedDelegationFilter,
  viewMode,
  delegations,
  onSearchChange,
  onDelegationFilterChange,
  onViewModeToggle,
  onCreateUserClick
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuarios..."
          className="pl-9"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select
          value={selectedDelegationFilter?.toString() || "all"}
          onValueChange={onDelegationFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span>{selectedDelegationFilter ? 'Delegación: ' + delegations.find(d => d.id === selectedDelegationFilter)?.name : 'Todas las delegaciones'}</span>
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
            onClick={() => onViewModeToggle('grid')}
            className="rounded-none"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => onViewModeToggle('list')}
            className="rounded-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={onCreateUserClick}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
