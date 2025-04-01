
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Specification, SpecCategory } from '@/types/company';

type SpecificationItemProps = {
  specification: Specification;
  specCategories: SpecCategory[];
  onDelete: (id: number) => void;
};

const SpecificationItem: React.FC<SpecificationItemProps> = ({
  specification,
  specCategories,
  onDelete
}) => {
  const getSpecCategoryLabel = (categorySlug: string) => {
    const category = specCategories.find(c => c.slug === categorySlug);
    return category ? category.name : 'Desconocido';
  };

  const getSpecCategoryColor = (category: string) => {
    switch(category) {
      case 'requirements': return 'bg-blue-100 text-blue-800';
      case 'procedures': return 'bg-green-100 text-green-800';
      case 'commercial': return 'bg-purple-100 text-purple-800';
      case 'contacts': return 'bg-orange-100 text-orange-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card key={specification.id} className="border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{specification.title}</CardTitle>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecCategoryColor(specification.category)}`}>
                {getSpecCategoryLabel(specification.category)}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(specification.id)}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Eliminar</span>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-line">{specification.content}</p>
      </CardContent>
    </Card>
  );
};

export default SpecificationItem;
