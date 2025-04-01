
import React from 'react';
import { Check, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NotificationIcon from './NotificationIcon';

export type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'info' | 'update' | 'alert' | 'reminder';
  category: string;
};

type NotificationCardProps = {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  formatDate
}) => {
  return (
    <Card key={notification.id} className={notification.read ? "opacity-75" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <NotificationIcon type={notification.type} />
            <CardTitle className="text-base">{notification.title}</CardTitle>
          </div>
          <CardDescription>{formatDate(notification.createdAt)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>{notification.message}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end gap-2">
        {!notification.read && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onMarkAsRead(notification.id)}
          >
            <Check className="h-4 w-4 mr-2" />
            Marcar como leída
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(notification.id)}
        >
          <Trash className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationCard;
