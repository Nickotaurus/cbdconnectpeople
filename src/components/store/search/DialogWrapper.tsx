
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  apiKeyLoaded: boolean;
  onManualAdd: () => void;
  showManualForm: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
}

const DialogWrapper = ({
  isOpen,
  onOpenChange,
  isLoading,
  apiKeyLoaded,
  onManualAdd,
  showManualForm,
  title,
  description,
  children
}: DialogWrapperProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading && !showManualForm ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Chargement de la carte...</p>
          </div>
        ) : !apiKeyLoaded && !showManualForm ? (
          <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">API Google Maps indisponible</h4>
              <p className="text-sm text-muted-foreground mb-4">
                L'API Google Maps n'a pas pu être chargée. Veuillez utiliser la saisie manuelle ou réessayer ultérieurement.
              </p>
              <Button onClick={onManualAdd} variant="secondary">Saisie manuelle</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden min-h-[50vh]">
            {children}
          </div>
        )}
        
        {!showManualForm && (
          <div className="pt-2 flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {apiKeyLoaded 
                ? "Vous pouvez rechercher votre magasin sur la carte ou utiliser la saisie manuelle."
                : "L'API Google Maps n'est pas disponible. Utilisez la saisie manuelle."}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onManualAdd}
              disabled={showManualForm}
            >
              Saisie manuelle
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
