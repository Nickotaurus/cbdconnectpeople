
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface FormActionsProps {
  storeType?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ storeType }) => {
  const navigate = useNavigate();

  return (
    <div className="pt-6 flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={() => navigate('/map')}>
        Annuler
      </Button>
      <Button type="submit">
        {storeType === 'both' ? "Continuer vers la configuration e-commerce" : "Ajouter la boutique"}
      </Button>
    </div>
  );
};

export default FormActions;
