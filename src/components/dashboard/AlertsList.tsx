
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAlertas } from '@/hooks/useAlertas';

const AlertsList = () => {
  const { alertas, createAlerta, deleteAlerta, refetch } = useAlertas();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    titulo: '',
    mensaje: '',
    tipo: 'low'
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
      tipo: value
    });
  };

  // Add new alert
  const handleAddAlert = () => {
    if (!newAlert.titulo || !newAlert.mensaje) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    createAlerta.mutate({
      titulo: newAlert.titulo,
      mensaje: newAlert.mensaje,
      tipo: newAlert.tipo,
      es_leida: false,
      fecha_creacion: new Date().toISOString()
    } as any, {
      onSuccess: () => {
        setNewAlert({ titulo: '', mensaje: '', tipo: 'low' });
        setAlertDialogOpen(false);
        refetch();
        toast.success("Alerta añadida correctamente");
      },
      onError: (error) => {
        toast.error(`Error al añadir alerta: ${error.message}`);
      }
    });
  };

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

  return (
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
                  name="titulo"
                  value={newAlert.titulo}
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
                  name="mensaje"
                  value={newAlert.mensaje}
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
                  value={newAlert.tipo}
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
        {alertas.length > 0 ? (
          alertas.map((alert) => {
            const style = getAlertStyle(alert.tipo || 'low');
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
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay alertas activas actualmente
          </div>
        )}
      </div>
    </section>
  );
};

export default AlertsList;
