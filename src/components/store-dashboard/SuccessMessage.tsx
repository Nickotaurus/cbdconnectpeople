
import React from 'react';
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onDismiss: () => void;
  onViewMap: () => void;
}

const SuccessMessage = ({ onDismiss, onViewMap }: SuccessMessageProps) => {
  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold">Félicitations !</h3>
          <p>Votre boutique a été enregistrée avec succès et est maintenant visible sur la carte.</p>
          <Button 
            variant="link" 
            className="text-green-800 p-0 h-auto"
            onClick={onViewMap}
          >
            Voir sur la carte
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDismiss}
        >
          ×
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessage;
