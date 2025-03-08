
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, MapPin, Building, Globe, Phone, Mail, Award, Flower, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const ProducerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock producer data - would come from API in real app
  const producer = {
    id: id,
    name: "Chanvre des Cévennes",
    description: "Producteur de chanvre CBD de qualité supérieure, cultivé en plein air dans les Cévennes. Nous proposons une large variété de fleurs CBD riches en terpènes et cultivées sans pesticides.",
    location: {
      address: "Route des Collines",
      city: "Saint-Jean-du-Gard",
      postalCode: "30270",
      coordinates: {
        lat: 44.1045,
        lng: 3.8857
      }
    },
    contact: {
      email: "contact@chanvredescevennes.fr",
      phone: "04 66 85 32 76",
      website: "https://chanvredescevennes.fr"
    },
    cultivation: {
      type: "outdoor",
      sellsToPublic: true
    },
    certifications: ["Agriculture Biologique", "Sans pesticides", "Culture responsable"],
    specialties: ["Amnesia", "Cheese", "Critical", "Sour Diesel"],
    photos: ["https://images.unsplash.com/photo-1536152470836-b943b246224c"]
  };
  
  // Define what cultivation type label to show based on type
  const cultivationLabels = {
    outdoor: "Culture en extérieur",
    indoor: "Culture en intérieur",
    greenhouse: "Culture sous serre",
    mixed: "Culture mixte"
  };
  
  // Check if user is a store and is verified to enable contact
  const isVerifiedStore = user?.role === "store" && user.isVerified;
  
  const handleContactRequest = () => {
    if (isVerifiedStore) {
      toast({
        title: "Demande envoyée",
        description: `Votre demande de contact a été envoyée à ${producer.name}.`,
      });
    } else {
      toast({
        title: "Action impossible",
        description: "Vous devez être une boutique vérifiée pour contacter les producteurs.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddToFavorites = () => {
    toast({
      title: "Ajouté aux favoris",
      description: `${producer.name} a été ajouté à vos producteurs favoris.`,
    });
  };
  
  if (!producer) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Producteur non trouvé</CardTitle>
            <CardDescription>Ce producteur n'existe pas ou a été supprimé.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/producers')}>
              Retour à la liste des producteurs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{producer.name}</h1>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{producer.location.city}, {producer.location.postalCode}</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {producer.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start">
                  <Leaf className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Type de culture</p>
                    <p className="text-sm text-muted-foreground">
                      {cultivationLabels[producer.cultivation.type as keyof typeof cultivationLabels]}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Vente</p>
                    <p className="text-sm text-muted-foreground">
                      {producer.cultivation.sellsToPublic 
                        ? "Professionnels et particuliers" 
                        : "Professionnels uniquement"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Certifications</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {producer.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Flower className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Spécialités</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {producer.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.role === "store" ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${producer.contact.email}`} className="text-sm hover:underline">
                        {producer.contact.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${producer.contact.phone}`} className="text-sm hover:underline">
                        {producer.contact.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={producer.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                        Site web
                      </a>
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <Button 
                      className="w-full"
                      onClick={handleContactRequest}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contacter
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleAddToFavorites}
                    >
                      Ajouter aux favoris
                    </Button>
                  </div>
                </>
              ) : (
                <div className="bg-muted p-4 rounded text-sm text-center">
                  <p className="font-medium mb-2">Accès limité</p>
                  <p className="text-muted-foreground mb-4">
                    Les coordonnées complètes sont réservées aux boutiques vérifiées.
                  </p>
                  {!user || user.role !== "store" ? (
                    <Button variant="outline" className="w-full" onClick={() => navigate('/register')}>
                      S'inscrire en tant que boutique
                    </Button>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="photos">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
          <TabsTrigger value="location" className="flex-1">Localisation</TabsTrigger>
          <TabsTrigger value="products" className="flex-1">Produits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="photos" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {producer.photos.map((photo, index) => (
              <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img 
                  src={photo} 
                  alt={`${producer.name} - Photo ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
            {producer.photos.length === 0 && (
              <div className="col-span-2 h-48 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Aucune photo disponible</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="location">
          <Card>
            <CardContent className="pt-6">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Carte non disponible en aperçu</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="font-medium">Adresse</p>
                <p className="text-muted-foreground">
                  {producer.location.address}
                  <br />
                  {producer.location.postalCode} {producer.location.city}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {user?.role === "store" 
                    ? "Informations sur les produits disponibles sur demande"
                    : "Informations sur les produits réservées aux boutiques vérifiées"}
                </p>
                
                {!user || user.role !== "store" ? (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/register')}
                  >
                    S'inscrire en tant que boutique
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProducerProfile;
