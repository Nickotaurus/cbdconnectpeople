
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Store } from "@/types/store"; 
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe } from "lucide-react";

interface UnauthorizedAccessProps {
  storeId?: string;
  store?: Store | null;
}

const UnauthorizedAccessStore = ({ storeId, store }: UnauthorizedAccessProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Informations de la boutique</CardTitle>
          <CardDescription>
            Consultez les informations de cette boutique
          </CardDescription>
        </CardHeader>
        <CardContent>
          {store ? (
            <div className="space-y-4">
              {store.photo_url && (
                <div className="w-full h-48 overflow-hidden rounded-md">
                  <img 
                    src={store.photo_url} 
                    alt={store.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-bold">{store.name}</h2>
                {store.isPremium && (
                  <Badge className="ml-2 bg-amber-500">Premium</Badge>
                )}
              </div>
              
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p>{store.address}</p>
                    <p>{store.postalCode} {store.city}</p>
                  </div>
                </div>
                
                {store.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <p>{store.phone}</p>
                  </div>
                )}
                
                {store.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <a 
                      href={store.website.startsWith('http') ? store.website : `https://${store.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {store.website}
                    </a>
                  </div>
                )}
              </div>
              
              {store.description && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">À propos</h3>
                  <p className="text-muted-foreground">{store.description}</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  L'espace d'administration de cette boutique est réservé à son propriétaire.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground mb-4">
              Informations de la boutique non disponibles.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          {storeId && (
            <Button variant="outline" onClick={() => navigate(`/store/${storeId}`)}>
              Voir la fiche boutique
            </Button>
          )}
          <Button onClick={() => navigate("/")}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnauthorizedAccessStore;
