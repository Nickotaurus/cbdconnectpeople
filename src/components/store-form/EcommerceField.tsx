
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";

interface EcommerceFieldProps {
  isEcommerce?: boolean;
  ecommerceUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EcommerceField: React.FC<EcommerceFieldProps> = ({ ecommerceUrl, onChange }) => {
  return (
    <div className="space-y-2 border p-4 rounded-lg bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Information E-commerce</h3>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ecommerceUrl">URL de votre boutique en ligne</Label>
        <Input 
          id="ecommerceUrl" 
          name="ecommerceUrl" 
          type="url"
          placeholder="https://www.votreboutiquecbd.fr" 
          value={ecommerceUrl} 
          onChange={onChange} 
        />
        <p className="text-sm text-muted-foreground">
          Vous pourrez configurer plus de détails sur votre e-commerce après avoir souscrit à un abonnement.
        </p>
      </div>
    </div>
  );
};

export default EcommerceField;
