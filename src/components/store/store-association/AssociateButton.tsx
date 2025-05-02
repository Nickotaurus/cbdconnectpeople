
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AssociateButtonProps {
  onClick: () => void;
  disabled: boolean;
  processing: boolean;
  success: boolean;
}

const AssociateButton = ({ onClick, disabled, processing, success }: AssociateButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled}
      className="w-full"
    >
      {processing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Association en cours...
        </>
      ) : success ? (
        "Boutique associée"
      ) : (
        "Associer la boutique au profil"
      )}
    </Button>
  );
};

export default AssociateButton;
