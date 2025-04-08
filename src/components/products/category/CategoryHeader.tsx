
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CategoryHeaderProps = {
  activeCategoryTab: string;
  onTabChange: (value: string) => void;
};

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  activeCategoryTab,
  onTabChange
}) => {
  return (
    <TabsList>
      <TabsTrigger value="list">Explorar Categorías</TabsTrigger>
      <TabsTrigger value="add">Añadir Categoría</TabsTrigger>
    </TabsList>
  );
};

export default CategoryHeader;
