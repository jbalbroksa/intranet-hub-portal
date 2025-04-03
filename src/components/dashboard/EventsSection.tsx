
import React from 'react';
import { useEventos } from '@/hooks/useEventos';
import EventsList from './EventsList';

const EventsSection = () => {
  const { eventos, isLoading, error } = useEventos();

  return (
    <section>
      <h2 className="text-xl font-poppins font-medium mb-4">Próximos Eventos</h2>
      {isLoading ? (
        <div className="text-center py-4">Cargando eventos...</div>
      ) : error ? (
        <div className="text-red-500 py-4">Error al cargar eventos: {error.message}</div>
      ) : (
        <EventsList />
      )}
    </section>
  );
};

export default EventsSection;
