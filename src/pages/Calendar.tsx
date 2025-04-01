
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isSameDay } from 'date-fns';
import { CalendarIcon, Clock, Plus, Edit, Trash, Users } from 'lucide-react';
import WysiwygEditor from '@/components/WysiwygEditor';

// Event type definitions
type EventCategory = 'meeting' | 'deadline' | 'reminder' | 'holiday' | 'other';

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  category: EventCategory;
  participants?: string[];
  location?: string;
}

// Mock event data
const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Reunión con Mapfre',
    description: '<p>Discutir nuevos productos y comisiones para el próximo trimestre</p>',
    date: new Date(2023, 6, 15),
    startTime: '10:00',
    endTime: '11:30',
    category: 'meeting',
    participants: ['María García', 'Carlos Rodríguez'],
    location: 'Sala de reuniones 3'
  },
  {
    id: 2,
    title: 'Entrega de documentación',
    description: '<p>Fecha límite para la entrega de documentación trimestral</p>',
    date: new Date(2023, 6, 20),
    category: 'deadline'
  },
  {
    id: 3,
    title: 'Formación nueva plataforma',
    description: '<p>Sesión formativa sobre la nueva plataforma de gestión</p>',
    date: new Date(2023, 6, 25),
    startTime: '09:00',
    endTime: '13:00',
    category: 'meeting',
    location: 'Online - Microsoft Teams'
  },
  {
    id: 4,
    title: 'Festivo local',
    description: '<p>Oficinas cerradas por festivo local</p>',
    date: new Date(2023, 7, 5),
    category: 'holiday'
  }
];

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const [formData, setFormData] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    description: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    category: 'other',
    participants: [],
    location: ''
  });

  // Get events for the selected date
  const eventsForSelectedDate = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  // Function to highlight dates with events
  const isDayWithEvent = (date: Date) => {
    return events.some(event => isSameDay(new Date(event.date), date));
  };

  // Open dialog to create a new event
  const handleAddEvent = () => {
    setIsEditMode(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      date: selectedDate,
      startTime: '',
      endTime: '',
      category: 'other',
      participants: [],
      location: ''
    });
    setIsDialogOpen(true);
  };

  // Open dialog to edit an existing event
  const handleEditEvent = (event: CalendarEvent) => {
    setIsEditMode(true);
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      category: event.category,
      participants: event.participants || [],
      location: event.location || ''
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

  // Handle rich text editor changes
  const handleDescriptionChange = (content: string) => {
    setFormData({
      ...formData,
      description: content
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && selectedEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...event, ...formData } : event
      ));
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: Math.max(0, ...events.map(e => e.id)) + 1,
        ...formData
      };
      setEvents([...events, newEvent]);
    }
    
    setIsDialogOpen(false);
  };

  // Delete an event
  const handleDeleteEvent = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  // Get color based on event category
  const getCategoryColor = (category: EventCategory) => {
    switch (category) {
      case 'meeting': return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'deadline': return 'bg-red-100 border-red-300 text-red-700';
      case 'reminder': return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 'holiday': return 'bg-green-100 border-green-300 text-green-700';
      default: return 'bg-purple-100 border-purple-300 text-purple-700';
    }
  };

  // Category labels
  const categoryLabels: Record<EventCategory, string> = {
    meeting: 'Reunión',
    deadline: 'Fecha límite',
    reminder: 'Recordatorio',
    holiday: 'Festivo',
    other: 'Otro'
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
            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <div 
                    key={event.id} 
                    className={`p-4 border rounded-lg ${getCategoryColor(event.category)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <div className="space-y-2 mt-2">
                          {event.startTime && (
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center text-sm">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          )}
                          {event.participants && event.participants.length > 0 && (
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2" />
                              {event.participants.join(', ')}
                            </div>
                          )}
                        </div>
                        <div 
                          className="mt-2 text-sm prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/50">
                            {categoryLabels[event.category]}
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
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: EventCategory) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Reunión</SelectItem>
                    <SelectItem value="deadline">Fecha límite</SelectItem>
                    <SelectItem value="reminder">Recordatorio</SelectItem>
                    <SelectItem value="holiday">Festivo</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Hora de inicio</Label>
                  <Input 
                    id="startTime" 
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">Hora de finalización</Label>
                  <Input 
                    id="endTime" 
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input 
                  id="location" 
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="Opcional"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="participants">Participantes</Label>
                <Input 
                  id="participants" 
                  name="participants"
                  value={(formData.participants || []).join(', ')}
                  onChange={(e) => {
                    const participantsList = e.target.value
                      .split(',')
                      .map(p => p.trim())
                      .filter(Boolean);
                    setFormData({...formData, participants: participantsList});
                  }}
                  placeholder="Nombres separados por comas (Opcional)"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <div className="min-h-[200px]">
                  <WysiwygEditor
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    placeholder="Describe el evento..."
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">{isEditMode ? 'Guardar cambios' : 'Crear evento'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
