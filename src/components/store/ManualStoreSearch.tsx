
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import GoogleBusinessIntegration from './search/GoogleBusinessIntegration';
import { useGooglePlacesApi } from '@/hooks/store/useGooglePlacesApi';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PartyPopper } from "lucide-react";
import { ReviewData } from '@/types/store/store-data';
import { Separator } from '@/components/ui/separator';

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
    reviews?: ReviewData[];
    openingHours?: string[];
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
  const [showWelcome, setShowWelcome] = useState(false);
  const { toast } = useToast();
  const { isApiLoaded } = useGooglePlacesApi();
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  
  const form = useForm<SearchFormValues>({
    defaultValues: {
      storeName: "",
      city: ""
    }
  });

  useEffect(() => {
    if (isApiLoaded && !placesService) {
      // Créer un élément div pour le service Places
      const placesDiv = document.createElement('div');
      placesDiv.style.display = 'none';
      document.body.appendChild(placesDiv);
      
      // Initialiser le service Places
      const service = new google.maps.places.PlacesService(placesDiv);
      setPlacesService(service);
      
      return () => {
        // Nettoyer l'élément div lors du démontage du composant
        document.body.removeChild(placesDiv);
      };
    }
  }, [isApiLoaded]);

  const handleSearch = async (values: SearchFormValues) => {
    if (!values.storeName.trim()) {
      toast({
        title: "Champ vide",
        description: "Veuillez saisir le nom de votre établissement",
      });
      return;
    }

    if (!isApiLoaded || !placesService) {
      toast({
        title: "API non disponible",
        description: "L'API Google Maps n'est pas encore chargée. Veuillez réessayer dans quelques instants.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setBusinessDetails(null);

    try {
      // Construire la requête de recherche en incluant le nom et la ville
      const searchQuery = `${values.storeName} ${values.city}`;
      
      // Définir les coordonnées par défaut basées sur la ville (pour aider à localiser la recherche)
      let location;
      switch (values.city.toLowerCase()) {
        case 'paris':
          location = new google.maps.LatLng(48.8566, 2.3522);
          break;
        case 'marseille':
          location = new google.maps.LatLng(43.2965, 5.3698);
          break;
        case 'lyon':
          location = new google.maps.LatLng(45.7640, 4.8357);
          break;
        default:
          // France par défaut
          location = new google.maps.LatLng(46.603354, 1.888334);
      }

      const request = {
        query: searchQuery,
        location: location,
        radius: 50000, // 50km
        fields: ['name', 'formatted_address', 'place_id', 'geometry', 'photos', 'rating', 'user_ratings_total', 'website', 'formatted_phone_number', 'reviews', 'opening_hours']
      };

      placesService.textSearch(request, (results, status) => {
        setIsLoading(false);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          console.log("Résultats de recherche Google Places:", results);
          
          // Prendre le premier résultat pour les détails
          const place = results[0];
          
          // Récupérer les photos si disponibles
          const photos = place.photos 
            ? place.photos.slice(0, 10).map(photo => photo.getUrl({maxWidth: 800, maxHeight: 600}))
            : [];
          
          // Créer l'objet de détails métier
          const placeDetails = {
            name: place.name || '',
            address: place.formatted_address || '',
            phone: place.formatted_phone_number || '',
            website: place.website || '',
            rating: place.rating || 0,
            totalReviews: place.user_ratings_total || 0,
            photos: photos,
            reviews: [],
            openingHours: place.opening_hours?.weekday_text || []
          };
          
          setBusinessDetails(placeDetails);
          
          // Si le place_id est disponible, récupérer tous les détails complets
          if (place.place_id) {
            placesService.getDetails({
              placeId: place.place_id,
              fields: ['name', 'formatted_address', 'place_id', 'geometry', 'photos', 'rating', 'user_ratings_total', 'website', 'formatted_phone_number', 'reviews', 'opening_hours']
            }, (placeDetail, detailStatus) => {
              if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetail) {
                console.log("Détails complets du lieu:", placeDetail);
                
                // Mettre à jour les photos si disponibles
                const updatedPhotos = placeDetail.photos 
                  ? placeDetail.photos.slice(0, 10).map(photo => photo.getUrl({maxWidth: 800, maxHeight: 600}))
                  : photos;
                
                // Extraire les avis si disponibles
                const reviews = placeDetail.reviews 
                  ? placeDetail.reviews.map(review => ({
                      author_name: review.author_name,
                      rating: review.rating,
                      text: review.text,
                      time: review.time,
                      relative_time_description: review.relative_time_description,
                      profile_photo_url: review.profile_photo_url
                    })) 
                  : [];
                
                // Extraire les horaires d'ouverture si disponibles
                const openingHours = placeDetail.opening_hours?.weekday_text || [];
                
                const updatedDetails = {
                  name: placeDetail.name || place.name || '',
                  address: placeDetail.formatted_address || place.formatted_address || '',
                  phone: placeDetail.formatted_phone_number || '',
                  website: placeDetail.website || '',
                  rating: placeDetail.rating || place.rating || 0,
                  totalReviews: placeDetail.user_ratings_total || place.user_ratings_total || 0,
                  photos: updatedPhotos,
                  reviews: reviews,
                  openingHours: openingHours
                };
                
                setBusinessDetails(updatedDetails);
              }
            });
          }
        } else {
          console.log("Pas de résultats ou erreur:", status);
          toast({
            title: "Aucun résultat trouvé",
            description: "Aucun établissement n'a été trouvé avec ces critères. Essayez d'élargir votre recherche ou de saisir manuellement les informations.",
            variant: "default",
          });
        }
      });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la recherche",
        variant: "destructive",
      });
    }
  };

  const handleSelectBusiness = () => {
    if (!businessDetails) return;

    // Extraire le code postal de l'adresse
    const postalCodeMatch = businessDetails.address.match(/\b\d{5}\b/);
    const postalCode = postalCodeMatch ? postalCodeMatch[0] : 
                       form.getValues().city === "Paris" ? "75001" : 
                       form.getValues().city === "Marseille" ? "13001" : 
                       form.getValues().city === "Lyon" ? "69001" : "00000";
    
    // Extraire la ville de l'adresse ou utiliser celle fournie par l'utilisateur
    let city = form.getValues().city;
    if (!city) {
      const addressParts = businessDetails.address.split(',');
      // Si l'adresse a plus d'une partie, la ville est généralement dans la deuxième partie
      if (addressParts.length > 1) {
        // Nettoyer et extraire la ville
        const cityPart = addressParts[1].trim();
        // La ville est souvent après le code postal
        const cityMatch = cityPart.match(/\d{5}\s+(.+)/);
        if (cityMatch && cityMatch[1]) {
          city = cityMatch[1].trim();
        } else {
          city = cityPart.replace(/\d{5}/g, '').trim();
        }
      }
    }

    // Créer l'objet pour la sélection de la boutique
    const storeData = {
      name: businessDetails.name,
      address: businessDetails.address.split(',')[0],
      city: city || "Paris",
      postalCode: postalCode,
      latitude: 0, // Ces valeurs seront mises à jour dans la prochaine étape
      longitude: 0,
      placeId: "google-business-" + Date.now(),
      photos: businessDetails.photos,
      phone: businessDetails.phone,
      website: businessDetails.website,
      rating: businessDetails.rating,
      totalReviews: businessDetails.totalReviews,
      reviews: businessDetails.reviews,
      openingHours: businessDetails.openingHours
    };

    // Utiliser l'API Geocoding pour obtenir des coordonnées précises
    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder();
      const address = `${storeData.address}, ${storeData.postalCode} ${storeData.city}, France`;
      
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          storeData.latitude = location.lat();
          storeData.longitude = location.lng();
        }
        
        onStoreSelect(storeData);
        setBusinessDetails(null);
        setShowWelcome(true);
      });
    } else {
      // Fallback si l'API Geocoder n'est pas disponible
      storeData.latitude = form.getValues().city === "Paris" ? 48.8566 : 
                           form.getValues().city === "Marseille" ? 43.2965 : 
                           form.getValues().city === "Lyon" ? 45.7640 : 48.8566;
      storeData.longitude = form.getValues().city === "Paris" ? 2.3522 : 
                            form.getValues().city === "Marseille" ? 5.3698 : 
                            form.getValues().city === "Lyon" ? 4.8357 : 2.3522;
      
      onStoreSelect(storeData);
      setBusinessDetails(null);
      setShowWelcome(true);
    }
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
    setShowWelcome(true);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Recherchez votre établissement</CardTitle>
      </CardHeader>
      <CardContent>
        {showWelcome ? (
          <Alert className="bg-green-50 border-green-200 mb-6">
            <PartyPopper className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Bravo et bienvenue dans le réseau !</AlertTitle>
            <AlertDescription className="text-green-600">
              En rejoignant la plateforme, vous faites un pas concret vers plus de visibilité, 
              de connexions utiles et d'entraide entre pros du CBD. Ensemble, on va plus loin.
            </AlertDescription>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setShowWelcome(false)}
            >
              Continuer
            </Button>
          </Alert>
        ) : (
          <>
            <div className="bg-muted p-3 rounded-md mb-4 text-sm">
              <p>Pour retrouver votre établissement, commencez par saisir son nom et sa ville. 
              Nous chercherons automatiquement les informations disponibles sur Google.</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de votre établissement</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: CBD Histoire de Chanvre" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Paris" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !isApiLoaded}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Recherche en cours...
                    </>
                  ) : !isApiLoaded ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Chargement de l'API...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher mon établissement
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {businessDetails && (
              <>
                <Separator className="my-6" />
                <GoogleBusinessIntegration
                  businessDetails={businessDetails}
                  isLoading={false}
                  onAccept={handleSelectBusiness}
                  onReject={handleManualEntry}
                />
              </>
            )}

            {isLoading ? (
              <div className="text-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Recherche en cours...</p>
              </div>
            ) : !businessDetails && (
              <div className="mt-6">
                <Separator className="mb-6" />
                <p className="text-sm text-muted-foreground mb-4">
                  Si vous ne trouvez pas votre établissement ou si vous êtes en cours de création, 
                  vous pouvez saisir manuellement vos informations.
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ManualStoreSearch;
