
import { Button } from "@/components/ui/button";
import { useProducts } from "@/contexts/ProductsContext";

export const SavePreferencesFooter = () => {
  const { selectedProducts, handleSave, isValid } = useProducts();
  
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">
        {!isValid ? (
          <span className="text-destructive">Veuillez sélectionner au moins 3 produits</span>
        ) : (
          <span>Vous avez sélectionné {selectedProducts.length} produits</span>
        )}
      </p>
      <Button onClick={handleSave} className="px-8" disabled={!isValid}>
        Enregistrer mes préférences
      </Button>
    </div>
  );
};
