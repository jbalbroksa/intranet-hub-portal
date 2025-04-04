
import React, { useState } from 'react';
import { useNoticias } from '@/hooks/useNoticias';
import NewsHeader from '@/components/news/NewsHeader';
import NewsViewSelector from '@/components/news/NewsViewSelector';
import NewsContent from '@/components/news/NewsContent';

const News = () => {
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

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando noticias...</div>;
  }

  if (error) {
    return <div className="text-destructive p-8">Error al cargar noticias: {error.message}</div>;
  }

  return (
    <div className="space-y-6 animate-slideInUp">
      {/* Header with search and create button */}
      <NewsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        companiaFilter={companiaFilter}
        setCompaniaFilter={setCompaniaFilter}
        companias={companias}
      />

      {/* View selector */}
      <NewsViewSelector 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />

      {/* News content (grid or list view) */}
      <NewsContent
        currentView={currentView}
        filteredNoticias={filteredNoticias}
        companias={companias}
      />
    </div>
  );
};

export default News;
