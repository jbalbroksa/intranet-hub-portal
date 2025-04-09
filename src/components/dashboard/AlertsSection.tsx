import React from "react";
import { useAlertas } from "@/hooks/useAlertas";
import AlertsList from "./AlertsList";
import { useAuth } from "@/contexts/AuthContext";

const AlertsSection = () => {
  const { isLoading, error } = useAlertas();
  const { isAdmin } = useAuth();

  return (
    <section>
      {isLoading ? (
        <div className="text-center py-4">Cargando alertas...</div>
      ) : error ? (
        <div className="text-red-500 py-4">
          Error al cargar alertas: {error.message}
        </div>
      ) : (
        <AlertsList isAdmin={isAdmin} />
      )}
    </section>
  );
};

export default AlertsSection;
