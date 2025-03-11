
import { useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PartnerCategory } from '@/types/auth';

interface PartnerRegistrationInfoProps {
  partnerCategory: PartnerCategory | '';
  setPartnerCategory: (category: PartnerCategory | '') => void;
}

const PartnerRegistrationInfo = ({ partnerCategory, setPartnerCategory }: PartnerRegistrationInfoProps) => {
  const partnerCategories = [
    { value: "bank", label: "Banque" },
    { value: "accountant", label: "Comptable" },
    { value: "legal", label: "Juriste" },
    { value: "insurance", label: "Assurance" },
    { value: "logistics", label: "Logistique" },
    { value: "breeder", label: "Breeder" },
    { value: "label", label: "Label" },
    { value: "association", label: "Association" },
    { value: "media", label: "Média" },
    { value: "laboratory", label: "Laboratoire" },
    { value: "production", label: "Production" },
    { value: "realEstate", label: "Agence immobilière" }
  ];

  return (
    <TabsContent value="partner" className="mt-2">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Proposez vos services spécialisés aux professionnels du CBD et développez votre activité.
        </p>
        
        <div className="grid gap-2">
          <Label htmlFor="partnerCategory">Catégorie de partenaire</Label>
          <Select 
            value={partnerCategory} 
            onValueChange={(value) => setPartnerCategory(value as PartnerCategory)}
          >
            <SelectTrigger id="partnerCategory">
              <SelectValue placeholder="Sélectionnez votre activité" />
            </SelectTrigger>
            <SelectContent>
              {partnerCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </TabsContent>
  );
};

export default PartnerRegistrationInfo;
