
import React from 'react';
import { Classified } from '@/types/classified';
import { Link } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClassified: Classified | null;
}

const LoginDialog = ({ open, onOpenChange, selectedClassified }: LoginDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créez un compte pour voir les détails</DialogTitle>
          <DialogDescription>
            Pour accéder aux détails de cette annonce et contacter l'annonceur, vous devez créer un compte ou vous connecter.
          </DialogDescription>
        </DialogHeader>
        
        {selectedClassified && (
          <div className="py-4">
            <h3 className="font-medium mb-1">{selectedClassified.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{selectedClassified.description}</p>
          </div>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild className="sm:flex-1">
            <Link to="/login">Se connecter</Link>
          </Button>
          <Button asChild className="sm:flex-1">
            <Link to="/register">Créer un compte</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
