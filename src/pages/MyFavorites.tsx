
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storesData } from '@/data/storesData';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ClientUser } from '@/types/auth';

const MyFavorites = () => {
  const navigate = useNavigate();
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  
  const [favorites, setFavorites] = useState<string[]>(clientUser?.favorites || []);
  
  // Redirect if not a client user
  useEffect(() => {
    if (!user || user.role !== 'client') {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleToggleFavorite = (storeId: string) => {
    setFavorites(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId);
      } else {
        return [...prev, storeId];
      }
    });
  };
  
  const handleSave = async () => {
    try {
      // In a real app, this would call an API to update the user's preferences
      await updateUserPreferences({ favorites });
      
      toast({
        title: "Préférences enregistrées",
        description: "Vos boutiques favorites ont été mises à jour",
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
          <h1 className="text-3xl font-bold">Mes boutiques favorites</h1>
          <Button onClick={() => navigate('/')}>
            Retour au tableau de bord
          </Button>
        </div>
        
        <Card className="mb-6">
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
                    checked={favorites.includes(store.id)}
                    onCheckedChange={() => handleToggleFavorite(store.id)}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor={`store-${store.id}`} className="text-base font-medium">
                      {store.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {store.address}, {store.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
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
