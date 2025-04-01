
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Trash } from 'lucide-react';
import { Company } from '@/types/company';

type CompanyCardProps = {
  company: Company;
  getCategoryLabel: (category: string) => string;
  onViewClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  getCategoryLabel,
  onViewClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <Card key={company.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 bg-muted/30 flex items-center justify-center h-40">
        <img 
          src={company.logo} 
          alt={`${company.name} logo`} 
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-poppins font-medium text-lg">{company.name}</h3>
            <div className="text-sm text-muted-foreground mt-1">
              <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {company.website}
              </a>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {getCategoryLabel(company.category)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="ghost" size="sm" onClick={onViewClick} className="h-8 px-2">
              <FileText className="h-4 w-4 mr-1" /> Ver
            </Button>
            <Button variant="ghost" size="sm" onClick={onEditClick} className="h-8 px-2">
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={onDeleteClick} className="h-8 px-2">
              <Trash className="h-4 w-4 mr-1" /> Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
