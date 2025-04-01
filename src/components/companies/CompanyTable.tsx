
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, FileText, Trash } from 'lucide-react';
import { Company } from '@/types/company';

type CompanyTableProps = {
  companies: Company[];
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (id: number) => void;
  getCategoryLabel: (category: string) => string;
};

const CompanyTable = ({ companies, onView, onEdit, onDelete, getCategoryLabel }: CompanyTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Logo</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead className="hidden md:table-cell">Web</TableHead>
          <TableHead className="hidden md:table-cell">Email Responsable</TableHead>
          <TableHead className="hidden md:table-cell">Categoría</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.length > 0 ? (
          companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  className="h-10 w-10 object-contain"
                />
              </TableCell>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {company.website}
                </a>
              </TableCell>
              <TableCell className="hidden md:table-cell">{company.responsibleEmail}</TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {getCategoryLabel(company.category)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(company)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(company)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(company.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No se encontraron compañías
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CompanyTable;
