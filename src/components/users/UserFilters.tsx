import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, LayoutGrid, List, Plus, SlidersHorizontal } from 'lucide-react';

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
  onAdvancedFiltersClick: () => void;
  activeFiltersCount: number;
};

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  selectedDelegationFilter,
  viewMode,
  delegations,
  onSearchChange,
  onDelegationFilterChange,
  onViewModeToggle,
  onCreateUserClick,
  onAdvancedFiltersClick,
  activeFiltersCount
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
              <SelectItem key={delegation.id} value={delegation.id}>
                {delegation.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          onClick={onAdvancedFiltersClick}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros avanzados
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        
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
