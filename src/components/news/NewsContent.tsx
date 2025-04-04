
import React from 'react';
import { Noticia, Compania } from '@/types/database';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import NewsGridView from './NewsGridView';
import NewsListView from './NewsListView';

interface NewsContentProps {
  currentView: 'grid' | 'list';
  filteredNoticias: Noticia[];
  companias: Compania[];
}

const NewsContent = ({ currentView, filteredNoticias, companias }: NewsContentProps) => {
  return (
    <Tabs value={currentView} className="mt-0">
      {/* News grid view */}
      <TabsContent value="grid" className="mt-0">
        <NewsGridView 
          filteredNoticias={filteredNoticias}
          companias={companias}
        />
      </TabsContent>

      {/* News list view */}
      <TabsContent value="list" className="mt-0">
        <NewsListView 
          filteredNoticias={filteredNoticias}
          companias={companias}
        />
      </TabsContent>
    </Tabs>
  );
};

export default NewsContent;
