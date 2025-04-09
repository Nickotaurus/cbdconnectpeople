
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProducts, type CbdProduct } from "@/contexts/ProductsContext";

interface ProductItemProps {
  product: CbdProduct;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const { selectedProducts, handleToggleProduct } = useProducts();
  const isChecked = selectedProducts.includes(product.id);
  
  return (
    <div className="flex items-center space-x-4 border p-3 rounded-md">
      <Checkbox 
        id={`product-${product.id}`}
        checked={isChecked}
        onCheckedChange={() => handleToggleProduct(product.id)}
      />
      <div className="grid gap-1">
        <Label htmlFor={`product-${product.id}`} className="text-base font-medium">
          {product.name}
        </Label>
        <p className="text-sm text-muted-foreground">
          {product.subCategory && <span className="font-medium">[{product.subCategory}]</span>} {product.description}
        </p>
      </div>
    </div>
  );
};
