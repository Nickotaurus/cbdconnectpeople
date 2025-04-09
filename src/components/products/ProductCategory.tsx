
import { CbdProduct } from "@/contexts/ProductsContext";
import { ProductItem } from "./ProductItem";

interface ProductCategoryProps {
  title: string;
  products: CbdProduct[];
}

export const ProductCategory = ({ title, products }: ProductCategoryProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="grid gap-3">
        {products.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
