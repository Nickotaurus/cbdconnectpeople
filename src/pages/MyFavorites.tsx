
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storesData } from '@/data/storesData';
import { Star, Store, Globe, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ClientUser } from '@/types/auth';

// Add ecommerce mock data
interface Ecommerce {
  id: string;
  name: string;
  url: string;
  description: string;
  logo: string;
}

const mockEcommerces: Ecommerce[] = [
  {
    id: "ec1",
    name: "CBD Shop France",
    url: "https://cbdshopfrance.fr",
    description: "Large sélection de produits CBD de qualité.",
    logo: "https://images.unsplash.com/photo-1589244159943-460088ed5c83?q=80&w=1000"
  },
  {
    id: "ec2",
    name: "Green Life CBD",
    url: "https://greenlifecbd.com",
    description: "Produits biologiques et certifiés.",
    logo: "https://images.unsplash.com/photo-1571166052181-bdb4647b7d3f?q=80&w=1000"
  },
  {
    id: "ec3",
    name: "CBD Factory",
    url: "https://cbdfactory.fr",
    description: "Vente en gros et au détail.",
    logo: "https://images.unsplash.com/photo-1603902840053-424a302f692d?q=80&w=1000"
  },
  {
    id: "ec4",
    name: "Premium CBD",
    url: "https://premiumcbd.fr",
    description: "Produits haut de gamme.",
    logo: "https://images.unsplash.com/photo-1615233500558-c4f518b983ae?q=80&w=1000"
  },
  {
    id: "ec5",
    name: "CBDirect",
    url: "https://cbdirect.com",
    description: "Prix compétitifs et livraison express.",
    logo: "https://images.unsplash.com/photo-1580397581145-cdb6a35b7d3f?q=80&w=1000"
  }
];

const MyFavorites = () => {
  const navigate = useNavigate();
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  
  const [favoriteStores, setFavoriteStores] = useState<string[]>([]);
  const [favoriteEcommerces, setFavoriteEcommerces] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("stores");
  
  // Redirect if not a client user
  useEffect(() => {
    if (!user || user.role !== 'client') {
      navigate('/');
    } else {
      // Initialize favorites
      const allFavorites = clientUser?.favorites || [];
      setFavoriteStores(allFavorites.filter(id => !id.startsWith('ec')));
      setFavoriteEcommerces(allFavorites.filter(id => id.startsWith('ec')));
    }
  }, [user, navigate, clientUser?.favorites]);
  
  const handleToggleFavorite = (itemId: string, type: 'store' | 'ecommerce') => {
    if (type === 'store') {
      setFavoriteStores(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    } else {
      setFavoriteEcommerces(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    }
  };
  
  const handleSave = async () => {
    try {
      // Combine both types of favorites
      const allFavorites = [...favoriteStores, ...favoriteEcommerces];
      
      // Update user preferences
      await updateUserPreferences({ favorites: allFavorites });
      
      toast({
        title: "Préférences enregistrées",
        description: "Vos favoris ont été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes favoris</h1>
          <Button onClick={() => navigate('/')}>
            Retour au tableau de bord
          </Button>
        </div>
        
        <Tabs defaultValue="stores" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stores" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Boutiques physiques
            </TabsTrigger>
            <TabsTrigger value="ecommerce" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Sites e-commerce
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stores">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Star className="h-5 w-5 mr-2 text-primary" />
                  Sélectionnez vos boutiques préférées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces boutiques apparaîtront dans votre section "Mes meilleures boutiques" et vous serez informé de leurs promotions.
                </p>
                
                <div className="grid gap-4 mt-4">
                  {storesData.map(store => (
                    <div key={store.id} className="flex items-center space-x-4 border p-3 rounded-md">
                      <Checkbox 
                        id={`store-${store.id}`}
                        checked={favoriteStores.includes(store.id)}
                        onCheckedChange={() => handleToggleFavorite(store.id, 'store')}
                      />
                      <div className="grid gap-1">
                        <Label htmlFor={`store-${store.id}`} className="text-base font-medium">
                          {store.name}
                        </Label>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {store.address}, {store.city}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ecommerce">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  Sélectionnez vos sites e-commerce préférés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces sites apparaîtront dans vos favoris et vous serez informé de leurs promotions et nouveautés.
                </p>
                
                <div className="grid gap-4 mt-4">
                  {mockEcommerces.map(ecommerce => (
                    <div key={ecommerce.id} className="flex items-center space-x-4 border p-3 rounded-md">
                      <Checkbox 
                        id={`ecommerce-${ecommerce.id}`}
                        checked={favoriteEcommerces.includes(ecommerce.id)}
                        onCheckedChange={() => handleToggleFavorite(ecommerce.id, 'ecommerce')}
                      />
                      <div className="flex items-center flex-1 gap-3">
                        <img 
                          src={ecommerce.logo} 
                          alt={ecommerce.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                        <div>
                          <Label htmlFor={`ecommerce-${ecommerce.id}`} className="text-base font-medium">
                            {ecommerce.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {ecommerce.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8">
            Enregistrer mes préférences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyFavorites;
