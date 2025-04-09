
import { Button } from "@/components/ui/button";
import { useProducts } from "@/contexts/ProductsContext";
import { ShieldCheck } from "lucide-react";

export const SavePreferencesFooter = () => {
  const { selectedProducts, handleSave, isValid } = useProducts();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-accent/10 rounded-lg">
      <div className="flex items-center gap-2">
        <ShieldCheck className={`h-5 w-5 ${isValid ? 'text-green-500' : 'text-destructive'}`} />
        <p className="text-sm">
          {!isValid ? (
            <span className="text-destructive font-medium">Veuillez sélectionner au moins 3 produits</span>
          ) : (
            <span className="text-green-600">Vous avez sélectionné {selectedProducts.length} produits</span>
          )}
        </p>
      </div>
      <Button 
        onClick={handleSave} 
        className="px-8 w-full sm:w-auto" 
        disabled={!isValid}
      >
        Enregistrer mes préférences
      </Button>
    </div>
  );
};

