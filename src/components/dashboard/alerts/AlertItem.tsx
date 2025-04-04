
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, AlertTriangle } from 'lucide-react';
import { Notificacion } from '@/types/database';
import { useAlertas } from '@/hooks/useAlertas';
import { toast } from 'sonner';

interface AlertItemProps {
  alert: Notificacion;
}

const AlertItem = ({ alert }: AlertItemProps) => {
  const { deleteAlerta, refetch } = useAlertas();

  // Function to delete an alert
  const handleDeleteAlert = (id: string) => {
    deleteAlerta.mutate(id, {
      onSuccess: () => {
        refetch();
        toast.success("Alerta eliminada correctamente");
      },
      onError: (error) => {
        toast.error(`Error al eliminar alerta: ${error.message}`);
      }
    });
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

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const style = getAlertStyle(alert.tipo || 'low');

  return (
    <div className={`p-4 rounded-lg border ${style.bg} ${style.border}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {style.icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {alert.titulo}
          </h3>
          <div className="mt-1 text-sm">
            {alert.mensaje}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {formatDate(alert.fecha_creacion)}
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
};

export default AlertItem;
