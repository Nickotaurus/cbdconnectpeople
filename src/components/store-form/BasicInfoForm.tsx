
import React from 'react';
import { FormData } from '@/types/store-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface BasicInfoFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  storeType?: string;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ 
  formData, 
  handleInputChange, 
  storeType = 'physical' 
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations générales</h3>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la boutique*</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Nom de votre boutique" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse*</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={handleInputChange} 
            placeholder="Adresse" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Ville*</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleInputChange} 
            placeholder="Ville" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal*</Label>
          <Input 
            id="postalCode" 
            name="postalCode" 
            value={formData.postalCode} 
            onChange={handleInputChange} 
            placeholder="Code postal" 
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleInputChange} 
          placeholder="Description de votre boutique"
          rows={4}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="isEcommerce" 
          name="isEcommerce"
          checked={formData.isEcommerce}
          onCheckedChange={(checked) => {
            const event = { 
              target: { 
                name: 'isEcommerce', 
                value: checked 
              } 
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(event);
          }}
        />
        <Label htmlFor="isEcommerce">Boutique en ligne / E-commerce</Label>
      </div>
      
      {formData.isEcommerce && (
        <div className="space-y-2">
          <Label htmlFor="ecommerceUrl">URL de la boutique en ligne</Label>
          <Input 
            id="ecommerceUrl" 
            name="ecommerceUrl" 
            type="url"
            value={formData.ecommerceUrl} 
            onChange={handleInputChange} 
            placeholder="https://www.votreboutique.fr" 
          />
        </div>
      )}
    </div>
  );
};

export default BasicInfoForm;
