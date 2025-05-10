
import React from 'react';
import { FormData } from '@/types/store/form-types';
import { Store } from '@/types/store/store';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StoreSearchProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleStoreSelect: (store: Store | null) => void;
  setHasSearched: (value: boolean) => void;
  hasSearched: boolean;
  isLoading: boolean;
  skipSearch?: boolean;
}

const StoreSearch: React.FC<StoreSearchProps> = ({
  formData,
  handleInputChange,
  handleStoreSelect,
  setHasSearched,
  hasSearched,
  isLoading,
  skipSearch = false
}) => {
  if (skipSearch) {
    return (
      <div className="p-6 text-center">
        <p>Vous pouvez passer directement à l'étape suivante.</p>
        <Button 
          type="button" 
          className="mt-4"
          onClick={() => setHasSearched(true)}
        >
          Aller aux informations générales
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recherchez votre boutique</h3>
      <p className="text-sm text-muted-foreground">
        Commencez par rechercher votre boutique pour voir si elle existe déjà dans notre base de données.
      </p>
      
      {/* Intégration avec le composant de recherche */}
      <div className="my-6">
        {/* Ici, nous intégrerions un composant de recherche externe */}
        <Button 
          type="button"
          onClick={() => setHasSearched(true)}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          Rechercher ma boutique
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground mt-6">
        Si vous ne trouvez pas votre boutique, vous pourrez l'ajouter manuellement à l'étape suivante.
      </div>
    </div>
  );
};

export default StoreSearch;
