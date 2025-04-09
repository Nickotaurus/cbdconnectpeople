
import { useMemo, useState } from 'react';
import { getProductsByCategory } from "@/contexts/ProductsContext";
import { ProductCategory } from "./ProductCategory";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const ProductCategoryList = () => {
  const [filter, setFilter] = useState<string>("all");
  const productsByCategory = useMemo(() => getProductsByCategory(), []);
  
  const categories = Object.keys(productsByCategory);
  const filteredCategories = filter === "all" 
    ? categories 
    : categories.filter(category => category === filter);
  
  return (
    <>
      <div className="mb-6 overflow-x-auto pb-2">
        <RadioGroup
          defaultValue="all"
          value={filter}
          onValueChange={setFilter}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">Tous</Label>
          </div>
          
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={category} />
              <Label htmlFor={category} className="cursor-pointer whitespace-nowrap">{category}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {filteredCategories.map((category) => (
        <ProductCategory 
          key={category} 
          title={category} 
          products={productsByCategory[category]} 
        />
      ))}
    </>
  );
};

