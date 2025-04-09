
import { CbdProduct } from "@/contexts/ProductsContext";
import { ProductItem } from "./ProductItem";
import { Separator } from "@/components/ui/separator";

interface ProductCategoryProps {
  title: string;
  products: CbdProduct[];
}

export const ProductCategory = ({ title, products }: ProductCategoryProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <Separator className="flex-grow" />
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {products.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {products.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

