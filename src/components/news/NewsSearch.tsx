
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compania } from '@/types/database';

interface NewsSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  companiaFilter: string | null;
  setCompaniaFilter: (compania: string | null) => void;
  companias: Compania[];
}

const NewsSearch = ({ searchTerm, setSearchTerm, companiaFilter, setCompaniaFilter, companias }: NewsSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar noticias..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Select value={companiaFilter || 'none'} onValueChange={setCompaniaFilter}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filtrar por compañía" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Todas las compañías</SelectItem>
          {companias.map(company => (
            <SelectItem key={company.id} value={company.id}>
              {company.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default NewsSearch;
