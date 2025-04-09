import React from "react";
import { Check, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotificationIcon from "./NotificationIcon";
import { Notificacion } from "@/types/database";

type NotificationCardProps = {
  notification: Notificacion;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
  formatDate: (date: string) => string;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  formatDate,
}) => {
  return (
    <Card
      key={notification.id}
      className={notification.es_leida ? "opacity-75" : ""}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <NotificationIcon type={notification.tipo || "info"} />
            <CardTitle className="text-base">{notification.titulo}</CardTitle>
          </div>
          <CardDescription>
            {formatDate(
              notification.fecha_creacion || notification.created_at || "",
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>{notification.mensaje}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2">
        {!notification.es_leida && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
          >
            <Check className="h-4 w-4 mr-2" />
            Marcar como leída
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NotificationCard;
