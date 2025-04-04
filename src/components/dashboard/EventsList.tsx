
import React from 'react';
import { useEventos } from '@/hooks/useEventos';
import EventCard from './events/EventCard';
import EventCreateDialog from './events/EventCreateDialog';
import EmptyEvents from './events/EmptyEvents';

const EventsList = () => {
  const { eventos, isLoading } = useEventos();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-poppins font-medium">Próximos Eventos</h2>
        <EventCreateDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-4">Cargando eventos...</div>
        ) : eventos.length > 0 ? (
          eventos.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <EmptyEvents />
        )}
      </div>
    </section>
  );
};

export default EventsList;
