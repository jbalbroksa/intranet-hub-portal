
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';

// Tipo genérico para los parámetros de filtrado
type FilterParams = Record<string, any>;

// Hook para obtener datos de una tabla
export function useSupabaseQuery<T>(
  tableName: string, 
  queryKey: string[], 
  filters?: FilterParams,
  options?: { 
    enabled?: boolean;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    select?: string;
  }
) {
  return useQuery({
    queryKey: [tableName, ...queryKey, filters],
    queryFn: async () => {
      let query = supabase
        .from(tableName)
        .select(options?.select || '*');
      
      // Aplicar filtros si existen
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === 'object' && 'operator' in value) {
              // Manejar operadores personalizados
              if (value.operator === 'ilike') {
                query = query.ilike(key, `%${value.value}%`);
              } else if (value.operator === 'in') {
                query = query.in(key, value.value);
              } else if (value.operator === 'gt') {
                query = query.gt(key, value.value);
              } else if (value.operator === 'lt') {
                query = query.lt(key, value.value);
              }
            } else {
              // Filtro de igualdad predeterminado
              query = query.eq(key, value);
            }
          }
        });
      }
      
      // Aplicar ordenación si existe
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending !== false 
        });
      }
      
      // Aplicar límite si existe
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: error.message,
        });
        throw error;
      }
      
      return data as T[];
    },
    enabled: options?.enabled !== false,
  });
}

// Hook para crear un nuevo registro
export function useSupabaseCreate<T>(tableName: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItem: Partial<T>) => {
      const { data, error } = await supabase
        .from(tableName)
        .insert(newItem)
        .select();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error al crear",
          description: error.message,
        });
        throw error;
      }
      
      return data[0] as T;
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Registro creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: [tableName] });
    }
  });
}

// Hook para actualizar un registro
export function useSupabaseUpdate<T>(tableName: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<T> }) => {
      const { data: updatedData, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error al actualizar",
          description: error.message,
        });
        throw error;
      }
      
      return updatedData[0] as T;
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Registro actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: [tableName] });
    }
  });
}

// Hook para eliminar un registro
export function useSupabaseDelete(tableName: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: error.message,
        });
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Registro eliminado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: [tableName] });
    }
  });
}

// Hook para subir un archivo
export function useSupabaseUpload() {
  return useMutation({
    mutationFn: async ({ 
      bucketName, 
      filePath, 
      file 
    }: { 
      bucketName: string; 
      filePath: string; 
      file: File 
    }) => {
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error al subir archivo",
          description: error.message,
        });
        throw error;
      }
      
      return data.path;
    }
  });
}

// Función para obtener la URL pública de un archivo
export function getPublicUrl(bucketName: string, filePath: string) {
  const { data } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}
