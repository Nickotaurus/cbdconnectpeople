
import React from 'react';
import { FormData } from '@/types/store-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informations de contact</h3>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleInputChange} 
            placeholder="Numéro de téléphone" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input 
            id="website" 
            name="website" 
            type="url"
            value={formData.website} 
            onChange={handleInputChange} 
            placeholder="https://www.votresite.fr" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="logoUrl">URL du logo</Label>
        <Input 
          id="logoUrl" 
          name="logoUrl" 
          value={formData.logoUrl} 
          onChange={handleInputChange} 
          placeholder="URL de votre logo" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="photoUrl">URL de la photo principale</Label>
        <Input 
          id="photoUrl" 
          name="photoUrl" 
          value={formData.photoUrl} 
          onChange={handleInputChange} 
          placeholder="URL de la photo principale" 
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;
