
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type ProductFeaturesProps = {
  features: string[];
  onFeatureChange: (index: number, value: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
};

const ProductFeatures: React.FC<ProductFeaturesProps> = ({
  features,
  onFeatureChange,
  addFeature,
  removeFeature
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Características</Label>
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          Añadir
        </Button>
      </div>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={feature}
              onChange={(e) => onFeatureChange(index, e.target.value)}
              placeholder={`Característica ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFeature(index)}
              className="h-10 w-10 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFeatures;
