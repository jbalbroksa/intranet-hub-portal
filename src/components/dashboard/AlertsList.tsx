
import React from 'react';
import { useAlertas } from '@/hooks/useAlertas';
import AlertItem from './alerts/AlertItem';
import AlertsHeader from './alerts/AlertsHeader';
import EmptyAlerts from './alerts/EmptyAlerts';

const AlertsList = () => {
  const { alertas } = useAlertas();

  return (
    <section>
      <AlertsHeader />

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
