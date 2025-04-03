
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type Company = {
  id: string;
  name: string;
};

type ProductCompaniesProps = {
  companies: Company[];
  selectedCompanies: string[];
  onCompanyChange: (value: string) => void;
};

const ProductCompanies: React.FC<ProductCompaniesProps> = ({
  companies,
  selectedCompanies,
  onCompanyChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Compañías</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {companies.map(company => (
          <div key={company.id} className="flex items-center space-x-2">
            <Checkbox
              id={`company-${company.id}`}
              checked={selectedCompanies.includes(company.id)}
              onCheckedChange={() => onCompanyChange(company.id)}
            />
            <Label htmlFor={`company-${company.id}`} className="cursor-pointer">
              {company.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCompanies;
