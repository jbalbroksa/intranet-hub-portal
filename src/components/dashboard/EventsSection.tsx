import React from "react";
import { useEventos } from "@/hooks/useEventos";
import EventsList from "./EventsList";
import { useAuth } from "@/contexts/AuthContext";

const EventsSection = () => {
  const { isLoading, error } = useEventos();
  const { isAdmin } = useAuth();

  return (
    <section>
      {isLoading ? (
        <div className="text-center py-4">Cargando eventos...</div>
      ) : error ? (
        <div className="text-red-500 py-4">
          Error al cargar eventos: {error.message}
        </div>
      ) : (
        <EventsList isAdmin={isAdmin} />
      )}
    </section>
  );
};

export default EventsSection;
