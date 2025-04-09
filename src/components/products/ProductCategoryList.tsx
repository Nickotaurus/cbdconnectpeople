
import { useMemo } from 'react';
import { getProductsByCategory } from "@/contexts/ProductsContext";
import { ProductCategory } from "./ProductCategory";

export const ProductCategoryList = () => {
  const productsByCategory = useMemo(() => getProductsByCategory(), []);
  
  return (
    <>
      {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
        <ProductCategory 
          key={category} 
          title={category} 
          products={categoryProducts} 
        />
      ))}
    </>
  );
};
