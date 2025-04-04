
import React from 'react';
import { Noticia, Compania } from '@/types/database';
import { useNoticias } from '@/hooks/useNoticias';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash } from 'lucide-react';

interface NewsListViewProps {
  filteredNoticias: Noticia[];
  companias: Compania[];
}

const NewsListView = ({ filteredNoticias, companias }: NewsListViewProps) => {
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
      <div className="text-center py-6">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
        <h3 className="mt-4 text-lg font-medium">No se encontraron noticias</h3>
        <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o crea una nueva noticia</p>
      </div>
    );
  }

  return (
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
            {filteredNoticias.map(noticia => (
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
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default NewsListView;
