
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BasicInfoFields from './BasicInfoFields';
import EcommerceField from './EcommerceField';
import FormActions from './FormActions';
import { StoreData } from '@/types/store-types';
import StoreSearch from '../store/StoreSearch';

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
  skipSearch?: boolean;
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
  storeType,
  skipSearch = false
}) => {
  // Pour "CBD Histoire de Chanvre", on saute directement à l'onglet détails
  React.useEffect(() => {
    if (formData.name === "CBD Histoire de Chanvre" || skipSearch) {
      setActiveTab('details');
      setHasSearched(true);
    }
  }, [formData.name, setActiveTab, setHasSearched, skipSearch]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" disabled={isEdit || skipSearch}>Rechercher une boutique</TabsTrigger>
          <TabsTrigger value="details">Détails de la boutique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-sm space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Recherchez votre boutique</h3>
              <p className="text-muted-foreground text-sm">
                Trouvez votre boutique pour importer automatiquement les informations de Google Business
              </p>
            </div>
            <StoreSearch 
              onStoreSelect={handleStoreSelect} 
              isRegistration={true}
            />
            <div className="text-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActiveTab('details');
                  setHasSearched(true);
                }}
              >
                Passer cette étape
              </Button>
            </div>
          </div>
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
              isSubmitting={isLoading}
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
