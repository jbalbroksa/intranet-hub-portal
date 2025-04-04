
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  // Ensure we always have string values for the editor
  const ensureString = (value?: string): string => value || '';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Descripción y detalles</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Descripción General
          </label>
          <WysiwygEditor
            name="descripcion"
            value={ensureString(description)}
            onChange={(content) => onWysiwygChange('descripcion', content)}
            placeholder="Ingrese la descripción del producto..."
          />
        </div>
        
        <Tabs defaultValue="strengths">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="strengths">Fortalezas</TabsTrigger>
            <TabsTrigger value="weaknesses">Debilidades</TabsTrigger>
            <TabsTrigger value="observations">Observaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strengths">
            <WysiwygEditor
              name="fortalezas"
              value={ensureString(strengths)}
              onChange={(content) => onWysiwygChange('fortalezas', content)}
              placeholder="Ingrese las fortalezas del producto..."
            />
          </TabsContent>
          
          <TabsContent value="weaknesses">
            <WysiwygEditor
              name="debilidades"
              value={ensureString(weaknesses)}
              onChange={(content) => onWysiwygChange('debilidades', content)}
              placeholder="Ingrese las debilidades del producto..."
            />
          </TabsContent>
          
          <TabsContent value="observations">
            <WysiwygEditor
              name="observaciones"
              value={ensureString(observations)}
              onChange={(content) => onWysiwygChange('observaciones', content)}
              placeholder="Ingrese observaciones adicionales..."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDescriptionEditor;
