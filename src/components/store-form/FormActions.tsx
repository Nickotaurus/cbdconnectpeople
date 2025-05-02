
import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface FormActionsProps {
  storeType?: string;
  isSubmitting?: boolean;
}

const FormActions = ({ storeType, isSubmitting = false }: FormActionsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col gap-3">
      <Button 
        type="submit" 
        className={`w-full ${isMobile ? 'py-3' : ''}`}
        size={isMobile ? "lg" : "default"}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center w-full">
            <div className="animate-spin h-4 w-4 border-2 border-current border-r-transparent rounded-full mr-2"></div>
            <span>Enregistrement en cours...</span>
          </div>
        ) : (
          <>Enregistrer ma boutique</>
        )}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        {storeType === 'ecommerce' || storeType === 'both' ? (
          "Après avoir enregistré votre boutique physique, vous pourrez configurer votre boutique en ligne."
        ) : (
          "En enregistrant votre boutique, vous rejoignez notre réseau de professionnels du CBD."
        )}
      </p>
    </div>
  );
};

export default FormActions;
