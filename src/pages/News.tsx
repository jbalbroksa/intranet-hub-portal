
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  FileText, 
  Trash, 
  Calendar, 
  User,
  Building2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useNoticias } from '@/hooks/useNoticias';
import { useNavigate } from 'react-router-dom';

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
    setCompaniaFilter,
    deleteNoticia, 
    refetch 
  } = useNoticias();
  
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle document deletion
  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      deleteNoticia.mutate(id, {
        onSuccess: () => {
          toast.success('Noticia eliminada correctamente');
          refetch();
        },
        onError: (error) => {
          toast.error(`Error al eliminar noticia: ${error.message}`);
        }
      });
    }
  };

  // View news detail
  const handleViewNews = (id: string) => {
    navigate(`/noticias/${id}`);
  };

  // Create new news
  const handleCreateNews = () => {
    navigate('/noticias/crear');
  };

  // Get company name from ID
  const getCompanyName = (id: string | null): string => {
    if (!id) return 'Sin compañía';
    const company = companias.find(c => c.id === id);
    return company ? company.nombre : 'Sin compañía';
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
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar noticias..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          {/* Company filter */}
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
          
          <Button onClick={handleCreateNews}>
            <Plus className="h-4 w-4 mr-2" />
            Crear noticia
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNoticias.length > 0 ? (
              filteredNoticias.map(noticia => (
                <Card key={noticia.id} className="overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    {noticia.imagen_url ? (
                      <img 
                        src={noticia.imagen_url} 
                        alt={noticia.titulo} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {noticia.es_destacada && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-md">
                        Destacada
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2">{noticia.titulo}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{noticia.contenido}</p>
                      
                      <div className="mt-auto space-y-2 text-sm">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {noticia.compania_id && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {getCompanyName(noticia.compania_id)}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(noticia.fecha_publicacion)}</span>
                          </div>
                          {noticia.autor && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{noticia.autor}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between mt-4">
                          <Button variant="outline" size="sm" onClick={() => handleViewNews(noticia.id)}>
                            Leer más
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(noticia.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-lg font-medium">No se encontraron noticias</h3>
                <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o crea una nueva noticia</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* News list view */}
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Noticia</th>
                    <th className="text-left p-4 hidden md:table-cell">Compañía</th>
                    <th className="text-left p-4 hidden md:table-cell">Autor</th>
                    <th className="text-left p-4">Fecha</th>
                    <th className="text-left p-4 hidden md:table-cell">Destacada</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNoticias.length > 0 ? (
                    filteredNoticias.map(noticia => (
                      <tr key={noticia.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-muted rounded-md h-12 w-12 overflow-hidden flex-shrink-0">
                              {noticia.imagen_url ? (
                                <img 
                                  src={noticia.imagen_url} 
                                  alt={noticia.titulo} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <FileText className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{noticia.titulo}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{noticia.contenido}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          {noticia.compania_id ? getCompanyName(noticia.compania_id) : '-'}
                        </td>
                        <td className="p-4 hidden md:table-cell">{noticia.autor || '-'}</td>
                        <td className="p-4">{formatDate(noticia.fecha_publicacion)}</td>
                        <td className="p-4 hidden md:table-cell">
                          {noticia.es_destacada ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                              Sí
                            </span>
                          ) : 'No'}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewNews(noticia.id)}>
                              Leer más
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(noticia.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="mt-4 text-lg font-medium">No se encontraron noticias</h3>
                        <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o crea una nueva noticia</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default News;
