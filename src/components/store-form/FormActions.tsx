
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface FormActionsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigate: (path: string) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  isDisabled?: boolean;
}

const FormActions = ({ 
  activeTab, 
  setActiveTab, 
  navigate, 
  isLoading = false,
  isEdit = false,
  isDisabled = false
}: FormActionsProps) => {
  // Définition de l'ordre des onglets
  const tabOrder = ['search', 'basic', 'contact', 'details'];
  
  // Trouver l'index de l'onglet actuel
  const currentTabIndex = tabOrder.indexOf(activeTab);
  
  // Déterminer les onglets précédent et suivant
  const prevTab = currentTabIndex > 0 ? tabOrder[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < tabOrder.length - 1 ? tabOrder[currentTabIndex + 1] : null;
  
  // Naviguer vers l'onglet précédent
  const handleBack = () => {
    if (activeTab === 'search') {
      navigate('/map');
    } else if (prevTab) {
      setActiveTab(prevTab);
    }
  };
  
  // Naviguer vers l'onglet suivant
  const handleNext = () => {
    if (nextTab) {
      setActiveTab(nextTab);
    }
  };
  
  const isLastTab = currentTabIndex === tabOrder.length - 1;
  
  return (
    <CardFooter className="flex justify-between border-t p-6 bg-secondary/10">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={isLoading}
        type="button"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {activeTab === 'search' ? 'Annuler' : 'Précédent'}
      </Button>
      
      {nextTab ? (
        <Button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
        >
          Suivant
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isLoading || isDisabled}
          className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isLoading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Enregistrer'}
          {!isLoading && <Save className="ml-2 h-4 w-4" />}
        </Button>
      )}
    </CardFooter>
  );
};

export default FormActions;
