
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Users, FileText, Briefcase, Calendar, Clock, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useEventos } from '@/hooks/useEventos';
import { Evento } from '@/types/database';

const EventsList = () => {
  const { eventos, createEvento, deleteEvento, refetch } = useEventos();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    titulo: '',
    tipo: 'meeting',
    fecha_inicio: '',
    fecha_fin: '',
    ubicacion: '',
    descripcion: '',
    todo_el_dia: false
  });

  // Handle event form input changes
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  // Handle event type selection
  const handleEventTypeChange = (value: string) => {
    setNewEvent({
      ...newEvent,
      tipo: value
    });
  };

  // Add new event
  const handleAddEvent = () => {
    if (!newEvent.titulo || !newEvent.fecha_inicio || !newEvent.ubicacion) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    const fechaFin = newEvent.fecha_fin || newEvent.fecha_inicio;

    createEvento.mutate({
      titulo: newEvent.titulo,
      descripcion: newEvent.descripcion,
      fecha_inicio: new Date(newEvent.fecha_inicio).toISOString(),
      fecha_fin: new Date(fechaFin).toISOString(),
      ubicacion: newEvent.ubicacion,
      todo_el_dia: false,
      color: getEventColor(newEvent.tipo)
    } as any, {
      onSuccess: () => {
        setNewEvent({
          titulo: '',
          tipo: 'meeting',
          fecha_inicio: '',
          fecha_fin: '',
          ubicacion: '',
          descripcion: '',
          todo_el_dia: false
        });
        setEventDialogOpen(false);
        refetch();
        toast.success("Evento añadido correctamente");
      },
      onError: (error) => {
        toast.error(`Error al añadir evento: ${error.message}`);
      }
    });
  };

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

  // Function to get event color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'blue';
      case 'webinar': return 'green';
      case 'training': return 'purple';
      default: return 'gray';
    }
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

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-poppins font-medium">Próximos Eventos</h2>
        <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
              <DialogDescription>
                Añade un nuevo evento al calendario de la intranet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-title" className="text-right">
                  Título
                </Label>
                <Input
                  id="event-title"
                  name="titulo"
                  value={newEvent.titulo}
                  onChange={handleEventChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-type" className="text-right">
                  Tipo
                </Label>
                <Select
                  value={newEvent.tipo}
                  onValueChange={handleEventTypeChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Reunión</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="training">Formación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-date" className="text-right">
                  Fecha Inicio
                </Label>
                <Input
                  id="event-date"
                  name="fecha_inicio"
                  type="datetime-local"
                  value={newEvent.fecha_inicio}
                  onChange={handleEventChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-end-date" className="text-right">
                  Fecha Fin
                </Label>
                <Input
                  id="event-end-date"
                  name="fecha_fin"
                  type="datetime-local"
                  value={newEvent.fecha_fin}
                  onChange={handleEventChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-location" className="text-right">
                  Ubicación
                </Label>
                <Input
                  id="event-location"
                  name="ubicacion"
                  value={newEvent.ubicacion}
                  onChange={handleEventChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="event-description"
                  name="descripcion"
                  value={newEvent.descripcion}
                  onChange={handleEventChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEventDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEvent}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventos.length > 0 ? (
          eventos.map((event) => {
            const eventType = getEventIcon(event);
            return (
              <Card key={event.id} className="overflow-hidden">
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
          })
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No hay eventos programados
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsList;
