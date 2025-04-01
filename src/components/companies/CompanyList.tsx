
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Trash } from 'lucide-react';
import CompanyCard from './CompanyCard';
import { Company } from '@/types/company';

type ViewMode = 'grid' | 'list';

type CompanyListProps = {
  companies: Company[];
  viewMode: ViewMode;
  getCategoryLabel: (category: string) => string;
  onViewCompany: (company: Company) => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (id: number) => void;
};

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  viewMode,
  getCategoryLabel,
  onViewCompany,
  onEditCompany,
  onDeleteCompany
}) => {
  if (companies.length === 0) {
    return (
      <div className="text-center py-10">
        <p>No se encontraron compañías</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard 
            key={company.id}
            company={company}
            getCategoryLabel={getCategoryLabel}
            onViewClick={() => onViewCompany(company)}
            onEditClick={() => onEditCompany(company)}
            onDeleteClick={() => onDeleteCompany(company.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
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
            {companies.map((company) => (
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
                    <Button variant="ghost" size="sm" onClick={() => onViewCompany(company)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEditCompany(company)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteCompany(company.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompanyList;
