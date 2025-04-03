
import React from 'react';
import { useAlertas } from '@/hooks/useAlertas';
import AlertsList from './AlertsList';

const AlertsSection = () => {
  const { alertas, isLoading, error } = useAlertas();

  return (
    <section>
      <h2 className="text-xl font-poppins font-medium mb-4">Alertas</h2>
      {isLoading ? (
        <div className="text-center py-4">Cargando alertas...</div>
      ) : error ? (
        <div className="text-red-500 py-4">Error al cargar alertas: {error.message}</div>
      ) : (
        <AlertsList />
      )}
    </section>
  );
};

export default AlertsSection;
