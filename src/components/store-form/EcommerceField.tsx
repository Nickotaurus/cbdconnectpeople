
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Globe } from "lucide-react";

interface EcommerceFieldProps {
  isEcommerce?: boolean;
  ecommerceUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EcommerceField: React.FC<EcommerceFieldProps> = ({ isEcommerce, ecommerceUrl, onChange }) => {
  return (
    <div className="space-y-2 border p-4 rounded-lg bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Information E-commerce</h3>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="isEcommerce"
          name="isEcommerce"
          checked={isEcommerce}
          onCheckedChange={(checked) => {
            // Create a synthetic event to match the onChange handler's expectations
            const syntheticEvent = {
              target: {
                name: 'isEcommerce',
                value: checked,
                type: 'checkbox',
                checked: checked
              }
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }}
        />
        <Label htmlFor="isEcommerce">Boutique avec e-commerce</Label>
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
          disabled={!isEcommerce}
        />
        <p className="text-sm text-muted-foreground">
          Ajoutez l'adresse de votre site e-commerce pour plus de visibilité.
        </p>
      </div>
    </div>
  );
};

export default EcommerceField;
