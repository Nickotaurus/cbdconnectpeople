
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  
  return (
    <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 flex items-start">
      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-medium">Erreur</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
