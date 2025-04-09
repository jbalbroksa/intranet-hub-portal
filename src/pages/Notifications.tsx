import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import NotificationsList from "@/components/notifications/NotificationsList";
import { useAlertas } from "@/hooks/useAlertas";
import { useAuth } from "@/contexts/AuthContext";

const Notifications: React.FC = () => {
  const {
    alertas,
    isLoading,
    error,
    deleteAlerta,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useAlertas();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const { isAdmin } = useAuth();

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Delete a notification
  const handleDeleteNotification = (id: string) => {
    if (!isAdmin) {
      toast.error("Solo los administradores pueden eliminar notificaciones");
      return;
    }

    deleteAlerta.mutate(id, {
      onSuccess: () => {
        refetch();
        toast.success("Notificación eliminada");
      },
      onError: (error) => {
        toast.error(`Error al eliminar notificación: ${error.message}`);
      },
    });
  };

  // Delete all notifications
  const deleteAllNotifications = async () => {
    if (!isAdmin) {
      toast.error("Solo los administradores pueden eliminar notificaciones");
      return;
    }

    try {
      const promises = alertas.map((alerta) =>
        deleteAlerta.mutateAsync(alerta.id),
      );
      await Promise.all(promises);
      toast.success("Todas las notificaciones eliminadas");
      refetch();
    } catch (error: any) {
      toast.error(`Error al eliminar notificaciones: ${error.message}`);
    }
  };

  // Get notifications based on active tab
  const filteredNotifications =
    activeTab === "all"
      ? alertas
      : alertas.filter((notification) => !notification.es_leida);

  const unreadCount = alertas.filter(
    (notification) => !notification.es_leida,
  ).length;

  if (isLoading) {
    return <div className="text-center py-8">Cargando notificaciones...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 py-8">
        Error al cargar notificaciones: {error.message}
      </div>
    );
  }

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

          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={deleteAllNotifications}
              disabled={alertas.length === 0}
            >
              <Trash className="h-4 w-4 mr-2" />
              Eliminar todas
            </Button>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "unread")}
      >
        <TabsList>
          <TabsTrigger value="all">
            Todas{" "}
            <span className="ml-1 text-xs text-muted-foreground">
              ({alertas.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="unread">
            No leídas{" "}
            <span className="ml-1 text-xs text-muted-foreground">
              ({unreadCount})
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NotificationsList
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={isAdmin ? handleDeleteNotification : undefined}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <NotificationsList
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={isAdmin ? handleDeleteNotification : undefined}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
