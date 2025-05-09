
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rankings } from '@/data/rankingsData';

interface CategoryTabsProps {
  categories: typeof rankings;
}

const CategoryTabs = ({ categories }: CategoryTabsProps) => {
  return (
    <TabsList className="flex space-x-2 flex-wrap mt-4">
      {categories.map((category) => (
        <TabsTrigger key={category.id} value={category.id}>
          {category.title}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default CategoryTabs;
