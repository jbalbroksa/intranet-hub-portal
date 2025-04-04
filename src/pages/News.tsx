
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useNoticias } from '@/hooks/useNoticias';
import { useNavigate } from 'react-router-dom';
import NewsSearch from '@/components/news/NewsSearch';
import NewsGridView from '@/components/news/NewsGridView';
import NewsListView from '@/components/news/NewsListView';

const News = () => {
  const navigate = useNavigate();
  const { 
    filteredNoticias, 
    companias,
    isLoading, 
    loadingCompanias,
    error, 
    searchTerm, 
    setSearchTerm,
    companiaFilter,
    setCompaniaFilter
  } = useNoticias();
  
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

  // Create new news
  const handleCreateNews = () => {
    navigate('/noticias/crear');
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando noticias...</div>;
  }

  if (error) {
    return <div className="text-destructive p-8">Error al cargar noticias: {error.message}</div>;
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header with search and buttons */}
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

      {/* View selector */}
      <div className="flex justify-end">
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as 'grid' | 'list')}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* MAIN TABS - Wrapping all TabsContent components */}
      <Tabs value={currentView} className="mt-0">
        {/* News grid view */}
        <TabsContent value="grid" className="mt-0">
          <NewsGridView 
            filteredNoticias={filteredNoticias}
            companias={companias}
          />
        </TabsContent>

        {/* News list view */}
        <TabsContent value="list" className="mt-0">
          <NewsListView 
            filteredNoticias={filteredNoticias}
            companias={companias}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default News;
