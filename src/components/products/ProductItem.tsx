
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProducts, type CbdProduct } from "@/contexts/ProductsContext";
import { Badge } from "@/components/ui/badge";

interface ProductItemProps {
  product: CbdProduct;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const { selectedProducts, handleToggleProduct } = useProducts();
  const isChecked = selectedProducts.includes(product.id);
  
  return (
    <div className={`flex items-start space-x-4 border p-3 rounded-md hover:bg-accent/5 transition-colors ${isChecked ? 'border-primary bg-primary/5' : 'border-border'}`}>
      <Checkbox 
        id={`product-${product.id}`}
        checked={isChecked}
        onCheckedChange={() => handleToggleProduct(product.id)}
        className="mt-1"
      />
      <div className="grid gap-1">
        <Label htmlFor={`product-${product.id}`} className="text-base font-medium cursor-pointer">
          {product.name}
        </Label>
        <div className="flex items-center gap-2">
          {product.subCategory && (
            <Badge variant="outline" className="text-xs py-0">
              {product.subCategory}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {product.description}
        </p>
      </div>
    </div>
  );
};
