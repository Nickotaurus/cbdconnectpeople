
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Store } from "@/types/store";

interface StoreDashboardTabProps {
  store: Store;
  onEditClick: () => void;
  isStoreOwner?: boolean;
}

const StoreDashboardTab = ({ store, onEditClick, isStoreOwner = false }: StoreDashboardTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Informations de votre boutique</CardTitle>
          <CardDescription>
            Gérez les informations principales de votre boutique
          </CardDescription>
        </div>
        {isStoreOwner && (
          <Button onClick={onEditClick}>
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="font-medium mb-2">Visites ce mois</h3>
              <p className="text-2xl font-bold">238</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="font-medium mb-2">Partenaires favoris</h3>
              <p className="text-2xl font-bold">{store.favoritePartnersCount || 0}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="font-medium mb-2">Statut</h3>
              <p className="text-2xl font-bold">{store.isPremium ? "Premium" : "Basique"}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Informations générales</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm">Nom</p>
                  <p className="font-medium">{store.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Adresse</p>
                  <p className="font-medium">{store.address}</p>
                  <p className="font-medium">{store.postalCode} {store.city}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Téléphone</p>
                  <p className="font-medium">{store.phone || "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Site web</p>
                  <p className="font-medium">{store.website || "Non renseigné"}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Intégration Google</h3>
              {store.hasGoogleBusinessProfile ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium text-green-800">Profil Google Business connecté</p>
                  </div>
                  <p className="text-green-700 text-sm">Vos clients peuvent voir votre boutique sur Google Maps et Google Search.</p>
                  {isStoreOwner && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={onEditClick}
                    >
                      Mettre à jour les informations
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium text-amber-800">Profil Google Business non connecté</p>
                  </div>
                  <p className="text-amber-700 text-sm">Connectez votre profil Google Business pour améliorer votre visibilité.</p>
                  {isStoreOwner && (
                    <Button 
                      className="mt-3"
                      onClick={onEditClick}
                    >
                      Connecter Google Business
                    </Button>
                  )}
                </div>
              )}

              {store.isEcommerce && (
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium text-blue-800">Boutique E-commerce activée</p>
                  </div>
                  <p className="text-blue-700 text-sm">URL: {store.ecommerceUrl || "Non renseignée"}</p>
                </div>
              )}
            </div>
          </div>
          
          {store.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700">{store.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreDashboardTab;
