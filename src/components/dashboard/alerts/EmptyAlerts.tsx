
import React from 'react';
import { AlertCircle } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';

const EmptyAlerts = () => {
  return (
    <EmptyState 
      title="No hay alertas activas"
      description="Actualmente no hay alertas o notificaciones para mostrar."
      icon={<AlertCircle className="w-12 h-12" />}
    />
  );
};

export default EmptyAlerts;
