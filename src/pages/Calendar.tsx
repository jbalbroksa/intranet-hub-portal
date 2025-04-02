
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isSameDay, parseISO } from 'date-fns';
import { CalendarIcon, Clock, Plus, Edit, Trash, Users, Loader2 } from 'lucide-react';
import WysiwygEditor from '@/components/WysiwygEditor';
import { Evento } from '@/types/database';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from '@/hooks/useSupabaseQuery';
import { toast } from '@/components/ui/use-toast';

// Event type definition using our Supabase type
type EventCategory = 'meeting' | 'deadline' | 'reminder' | 'holiday' | 'other';

interface EventFormData {
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  todo_el_dia: boolean;
  ubicacion?: string;
  color?: string;
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    titulo: '',
    descripcion: '',
    fecha_inicio: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    fecha_fin: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    todo_el_dia: false,
    ubicacion: '',
    color: '#3b82f6' // Default blue color
  });

  // Query events from Supabase
  const { data: events = [], isLoading, refetch } = useSupabaseQuery<Evento>(
    'eventos',
    ['all'],
    {},
    { orderBy: { column: 'fecha_inicio', ascending: true } }
  );

  // Mutations for CRUD operations
  const createMutation = useSupabaseCreate<Evento>('eventos');
  const updateMutation = useSupabaseUpdate<Evento>('eventos');
  const deleteMutation = useSupabaseDelete('eventos');

  // Get events for the selected date
  const eventsForSelectedDate = events.filter(event => 
    isSameDay(parseISO(event.fecha_inicio), selectedDate)
  );

  // Function to highlight dates with events
  const isDayWithEvent = (date: Date) => {
    return events.some(event => isSameDay(parseISO(event.fecha_inicio), date));
  };

  // Open dialog to create a new event
  const handleAddEvent = () => {
    setIsEditMode(false);
    setSelectedEvent(null);
    
    // Set default start and end times for the selected date
    const today = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(today.getHours(), today.getMinutes(), 0, 0);
    
    const endDateTime = new Date(selectedDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);
    
    setFormData({
      titulo: '',
      descripcion: '',
      fecha_inicio: format(selectedDateTime, "yyyy-MM-dd'T'HH:mm"),
      fecha_fin: format(endDateTime, "yyyy-MM-dd'T'HH:mm"),
      todo_el_dia: false,
      ubicacion: '',
      color: '#3b82f6'
    });
    
    setIsDialogOpen(true);
  };

  // Open dialog to edit an existing event
  const handleEditEvent = (event: Evento) => {
    setIsEditMode(true);
    setSelectedEvent(event);
    
    setFormData({
      titulo: event.titulo,
      descripcion: event.descripcion || '',
      fecha_inicio: format(parseISO(event.fecha_inicio), "yyyy-MM-dd'T'HH:mm"),
      fecha_fin: format(parseISO(event.fecha_fin), "yyyy-MM-dd'T'HH:mm"),
      todo_el_dia: event.todo_el_dia || false,
      ubicacion: event.ubicacion || '',
      color: event.color || '#3b82f6'
    });
    
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Handle rich text editor changes
  const handleDescriptionChange = (content: string) => {
    setFormData({
      ...formData,
      descripcion: content
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode && selectedEvent) {
        // Update existing event
        await updateMutation.mutateAsync({
          id: selectedEvent.id,
          data: {
            ...formData,
          }
        });
      } else {
        // Create new event
        await createMutation.mutateAsync({
          ...formData,
        });
      }
      
      setIsDialogOpen(false);
      refetch(); // Refresh the events list
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el evento. Por favor, inténtalo de nuevo."
      });
    }
  };

  // Delete an event
  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch(); // Refresh the events list
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  // Get color based on event color or default by category
  const getEventColorClass = (event: Evento) => {
    if (event.color) {
      // If the event has a custom color, use inline style
      return {
        backgroundColor: `${event.color}20`, // 20% opacity
        borderColor: event.color,
        color: event.color
      };
    }
    
    // Default colors by category type if no custom color
    const categoryColor = {
      meeting: 'bg-blue-100 border-blue-300 text-blue-700',
      deadline: 'bg-red-100 border-red-300 text-red-700',
      reminder: 'bg-yellow-100 border-yellow-300 text-yellow-700',
      holiday: 'bg-green-100 border-green-300 text-green-700',
      other: 'bg-purple-100 border-purple-300 text-purple-700'
    };
    
    return categoryColor.other; // Default
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Eventos: {format(selectedDate, 'dd MMMM yyyy')}
        </h2>
        <Button onClick={handleAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo evento
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
            <CardDescription>Selecciona una fecha para ver o crear eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasEvent: (date) => isDayWithEvent(date)
              }}
              modifiersClassNames={{
                hasEvent: "bg-primary/20 font-bold"
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Eventos del día</CardTitle>
            <CardDescription>
              {format(selectedDate, 'EEEE, dd MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Cargando eventos...</span>
              </div>
            ) : eventsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-4 border rounded-lg"
                    style={getEventColorClass(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{event.titulo}</h3>
                        <div className="space-y-2 mt-2">
                          {!event.todo_el_dia && (
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2" />
                              {format(parseISO(event.fecha_inicio), 'HH:mm')} - {format(parseISO(event.fecha_fin), 'HH:mm')}
                            </div>
                          )}
                          {event.ubicacion && (
                            <div className="flex items-center text-sm">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {event.ubicacion}
                            </div>
                          )}
                        </div>
                        {event.descripcion && (
                          <div 
                            className="mt-2 text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: event.descripcion }}
                          />
                        )}
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/50">
                            {event.todo_el_dia ? 'Todo el día' : 'Evento'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <CalendarIcon className="mx-auto h-10 w-10 mb-2" />
                <p>No hay eventos programados para este día</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddEvent}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir evento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Editar evento' : 'Nuevo evento'}
              </DialogTitle>
              <DialogDescription>
                Completa los detalles para {isEditMode ? 'actualizar el' : 'crear un nuevo'} evento
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título</Label>
                <Input 
                  id="titulo" 
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="h-10 w-full"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  id="todo_el_dia"
                  name="todo_el_dia"
                  type="checkbox"
                  checked={formData.todo_el_dia}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="todo_el_dia">Todo el día</Label>
              </div>
              
              {!formData.todo_el_dia && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fecha_inicio">Fecha y hora de inicio</Label>
                    <Input 
                      id="fecha_inicio" 
                      name="fecha_inicio"
                      type="datetime-local"
                      value={formData.fecha_inicio}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fecha_fin">Fecha y hora de finalización</Label>
                    <Input 
                      id="fecha_fin" 
                      name="fecha_fin"
                      type="datetime-local"
                      value={formData.fecha_fin}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              {formData.todo_el_dia && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
                    <Input 
                      id="fecha_inicio" 
                      name="fecha_inicio"
                      type="date"
                      value={formData.fecha_inicio.split('T')[0]}
                      onChange={(e) => {
                        const date = e.target.value;
                        setFormData({
                          ...formData,
                          fecha_inicio: `${date}T00:00`,
                          fecha_fin: `${date}T23:59`
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fecha_fin">Fecha de finalización</Label>
                    <Input 
                      id="fecha_fin" 
                      name="fecha_fin"
                      type="date"
                      value={formData.fecha_fin.split('T')[0]}
                      onChange={(e) => {
                        const date = e.target.value;
                        setFormData({
                          ...formData,
                          fecha_fin: `${date}T23:59`
                        });
                      }}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input 
                  id="ubicacion" 
                  name="ubicacion"
                  value={formData.ubicacion || ''}
                  onChange={handleInputChange}
                  placeholder="Opcional"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <div className="min-h-[200px]">
                  <WysiwygEditor
                    value={formData.descripcion}
                    onChange={handleDescriptionChange}
                    placeholder="Describe el evento..."
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setIsDialogOpen(false)}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? 'Guardar cambios' : 'Crear evento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
