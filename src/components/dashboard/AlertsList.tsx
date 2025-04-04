
import React from 'react';
import { useAlertas } from '@/hooks/useAlertas';
import AlertItem from './alerts/AlertItem';
import AlertCreateDialog from './alerts/AlertCreateDialog';
import EmptyAlerts from './alerts/EmptyAlerts';

const AlertsList = () => {
  const { alertas } = useAlertas();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-poppins font-medium">Alertas</h2>
        <AlertCreateDialog />
      </div>

      <div className="space-y-4">
        {alertas.length > 0 ? (
          alertas.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))
        ) : (
          <EmptyAlerts />
        )}
      </div>
    </section>
  );
};

export default AlertsList;
