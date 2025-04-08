
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';

type Delegation = {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
};

export const useUserHelpers = () => {
  // Fetch delegations
  const { data: delegations = [] } = useSupabaseQuery<Delegation>(
    'delegaciones',
    ['delegaciones'],
    undefined,
    {
      select: 'id, nombre, direccion, telefono',
      orderBy: { column: 'nombre', ascending: true }
    }
  );

  // Get delegation name by id
  const getDelegationName = (delegationId?: string) => {
    if (!delegationId) return 'Sin delegación';
    const delegation = delegations.find(d => d.id === delegationId);
    return delegation ? delegation.nombre : 'Sin delegación';
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return {
    delegations,
    getDelegationName,
    getInitials
  };
};
