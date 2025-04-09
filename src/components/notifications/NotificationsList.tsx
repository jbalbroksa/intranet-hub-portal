import React from "react";
import { Notificacion } from "@/types/database";
import NotificationCard from "./NotificationCard";
import EmptyNotifications from "./EmptyNotifications";

type NotificationsListProps = {
  notifications: Notificacion[];
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
  formatDate: (date: string) => string;
};

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  formatDate,
}) => {
  if (notifications.length === 0) {
    return <EmptyNotifications />;
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default NotificationsList;
