
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    website: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de la boutique*</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input 
          id="phone" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Adresse*</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">Ville*</Label>
        <Input 
          id="city" 
          name="city" 
          value={formData.city} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="postalCode">Code postal*</Label>
        <Input 
          id="postalCode" 
          name="postalCode" 
          value={formData.postalCode} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Site web</Label>
        <Input 
          id="website" 
          name="website" 
          type="url"
          value={formData.website} 
          onChange={handleChange} 
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
