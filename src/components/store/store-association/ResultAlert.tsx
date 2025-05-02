
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import { AssociationResult } from './types';

interface ResultAlertProps {
  result: AssociationResult;
}

const ResultAlert = ({ result }: ResultAlertProps) => {
  if (!result.message) return null;

  return (
    <Alert 
      variant="default" 
      className={
        result.success 
          ? "border-green-200 bg-green-50" 
          : "border-red-200 bg-red-50"
      }
    >
      {result.success ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />
      )}
      <AlertDescription className={
        result.success ? "text-green-800" : "text-red-800"
      }>
        {result.message}
      </AlertDescription>
    </Alert>
  );
};

export default ResultAlert;
