
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import GoogleBusinessIntegration from './search/GoogleBusinessIntegration';

interface ManualStoreSearchProps {
  onStoreSelect: (store: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    placeId: string;
    photos?: string[];
    phone?: string;
    website?: string;
    rating?: number;
    totalReviews?: number;
  }) => void;
  isRegistration?: boolean;
}

type SearchFormValues = {
  storeName: string;
  city: string;
}

const ManualStoreSearch: React.FC<ManualStoreSearchProps> = ({
  onStoreSelect,
  isRegistration = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<SearchFormValues>({
    defaultValues: {
      storeName: "",
      city: ""
    }
  });

  const handleSearch = async (values: SearchFormValues) => {
    if (!values.storeName.trim()) {
      toast({
        title: "Champ vide",
        description: "Veuillez saisir le nom de votre établissement",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simuler une recherche et retourner des résultats
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Créer une boutique factice basée sur la recherche avec la ville fournie
      const mockStore = {
        name: values.storeName,
        address: "123 Rue du Commerce",
        city: values.city || "Paris", // Utiliser la ville saisie par l'utilisateur
        postalCode: values.city === "Paris" ? "75001" : 
                    values.city === "Marseille" ? "13001" : 
                    values.city === "Lyon" ? "69001" : "00000",
        latitude: values.city === "Paris" ? 48.8566 : 
                  values.city === "Marseille" ? 43.2965 : 
                  values.city === "Lyon" ? 45.7640 : 48.8566,
        longitude: values.city === "Paris" ? 2.3522 : 
                   values.city === "Marseille" ? 5.3698 : 
                   values.city === "Lyon" ? 4.8357 : 2.3522,
        placeId: "mock-place-id-" + Date.now(),
      };

      // Simuler la récupération d'une fiche Google Business
      if (Math.random() > 0.3) {
        const mockBusinessDetails = {
          name: values.storeName,
          address: `123 Rue du Commerce, ${mockStore.postalCode} ${values.city || "Paris"}`,
          phone: "+33 1 23 45 67 89",
          website: "https://www." + values.storeName.toLowerCase().replace(/\s+/g, '') + ".fr",
          rating: 4.5,
          totalReviews: 42,
          photos: [
            "https://images.unsplash.com/photo-1603726623530-8a99ef1f1d93?q=80&w=1000",
            "https://images.unsplash.com/photo-1590114416359-9e3e6c7be118?q=80&w=1000",
            "https://images.unsplash.com/photo-1628365056741-ea2b89eb6cd3?q=80&w=1000"
          ]
        };
        setBusinessDetails(mockBusinessDetails);
      } else {
        setBusinessDetails(null);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la recherche",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBusiness = () => {
    if (!businessDetails) return;

    const storeData = {
      name: businessDetails.name,
      address: businessDetails.address.split(',')[0],
      city: form.getValues().city || "Paris", // Utiliser la ville saisie
      postalCode: businessDetails.address.match(/\d{5}/) ? businessDetails.address.match(/\d{5}/)[0] : 
                  form.getValues().city === "Paris" ? "75001" : 
                  form.getValues().city === "Marseille" ? "13001" : 
                  form.getValues().city === "Lyon" ? "69001" : "00000",
      latitude: form.getValues().city === "Paris" ? 48.8566 : 
                form.getValues().city === "Marseille" ? 43.2965 : 
                form.getValues().city === "Lyon" ? 45.7640 : 48.8566,
      longitude: form.getValues().city === "Paris" ? 2.3522 : 
                 form.getValues().city === "Marseille" ? 5.3698 : 
                 form.getValues().city === "Lyon" ? 4.8357 : 2.3522,
      placeId: "google-business-" + Date.now(),
      photos: businessDetails.photos,
      phone: businessDetails.phone,
      website: businessDetails.website,
      rating: businessDetails.rating,
      totalReviews: businessDetails.totalReviews
    };

    onStoreSelect(storeData);
    setBusinessDetails(null);
  };

  const handleManualEntry = () => {
    const cityValue = form.getValues().city || "Paris";
    
    const storeData = {
      name: form.getValues().storeName,
      address: "À compléter",
      city: cityValue,
      postalCode: cityValue === "Paris" ? "75001" : 
                  cityValue === "Marseille" ? "13001" : 
                  cityValue === "Lyon" ? "69001" : "",
      latitude: cityValue === "Paris" ? 48.8566 : 
                cityValue === "Marseille" ? 43.2965 : 
                cityValue === "Lyon" ? 45.7640 : 48.8566,
      longitude: cityValue === "Paris" ? 2.3522 : 
                 cityValue === "Marseille" ? 5.3698 : 
                 cityValue === "Lyon" ? 4.8357 : 2.3522,
      placeId: "manual-entry-" + Date.now(),
    };

    onStoreSelect(storeData);
    setBusinessDetails(null);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Trouvez votre établissement</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de votre établissement</FormLabel>
                  <FormControl>
                    <Input placeholder="Ma Boutique CBD" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Recherche en cours...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </>
              )}
            </Button>
          </form>
        </Form>

        {businessDetails && (
          <GoogleBusinessIntegration
            businessDetails={businessDetails}
            isLoading={false}
            onAccept={handleSelectBusiness}
            onReject={handleManualEntry}
          />
        )}

        {isLoading ? (
          <div className="text-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Recherche en cours...</p>
          </div>
        ) : !businessDetails && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Entrez le nom de votre boutique et recherchez pour voir si une fiche Google Business existe.
              Sinon, vous pourrez saisir manuellement les informations.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleManualEntry}
              disabled={!form.getValues().storeName.trim()}
            >
              Saisir manuellement mes informations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManualStoreSearch;
