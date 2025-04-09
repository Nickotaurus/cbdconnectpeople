
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationFieldsProps {
  formData: {
    latitude: number;
    longitude: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const LocationFields: React.FC<LocationFieldsProps> = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="latitude">Latitude*</Label>
        <Input 
          id="latitude" 
          name="latitude" 
          type="number" 
          step="0.0001"
          value={formData.latitude} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="longitude">Longitude*</Label>
        <Input 
          id="longitude" 
          name="longitude" 
          type="number" 
          step="0.0001"
          value={formData.longitude} 
          onChange={handleChange} 
          required 
        />
      </div>
    </div>
  );
};

export default LocationFields;
