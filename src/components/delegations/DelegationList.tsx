
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Delegacion } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

interface DelegationListProps {
  delegaciones: Delegacion[];
  isLoading: boolean;
  onEdit: (delegacion: Delegacion) => void;
  onDelete: (id: string) => void;
}

const DelegationList: React.FC<DelegationListProps> = ({
  delegaciones,
  isLoading,
  onEdit,
  onDelete
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="hidden md:table-cell">Ciudad</TableHead>
          <TableHead className="hidden md:table-cell">País</TableHead>
          <TableHead className="hidden md:table-cell">Teléfono</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : delegaciones.length > 0 ? (
          delegaciones.map((delegacion) => (
            <TableRow key={delegacion.id}>
              <TableCell className="font-medium">{delegacion.nombre}</TableCell>
              <TableCell className="hidden md:table-cell">{delegacion.ciudad || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{delegacion.pais || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{delegacion.telefono || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{delegacion.email || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(delegacion)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(delegacion.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No se encontraron delegaciones
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DelegationList;
