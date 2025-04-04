
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAlertas } from '@/hooks/useAlertas';

const AlertCreateDialog = () => {
  const { createAlerta, refetch } = useAlertas();
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

  return (
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
  );
};

export default AlertCreateDialog;
