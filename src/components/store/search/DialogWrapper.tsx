
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  isLoading: boolean;
  apiKeyLoaded: boolean;
  onManualAdd: () => void;
  showManualForm: boolean;
}

const DialogWrapper = ({
  isOpen,
  onOpenChange,
  children,
  isLoading,
  apiKeyLoaded,
  onManualAdd,
  showManualForm
}: DialogWrapperProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
        <DialogTitle>Recherche de boutique CBD</DialogTitle>
        <DialogDescription>
          Recherchez votre boutique CBD sur la carte. Si votre boutique n'apparaît pas, vous pourrez l'ajouter manuellement.
        </DialogDescription>
        
        {(isLoading || !apiKeyLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">
                {!apiKeyLoaded ? "Chargement de l'API Google Maps..." : "Initialisation de la carte..."}
              </p>
            </div>
          </div>
        )}
        
        {children}
        
        {!showManualForm && (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onManualAdd} className="w-full sm:w-auto">
              <Store className="w-4 h-4 mr-2" />
              Ajouter ma boutique manuellement
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
