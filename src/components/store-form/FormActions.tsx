
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  storeType?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onCancel, storeType }) => {
  // Déterminer le texte du bouton en fonction du type de boutique
  let submitButtonText = "Enregistrer ma boutique";
  
  if (storeType === "ecommerce") {
    submitButtonText = "Ajouter mon site e-commerce";
  } else if (storeType === "both") {
    submitButtonText = "Ajouter ma boutique et mon site e-commerce";
  }
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </div>
  );
};

export default FormActions;
