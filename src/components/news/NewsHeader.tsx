
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewsSearch from './NewsSearch';
import { Compania } from '@/types/database';

interface NewsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  companiaFilter: string | null;
  setCompaniaFilter: (compania: string | null) => void;
  companias: Compania[];
}

const NewsHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  companiaFilter, 
  setCompaniaFilter, 
  companias 
}: NewsHeaderProps) => {
  const navigate = useNavigate();
  
  const handleCreateNews = () => {
    navigate('/noticias/crear');
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <NewsSearch 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        companiaFilter={companiaFilter}
        setCompaniaFilter={setCompaniaFilter}
        companias={companias}
      />
      
      <Button onClick={handleCreateNews}>
        <Plus className="h-4 w-4 mr-2" />
        Crear noticia
      </Button>
    </div>
  );
};

export default NewsHeader;
