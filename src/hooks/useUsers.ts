import { useState } from "react";
import {
  useSupabaseQuery,
  useSupabaseCreate,
  useSupabaseUpdate,
  useSupabaseDelete,
} from "./useSupabaseQuery";
import { useAuth } from "@/contexts/AuthContext";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  position?: string;
  delegation_id?: string;
  bio?: string;
  last_login?: string;
  created_at?: string;
};

export const useUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useAuth();

  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useSupabaseQuery<User>("users", ["users"], undefined, {
    select: "*",
    orderBy: { column: "name", ascending: true },
    enabled: true, // Permitir la consulta independientemente del rol de administrador
  });

  const createUser = useSupabaseCreate<User>("users");
  const updateUser = useSupabaseUpdate<User>("users");
  const deleteUser = useSupabaseDelete("users");

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.position &&
        user.position.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return {
    users,
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
