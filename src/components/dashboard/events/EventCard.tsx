
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Users, FileText, Briefcase, Calendar, Clock, MapPin } from 'lucide-react';
import { Evento } from '@/types/database';
import { useEventos } from '@/hooks/useEventos';
import { toast } from 'sonner';

interface EventCardProps {
  event: Evento;
}

const EventCard = ({ event }: EventCardProps) => {
  const { deleteEvento, refetch } = useEventos();

  // Function to delete an event
  const handleDeleteEvent = (id: string) => {
    deleteEvento.mutate(id, {
      onSuccess: () => {
        refetch();
        toast.success("Evento eliminado correctamente");
      },
      onError: (error) => {
        toast.error(`Error al eliminar evento: ${error.message}`);
      }
    });
  };

  // Function to get event icon based on type
  const getEventIcon = (event: Evento) => {
    const type = event.color?.toLowerCase() || '';
    
    if (type.includes('blue')) return { icon: <Users className="h-5 w-5" />, label: 'Reunión' };
    if (type.includes('green')) return { icon: <FileText className="h-5 w-5" />, label: 'Webinar' };
    if (type.includes('purple')) return { icon: <Briefcase className="h-5 w-5" />, label: 'Formación' };
    return { icon: <Calendar className="h-5 w-5" />, label: 'Evento' };
  };

  // Function to format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to format time
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const eventType = getEventIcon(event);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{event.titulo}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEvent(event.id)}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Eliminar</span>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          <div className="flex items-center gap-1 mt-1">
            {eventType.icon}
            <span>{eventType.label}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDate(event.fecha_inicio)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatTime(event.fecha_inicio)}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-sm">{event.ubicacion}</span>
          </div>
          {event.descripcion && (
            <div className="text-sm mt-2 text-muted-foreground">
              {event.descripcion}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
