
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid2X2, List } from 'lucide-react';

interface NewsViewSelectorProps {
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const NewsViewSelector = ({ currentView, onViewChange }: NewsViewSelectorProps) => {
  return (
    <div className="flex justify-end">
      <Tabs value={currentView} onValueChange={(value) => onViewChange(value as 'grid' | 'list')}>
        <TabsList>
          <TabsTrigger value="grid" className="flex items-center gap-1">
            <Grid2X2 className="h-4 w-4" />
            <span>Grid</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            <span>Lista</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default NewsViewSelector;
