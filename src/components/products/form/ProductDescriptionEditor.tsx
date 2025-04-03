
import React from 'react';
import { Label } from '@/components/ui/label';
import WysiwygEditor from '@/components/WysiwygEditor';

type ProductDescriptionEditorProps = {
  description: string;
  strengths?: string;
  weaknesses?: string;
  observations?: string;
  onWysiwygChange: (name: string, content: string) => void;
};

const ProductDescriptionEditor: React.FC<ProductDescriptionEditorProps> = ({
  description,
  strengths,
  weaknesses,
  observations,
  onWysiwygChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <WysiwygEditor
          value={description}
          onChange={(content) => onWysiwygChange('description', content)}
          placeholder="Descripción detallada del producto"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="strengths">Puntos Fuertes</Label>
          <WysiwygEditor
            value={strengths || ''}
            onChange={(content) => onWysiwygChange('strengths', content)}
            placeholder="Fortalezas del producto"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weaknesses">Puntos Débiles</Label>
          <WysiwygEditor
            value={weaknesses || ''}
            onChange={(content) => onWysiwygChange('weaknesses', content)}
            placeholder="Debilidades o limitaciones del producto"
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observations">Observaciones</Label>
        <WysiwygEditor
          value={observations || ''}
          onChange={(content) => onWysiwygChange('observations', content)}
          placeholder="Observaciones adicionales sobre el producto"
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};

export default ProductDescriptionEditor;
