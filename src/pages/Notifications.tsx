
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Notification } from '@/components/notifications/NotificationCard';
import NotificationsList from '@/components/notifications/NotificationsList';

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Nuevo documento disponible',
    message: 'Se ha añadido un nuevo documento a Pólizas de automóvil',
    createdAt: '2023-07-15T10:30:00',
    read: false,
    type: 'info',
    category: 'documents'
  },
  {
    id: 2,
    title: 'Actualización de producto',
    message: 'El producto "Seguro Todo Riesgo Plus" ha sido actualizado',
    createdAt: '2023-07-14T14:45:00',
    read: true,
    type: 'update',
    category: 'products'
  },
  {
    id: 3,
    title: 'Alerta de caducidad',
    message: 'La póliza #12345 caducará en 7 días',
    createdAt: '2023-07-13T09:15:00',
    read: false,
    type: 'alert',
    category: 'policies'
  },
  {
    id: 4,
    title: 'Nuevo usuario registrado',
    message: 'El usuario Juan Pérez se ha registrado en el sistema',
    createdAt: '2023-07-12T16:20:00',
    read: true,
    type: 'info',
    category: 'users'
  },
  {
    id: 5,
    title: 'Recordatorio de reunión',
    message: 'Tienes una reunión programada con el equipo comercial mañana a las 10:00',
    createdAt: '2023-07-11T11:05:00',
    read: false,
    type: 'reminder',
    category: 'meetings'
  }
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mark a notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success('Notificación marcada como leída');
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  // Delete a notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success('Notificación eliminada');
  };

  // Delete all notifications
  const deleteAllNotifications = () => {
    setNotifications([]);
    toast.success('Todas las notificaciones eliminadas');
  };

  // Get notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.read);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="space-y-6 animate-slideInUp">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Notificaciones</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount} sin leer
            </span>
          )}
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Marcar todas como leídas
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={deleteAllNotifications}
            disabled={notifications.length === 0}
          >
            <Trash className="h-4 w-4 mr-2" />
            Eliminar todas
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">
            Todas <span className="ml-1 text-xs text-muted-foreground">({notifications.length})</span>
          </TabsTrigger>
          <TabsTrigger value="unread">
            No leídas <span className="ml-1 text-xs text-muted-foreground">({unreadCount})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <NotificationsList 
            notifications={filteredNotifications} 
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            formatDate={formatDate}
          />
        </TabsContent>
        
        <TabsContent value="unread" className="mt-6">
          <NotificationsList 
            notifications={filteredNotifications} 
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
