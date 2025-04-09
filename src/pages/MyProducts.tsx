
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookmarkCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ClientUser } from '@/types/auth';

interface CbdProduct {
  id: string;
  name: string;
  category: string;
  description: string;
}

const products: CbdProduct[] = [
  { id: "1", name: "Huile CBD 5%", category: "Huiles", description: "Huile sublinguale à spectre complet" },
  { id: "2", name: "Huile CBD 10%", category: "Huiles", description: "Huile sublinguale à spectre complet" },
  { id: "3", name: "Huile CBD 15%", category: "Huiles", description: "Huile sublinguale à spectre complet" },
  { id: "4", name: "Fleur CBD Amnesia", category: "Fleurs", description: "Fleur CBD indoor premium" },
  { id: "5", name: "Fleur CBD Strawberry", category: "Fleurs", description: "Fleur CBD indoor premium" },
  { id: "6", name: "Fleur CBD Lemon Haze", category: "Fleurs", description: "Fleur CBD indoor premium" },
  { id: "7", name: "Crème CBD", category: "Cosmétiques", description: "Soin hydratant au CBD" },
  { id: "8", name: "Gummies CBD", category: "Comestibles", description: "Bonbons infusés au CBD" },
  { id: "9", name: "Thé CBD", category: "Infusions", description: "Infusion relaxante au CBD" },
];

const MyProducts = () => {
  const navigate = useNavigate();
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>(clientUser?.favoriteProducts || []);
  
  // Redirect if not a client user
  useEffect(() => {
    if (!user || user.role !== 'client') {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleToggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  const handleSave = async () => {
    try {
      // In a real app, this would call an API to update the user's preferences
      await updateUserPreferences({ favoriteProducts: selectedProducts });
      
      toast({
        title: "Préférences enregistrées",
        description: "Vos produits favoris ont été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences",
        variant: "destructive",
      });
    }
  };
  
  // Group products by category
  const productsByCategory = products.reduce<Record<string, CbdProduct[]>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes produits préférés</h1>
          <Button onClick={() => navigate('/')}>
            Retour au tableau de bord
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BookmarkCheck className="h-5 w-5 mr-2 text-primary" />
              Sélectionnez vos produits CBD préférés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Veuillez sélectionner au moins 3 produits qui vous intéressent. Nous vous tiendrons informé des offres et nouveautés concernant ces produits.
            </p>
            
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-medium mb-2">{category}</h3>
                <div className="grid gap-3">
                  {categoryProducts.map(product => (
                    <div key={product.id} className="flex items-center space-x-4 border p-3 rounded-md">
                      <Checkbox 
                        id={`product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleToggleProduct(product.id)}
                      />
                      <div className="grid gap-1">
                        <Label htmlFor={`product-${product.id}`} className="text-base font-medium">
                          {product.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {selectedProducts.length < 3 ? (
              <span className="text-destructive">Veuillez sélectionner au moins 3 produits</span>
            ) : (
              <span>Vous avez sélectionné {selectedProducts.length} produits</span>
            )}
          </p>
          <Button onClick={handleSave} className="px-8" disabled={selectedProducts.length < 3}>
            Enregistrer mes préférences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
