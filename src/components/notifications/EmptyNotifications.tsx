
import React from 'react';
import { Bell } from 'lucide-react';

const EmptyNotifications: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Bell className="h-12 w-12 text-muted-foreground mx-auto" />
      <h3 className="mt-4 text-lg font-medium">No hay notificaciones</h3>
      <p className="text-muted-foreground">No tienes notificaciones en este momento</p>
    </div>
  );
};

export default EmptyNotifications;
