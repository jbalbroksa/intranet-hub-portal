
import React from 'react';
import { Noticia, Compania } from '@/types/database';
import { useNoticias } from '@/hooks/useNoticias';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Trash, Calendar, User, Building2 } from 'lucide-react';

interface NewsGridViewProps {
  filteredNoticias: Noticia[];
  companias: Compania[];
}

const NewsGridView = ({ filteredNoticias, companias }: NewsGridViewProps) => {
  const navigate = useNavigate();
  const { deleteNoticia, refetch } = useNoticias();

  // Get company name from ID
  const getCompanyName = (id: string | null): string => {
    if (!id) return 'Sin compañía';
    const company = companias.find(c => c.id === id);
    return company ? company.nombre : 'Sin compañía';
  };
  
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

  if (filteredNoticias.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-lg font-medium">No se encontraron noticias</h3>
        <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o crea una nueva noticia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredNoticias.map(noticia => (
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
      ))}
    </div>
  );
};

export default NewsGridView;
