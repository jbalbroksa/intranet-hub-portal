
import React from 'react';
import { useAlertas } from '@/hooks/useAlertas';
import AlertsList from './AlertsList';

const AlertsSection = () => {
  const { isLoading, error } = useAlertas();

  return (
    <section>
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
