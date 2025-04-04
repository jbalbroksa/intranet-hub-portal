
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useEventos } from '@/hooks/useEventos';

const EventCreateDialog = () => {
  const { createEvento, refetch } = useEventos();
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
  
  // Function to get event color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'blue';
      case 'webinar': return 'green';
      case 'training': return 'purple';
      default: return 'gray';
    }
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

  return (
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
  );
};

export default EventCreateDialog;
