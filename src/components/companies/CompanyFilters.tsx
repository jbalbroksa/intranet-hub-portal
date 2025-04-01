
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus } from 'lucide-react';

type CategoryFilter = 'all' | 'specific' | 'preferred';
type ViewMode = 'grid' | 'list';

type CompanyFiltersProps = {
  searchTerm: string;
  categoryFilter: CategoryFilter;
  viewMode: ViewMode;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryFilterChange: (value: CategoryFilter) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateClick: () => void;
};

const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  searchTerm,
  categoryFilter,
  viewMode,
  onSearchChange,
  onCategoryFilterChange,
  onViewModeChange,
  onCreateClick
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar compañías..."
          className="pl-9"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Tabs value={categoryFilter} onValueChange={(v) => onCategoryFilterChange(v as CategoryFilter)} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="preferred">Preferentes</TabsTrigger>
            <TabsTrigger value="specific">Específicas</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 ml-auto">
          <div className="border rounded-md flex overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => onViewModeChange('grid')}
              className="rounded-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => onViewModeChange('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Compañía
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyFilters;
