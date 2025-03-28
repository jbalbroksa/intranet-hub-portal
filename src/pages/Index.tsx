
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Building, Briefcase, Package, FileText, FolderOpen, Bell, ChevronRight, ArrowRight, AlertTriangle, Calendar, Plus, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Index = () => {
  // Mock data for recent activities
  const recentActivities = [
    { id: 1, type: 'notification', title: 'Nueva noticia publicada', date: 'Hace 2 horas', icon: Bell },
    { id: 2, type: 'document', title: 'Manual de procedimientos actualizado', date: 'Hace 5 horas', icon: FileText },
    { id: 3, type: 'product', title: 'Nuevo producto añadido', date: 'Ayer', icon: Package },
    { id: 4, type: 'company', title: 'Actualización de datos de compañía', date: 'Hace 2 días', icon: Briefcase },
  ];

  // Quick access cards
  const quickAccessCards = [
    { title: 'Delegaciones', description: 'Gestionar delegaciones', icon: Building, link: '/delegaciones', color: 'bg-blue-50' },
    { title: 'Compañías', description: 'Gestionar compañías', icon: Briefcase, link: '/companias', color: 'bg-green-50' },
    { title: 'Productos', description: 'Gestionar productos', icon: Package, link: '/productos', color: 'bg-yellow-50' },
    { title: 'Noticias', description: 'Gestionar noticias', icon: FileText, link: '/noticias', color: 'bg-purple-50' },
    { title: 'Documentos', description: 'Gestionar documentos', icon: FolderOpen, link: '/documentos', color: 'bg-pink-50' },
  ];

  // Mock data for alerts
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'high', title: 'Actualización importante del sistema', message: 'El sistema estará en mantenimiento este fin de semana. Por favor, guarde su trabajo antes del viernes.', date: '2023-06-15' },
    { id: 2, type: 'medium', title: 'Nuevos documentos requeridos', message: 'Se requieren nuevos documentos para completar los expedientes de clientes.', date: '2023-06-10' },
    { id: 3, type: 'low', title: 'Recordatorio de formación', message: 'No olvide completar su formación obligatoria antes de fin de mes.', date: '2023-06-05' },
  ]);

  // Mock data for events
  const [events, setEvents] = useState([
    { id: 1, title: 'Reunión de equipo', type: 'meeting', date: '2023-06-20', time: '10:00', location: 'Sala de juntas principal' },
    { id: 2, title: 'Webinar: Novedades del sector', type: 'webinar', date: '2023-06-25', time: '16:00', location: 'Online (Zoom)' },
    { id: 3, title: 'Formación de productos', type: 'training', date: '2023-07-05', time: '09:30', location: 'Aula de formación' },
  ]);

  // State for dialogs
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  
  // State for form data
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    type: 'low'
  });
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'meeting',
    date: '',
    time: '',
    location: ''
  });

  // Handle alert form input changes
  const handleAlertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAlert({
      ...newAlert,
      [name]: value
    });
  };

  // Handle alert type selection
  const handleAlertTypeChange = (value: string) => {
    setNewAlert({
      ...newAlert,
      type: value
    });
  };

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
      type: value
    });
  };

  // Add new alert
  const handleAddAlert = () => {
    if (!newAlert.title || !newAlert.message) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    const alert = {
      id: alerts.length ? Math.max(...alerts.map(a => a.id)) + 1 : 1,
      title: newAlert.title,
      message: newAlert.message,
      type: newAlert.type,
      date: new Date().toISOString().split('T')[0]
    };

    setAlerts([alert, ...alerts]);
    setNewAlert({ title: '', message: '', type: 'low' });
    setAlertDialogOpen(false);
    toast.success("Alerta añadida correctamente");
  };

  // Add new event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    const event = {
      id: events.length ? Math.max(...events.map(e => e.id)) + 1 : 1,
      title: newEvent.title,
      type: newEvent.type,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location
    };

    setEvents([...events, event]);
    setNewEvent({ title: '', type: 'meeting', date: '', time: '', location: '' });
    setEventDialogOpen(false);
    toast.success("Evento añadido correctamente");
  };

  // Function to delete an alert
  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success("Alerta eliminada correctamente");
  };

  // Function to delete an event
  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    toast.success("Evento eliminado correctamente");
  };

  // Function to get alert style based on type
  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', icon: <AlertTriangle className="h-5 w-5 text-red-600" /> };
      case 'medium':
        return { bg: 'bg-orange-50', border: 'border-orange-200', icon: <AlertTriangle className="h-5 w-5 text-orange-600" /> };
      case 'low':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: <AlertTriangle className="h-5 w-5 text-yellow-600" /> };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', icon: <AlertTriangle className="h-5 w-5 text-gray-600" /> };
    }
  };

  // Function to get event icon based on type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return { icon: <Users className="h-5 w-5" />, label: 'Reunión' };
      case 'webinar':
        return { icon: <FileText className="h-5 w-5" />, label: 'Webinar' };
      case 'training':
        return { icon: <Briefcase className="h-5 w-5" />, label: 'Formación' };
      default:
        return { icon: <Calendar className="h-5 w-5" />, label: 'Evento' };
    }
  };

  return (
    <div className="space-y-8 animate-slideInUp">
      {/* Welcome section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-poppins font-bold mb-2">Bienvenido a la Intranet</h1>
          <p className="text-muted-foreground mb-6">
            Accede rápidamente a todas las herramientas y recursos que necesitas para gestionar tu negocio de manera eficiente.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/noticias">
                Ver últimas noticias
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/documentos">
                Explorar documentos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Alerts section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-poppins font-medium">Alertas</h2>
          <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Alerta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Alerta</DialogTitle>
                <DialogDescription>
                  Añade una nueva alerta para informar a los usuarios de la intranet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Título
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newAlert.title}
                    onChange={handleAlertChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="message" className="text-right">
                    Mensaje
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={newAlert.message}
                    onChange={handleAlertChange}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Prioridad
                  </Label>
                  <Select
                    value={newAlert.type}
                    onValueChange={handleAlertTypeChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddAlert}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => {
              const style = getAlertStyle(alert.type);
              return (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${style.bg} ${style.border}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {style.icon}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium">
                        {alert.title}
                      </h3>
                      <div className="mt-1 text-sm">
                        {alert.message}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {new Date(alert.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Eliminar</span>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay alertas activas actualmente
            </div>
          )}
        </div>
      </section>

      {/* Events section */}
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
                    name="title"
                    value={newEvent.title}
                    onChange={handleEventChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-type" className="text-right">
                    Tipo
                  </Label>
                  <Select
                    value={newEvent.type}
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
                    Fecha
                  </Label>
                  <Input
                    id="event-date"
                    name="date"
                    type="date"
                    value={newEvent.date}
                    onChange={handleEventChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-time" className="text-right">
                    Hora
                  </Label>
                  <Input
                    id="event-time"
                    name="time"
                    type="time"
                    value={newEvent.time}
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
                    name="location"
                    value={newEvent.location}
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
          {events.length > 0 ? (
            events.map((event) => {
              const eventType = getEventIcon(event.type);
              return (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/20 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
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
                          {new Date(event.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{event.location}</span>
                      </div>
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

      <Separator />

      {/* Quick access section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-poppins font-medium">Acceso rápido</h2>
          <Button variant="ghost" size="sm" className="text-sm gap-1">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccessCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link 
                key={index} 
                to={card.link}
                className="block transition-transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              >
                <Card className={`border-none shadow-sm ${card.color} h-full`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{card.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Recent activity section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-poppins font-medium">Actividad reciente</h2>
          <Button variant="ghost" size="sm" className="text-sm gap-1">
            Ver historial completo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <li key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="p-2 rounded-full bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
