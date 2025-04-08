
import { toast } from 'sonner';
import { User } from '@/hooks/useUsers';
import { supabase } from '@/integrations/supabase/client';

export const useUserMutations = () => {
  // Create a new user
  const createUser = async (userData: Omit<User, 'id' | 'created_at'>) => {
    try {
      console.log("Creating user with data:", userData);
      
      // First, create an auth user with a temporary password
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Generate a stronger random password
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      });

      if (authError) {
        console.error("Auth error creating user:", authError);
        throw authError;
      }

      if (!authData || !authData.user) {
        throw new Error("No se pudo crear el usuario en el sistema de autenticación");
      }

      console.log("Auth user created:", authData.user.id);

      // Update the user record with additional information
      const { error: updateError } = await supabase
        .from('users')
        .update({
          position: userData.position,
          delegation_id: userData.delegation_id || null,
          bio: userData.bio,
          role: userData.role
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error("Error updating user data:", updateError);
        throw updateError;
      }

      toast.success('Usuario creado correctamente. Se ha enviado un correo para establecer la contraseña.');
      return true;
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(`Error al crear usuario: ${error.message}`);
      return false;
    }
  };

  return {
    createUser
  };
};
