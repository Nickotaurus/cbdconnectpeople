
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({ description, handleChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description*</Label>
      <Textarea 
        id="description" 
        name="description" 
        value={description} 
        onChange={handleChange} 
        rows={5}
        required 
      />
    </div>
  );
};

export default DescriptionField;
