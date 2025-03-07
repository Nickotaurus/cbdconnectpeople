
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StoreForm from '@/components/StoreForm';
import { Store } from '@/utils/data';

const AddStore = () => {
  const navigate = useNavigate();

  const handleStoreAdded = (store: Store) => {
    setTimeout(() => {
      navigate(`/store/${store.id}`);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => navigate('/map')}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la carte
        </Button>
      </div>
      
      <div className="mb-8 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-2">Ajouter une boutique CBD</h1>
        <p className="text-muted-foreground">
          Utilisez ce formulaire pour ajouter une nouvelle boutique CBD à notre base de données.
          Assurez-vous que toutes les informations sont correctes et précises.
        </p>
      </div>
      
      <StoreForm onSuccess={handleStoreAdded} />
    </div>
  );
};

export default AddStore;
