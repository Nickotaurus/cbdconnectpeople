import { PlusCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth';

const MapActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const canAddStore = !user || (user && user.role === 'store');
  
  return (
    <>
      {canAddStore && (
        <Button 
          variant="default" 
          size="sm"
          className="gap-1"
          onClick={() => navigate('/add-store')}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Ajouter une boutique</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="sm"
        className="gap-1"
        onClick={() => navigate('/import-stores')}
      >
        <Download className="h-4 w-4" />
        <span className="hidden md:inline">Importer</span>
      </Button>
    </>
  );
};

export default MapActions;
