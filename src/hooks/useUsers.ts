
import { useState } from 'react';
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from './useSupabaseQuery';
import { useAuth } from '@/contexts/AuthContext';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  delegation_id?: string;
  active?: boolean;
  last_login?: string;
  created_at?: string;
};

export const useUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useAuth();
  
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<User>(
    'profiles',
    ['profiles'],
    undefined,
    {
      select: 'id, nombre, email, rol, telefono, delegacion_id, activo, last_login, created_at',
      orderBy: { column: 'nombre', ascending: true },
      enabled: isAdmin
    }
  );

  // Map profiles data to User type
  const mappedUsers = users.map((profile: any) => ({
    id: profile.id,
    name: profile.nombre,
    email: profile.email,
    role: profile.rol,
    phone: profile.telefono,
    delegation_id: profile.delegacion_id,
    active: profile.activo,
    last_login: profile.last_login,
    created_at: profile.created_at
  }));

  const createUser = useSupabaseCreate<User>('profiles');
  const updateUser = useSupabaseUpdate<User>('profiles');
  const deleteUser = useSupabaseDelete('profiles');

  // Filter users by search term
  const filteredUsers = mappedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return {
    users: mappedUsers,
    filteredUsers,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    createUser,
    updateUser,
    deleteUser,
    refetch,
  };
};
