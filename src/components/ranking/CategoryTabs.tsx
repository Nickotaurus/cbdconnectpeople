
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cannabis, Square } from 'lucide-react';
import { RankingCategory } from '@/data/rankingsData';

interface CategoryTabsProps {
  categories: RankingCategory[];
}

const CategoryTabs = ({ categories }: CategoryTabsProps) => {
  return (
    <div className="flex justify-center mb-6">
      <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-1">
        {categories.map(category => {
          // Get the Icon component from the category
          const IconComponent = category.icon;
          
          return (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex flex-col items-center gap-1 py-3 px-2 md:px-4"
            >
              <span className="flex items-center justify-center bg-primary/10 rounded-full p-2">
                {category.id === 'flowers' ? (
                  <Cannabis className="h-6 w-6 text-green-600" />
                ) : category.id === 'resins' ? (
                  <div className="relative w-6 h-5">
                    <Square className="h-6 w-6 text-slate-700 fill-slate-200 stroke-[1.5]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-[2px] bg-slate-700 rotate-45"></div>
                      <div className="w-4 h-[2px] bg-slate-700 -rotate-45 ml-[-16px]"></div>
                    </div>
                  </div>
                ) : (
                  <IconComponent className="h-6 w-6" />
                )}
              </span>
              <span className="hidden md:inline text-xs">{category.name.split(' ').pop()}</span>
              <span className="inline md:hidden text-xs">
                {category.id === 'stores' ? 'Boutiques' : 
                 category.id === 'ecommerce' ? 'Sites' : 
                 category.id === 'flowers' ? 'Fleurs' : 
                 category.id === 'resins' ? 'Résines' : 'Huiles'}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export default CategoryTabs;
