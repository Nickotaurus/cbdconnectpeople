
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

const ManualStoreSearch: React.FC<ManualStoreSearchProps> = ({
  onStoreSelect,
  isRegistration = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
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

      // Créer une boutique factice basée sur la recherche
      const mockStore = {
        name: searchTerm,
        address: "123 Rue du Commerce",
        city: "Paris",
        postalCode: "75001",
        latitude: 48.8566,
        longitude: 2.3522,
        placeId: "mock-place-id-" + Date.now(),
      };

      // Simuler la récupération d'une fiche Google Business
      if (Math.random() > 0.3) {
        const mockBusinessDetails = {
          name: searchTerm,
          address: "123 Rue du Commerce, 75001 Paris",
          phone: "+33 1 23 45 67 89",
          website: "https://www." + searchTerm.toLowerCase().replace(/\s+/g, '') + ".fr",
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
      city: "Paris", // Simplification
      postalCode: "75001", // Simplification
      latitude: 48.8566, // Valeur par défaut pour Paris
      longitude: 2.3522, // Valeur par défaut pour Paris
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
    const storeData = {
      name: searchTerm,
      address: "À compléter",
      city: "",
      postalCode: "",
      latitude: 48.8566, // Valeur par défaut pour Paris
      longitude: 2.3522, // Valeur par défaut pour Paris
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
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Nom de votre établissement"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Rechercher
          </Button>
        </div>

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
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Entrez le nom de votre boutique et recherchez pour voir si une fiche Google Business existe.
              Sinon, vous pourrez saisir manuellement les informations.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleManualEntry}
              disabled={!searchTerm.trim()}
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
