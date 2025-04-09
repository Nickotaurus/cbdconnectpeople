
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cannabis, Square, Store, Globe, Droplet } from 'lucide-react';
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
              <span className={`flex items-center justify-center rounded-full p-2
                ${category.id === 'stores' ? 'bg-violet-100 text-violet-600' :
                  category.id === 'ecommerce' ? 'bg-blue-100 text-blue-600' :
                  category.id === 'flowers' ? 'bg-green-100 text-green-600' :
                  category.id === 'resins' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-600'}`}
              >
                <IconComponent className="h-5 w-5" />
              </span>
              <span className="hidden md:inline text-xs font-medium">{category.name.split(' ').pop()}</span>
              <span className="inline md:hidden text-xs font-medium">
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
