
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No hay datos disponibles",
  description = "No se encontraron resultados para esta consulta.",
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg bg-muted/20">
      <div className="text-muted-foreground mb-4">
        {icon || (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm text-center mb-6 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
