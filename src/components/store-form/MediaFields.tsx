
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MediaFieldsProps {
  formData: {
    imageUrl: string;
    rating: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MediaFields: React.FC<MediaFieldsProps> = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de l'image</Label>
        <Input 
          id="imageUrl" 
          name="imageUrl" 
          type="url"
          value={formData.imageUrl} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rating">Note initiale (1-5)</Label>
        <Input 
          id="rating" 
          name="rating" 
          type="number" 
          min="1" 
          max="5" 
          step="0.1"
          value={formData.rating} 
          onChange={handleChange} 
        />
      </div>
    </div>
  );
};

export default MediaFields;
