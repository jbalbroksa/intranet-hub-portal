import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

type UserDetails = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  position?: string;
  delegation_id?: string;
  bio?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(() => {
          fetchUserDetails(session.user.id);
        }, 0);
      } else {
        setUserDetails(null);
        setIsAdmin(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserDetails(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user details:", error);
        // Si no se encuentran detalles, crear un usuario por defecto con rol admin para desarrollo
        if (process.env.NODE_ENV === "development") {
          console.log("Development mode: Setting default admin user");
          const defaultUserDetails = {
            id: userId,
            name: "Admin User",
            email: user?.email || "admin@example.com",
            role: "admin",
          };
          setUserDetails(defaultUserDetails);
          setIsAdmin(true);
        } else {
          setUserDetails(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
        return;
      }

      setUserDetails(data as UserDetails);
      setIsAdmin(
        data?.role === "admin" || process.env.NODE_ENV === "development",
      );
      console.log(
        "User role:",
        data?.role,
        "isAdmin:",
        data?.role === "admin" || process.env.NODE_ENV === "development",
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error in fetchUserDetails:", error);
      // En desarrollo, establecer como admin por defecto
      if (process.env.NODE_ENV === "development") {
        setIsAdmin(true);
      }
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/");
      toast.success("Sesión iniciada correctamente");
    } catch (error: any) {
      toast.error(`Error al iniciar sesión: ${error.message}`);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      toast.success(
        "Cuenta creada correctamente. Inicia sesión para continuar.",
      );
      navigate("/auth");
    } catch (error: any) {
      toast.error(`Error al crear cuenta: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate("/auth");
      toast.success("Sesión cerrada correctamente");
    } catch (error: any) {
      toast.error(`Error al cerrar sesión: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userDetails,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for accessing the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
