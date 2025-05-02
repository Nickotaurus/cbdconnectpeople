
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import StoreSearch from '@/components/store/StoreSearch';
import BasicInfoFields from './BasicInfoFields';
import EcommerceField from './EcommerceField';
import FormActions from './FormActions';
import { StoreData } from '@/types/store-types';

interface FormData {
  id?: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  phone: string;
  website: string;
  logoUrl: string;
  photoUrl: string;
  placeId: string;
  isEcommerce: boolean;
  ecommerceUrl: string;
}

interface StoreFormTabsProps {
  isEdit: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStoreSelect: (store: StoreData) => void;
  setHasSearched: (value: boolean) => void;
  hasSearched: boolean;
  isLoading: boolean;
  navigate: (path: number | string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  storeType?: string;
}

const StoreFormTabs: React.FC<StoreFormTabsProps> = ({
  isEdit,
  activeTab,
  setActiveTab,
  formData,
  handleInputChange,
  handleStoreSelect,
  setHasSearched,
  hasSearched,
  isLoading,
  navigate,
  handleSubmit,
  storeType
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" disabled={isEdit}>Rechercher une boutique</TabsTrigger>
          <TabsTrigger value="details">Détails de la boutique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-4">
          {!isEdit && (
            <>
              <div className="rounded-lg bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Rechercher votre boutique</h3>
                <p className="text-muted-foreground mb-4">
                  Recherchez votre boutique pour récupérer automatiquement les informations de Google Business.
                </p>
                
                <StoreSearch 
                  onStoreSelect={handleStoreSelect} 
                  isRegistration={true}
                />
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => navigate(-1)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => {
                      setActiveTab('details');
                      setHasSearched(true);
                    }}
                  >
                    Continuer manuellement
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="details" className="space-y-6">
          <div className="rounded-lg bg-card p-6 shadow-sm space-y-6">
            <BasicInfoFields 
              formData={formData} 
              handleChange={handleInputChange}
            />
            
            <EcommerceField 
              ecommerceUrl={formData.ecommerceUrl}
              isEcommerce={formData.isEcommerce}
              onChange={handleInputChange}
            />
            
            <FormActions 
              isLoading={isLoading}
              onCancel={() => navigate(-1)}
              storeType={storeType}
            />
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default StoreFormTabs;
