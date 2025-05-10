
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import StoreSearch from './StoreSearch';
import BasicInfoForm from './BasicInfoForm';
import ContactInfoForm from './ContactInfoForm';
import DetailsInfoForm from './DetailsInfoForm';
import { FormData } from '@/types/store-form';
import { Store } from '@/types/store';
import FormActions from './FormActions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface StoreFormTabsProps {
  isEdit?: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleStoreSelect: (store: Store | null) => void;
  setHasSearched: (value: boolean) => void;
  hasSearched: boolean;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  navigate: (path: string) => void;
  storeType?: string;
  skipSearch?: boolean;
  isDuplicate?: boolean;
}

const StoreFormTabs = ({
  isEdit = false,
  activeTab,
  setActiveTab,
  formData,
  handleInputChange,
  handleStoreSelect,
  setHasSearched,
  hasSearched,
  isLoading,
  handleSubmit,
  navigate,
  storeType = 'physical',
  skipSearch = false,
  isDuplicate = false
}: StoreFormTabsProps) => {
  // Fonction pour gérer le changement d'onglet manuellement
  const handleTabChange = (value: string) => {
    console.log("Changement d'onglet vers:", value);
    setActiveTab(value);
  };

  // Ajouter cette fonction pour gérer la soumission du formulaire
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Soumission du formulaire depuis StoreFormTabs");
    handleSubmit(e);
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="search" disabled={skipSearch}>Rechercher</TabsTrigger>
          <TabsTrigger value="basic">Infos générales</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>
      
      
        <form onSubmit={onFormSubmit}>
          <Card>
            <CardContent className="p-6">
              <TabsContent value="search" className="space-y-6 mt-6">
                <StoreSearch
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleStoreSelect={handleStoreSelect}
                  setHasSearched={setHasSearched}
                  hasSearched={hasSearched}
                  isLoading={isLoading}
                  skipSearch={skipSearch}
                />
              </TabsContent>
              
              <TabsContent value="basic" className="space-y-6 mt-6">
                <BasicInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  storeType={storeType}
                />
                
                {isDuplicate && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Boutique déjà enregistrée</AlertTitle>
                    <AlertDescription>
                      Cette boutique semble déjà être présente dans notre base de données. 
                      Merci de vérifier les informations ou de contacter le support.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-6 mt-6">
                <ContactInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6 mt-6">
                <DetailsInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </TabsContent>
            </CardContent>
            
            <FormActions
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              navigate={navigate}
              isLoading={isLoading}
              isEdit={isEdit}
              isDisabled={isDuplicate}
            />
          </Card>
        </form>
      </Tabs>
    </div>
  );
};

export default StoreFormTabs;
