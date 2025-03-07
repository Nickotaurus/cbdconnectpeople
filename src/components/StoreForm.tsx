
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { addStore, Store } from '@/utils/data';

interface StoreFormProps {
  onSuccess?: (store: Store) => void;
}

const StoreForm: React.FC<StoreFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    website: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1603726623530-8a99ef1f1d93?q=80&w=1000', // Default image
    rating: 4.0,
    reviewCount: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' || name === 'rating' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare the complete store object
      const storeData: Omit<Store, 'id'> = {
        ...formData,
        openingHours: [
          { day: "Lundi", hours: "11:00 - 19:00" },
          { day: "Mardi", hours: "11:00 - 19:00" },
          { day: "Mercredi", hours: "11:00 - 19:00" },
          { day: "Jeudi", hours: "11:00 - 19:00" },
          { day: "Vendredi", hours: "11:00 - 19:00" },
          { day: "Samedi", hours: "10:00 - 19:00" },
          { day: "Dimanche", hours: "Fermé" },
        ],
        coupon: {
          code: `${formData.name.substring(0, 5).toUpperCase()}10`,
          discount: "10% sur tout le magasin",
          validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        },
        reviews: [],
        products: [
          { category: "Fleurs", origin: "France", quality: "Bio" },
          { category: "Huiles", origin: "France", quality: "Premium" },
        ]
      };
      
      // Add the store
      const newStore = addStore(storeData);
      
      toast({
        title: "Boutique ajoutée avec succès",
        description: `La boutique "${newStore.name}" a été ajoutée.`,
        duration: 3000,
      });
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(newStore);
      }
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        latitude: 0,
        longitude: 0,
        phone: '',
        website: '',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1603726623530-8a99ef1f1d93?q=80&w=1000',
        rating: 4.0,
        reviewCount: 0
      });
      
    } catch (error) {
      console.error("Erreur lors de l'ajout de la boutique:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la boutique.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la boutique*</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse*</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Ville*</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal*</Label>
          <Input 
            id="postalCode" 
            name="postalCode" 
            value={formData.postalCode} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input 
            id="website" 
            name="website" 
            type="url"
            value={formData.website} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude*</Label>
          <Input 
            id="latitude" 
            name="latitude" 
            type="number" 
            step="0.0001"
            value={formData.latitude} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude*</Label>
          <Input 
            id="longitude" 
            name="longitude" 
            type="number" 
            step="0.0001"
            value={formData.longitude} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description*</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          rows={5}
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL de l'image</Label>
          <Input 
            id="imageUrl" 
            name="imageUrl" 
            type="url"
            value={formData.imageUrl} 
            onChange={handleChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rating">Note initiale (1-5)</Label>
          <Input 
            id="rating" 
            name="rating" 
            type="number" 
            min="1" 
            max="5" 
            step="0.1"
            value={formData.rating} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="pt-6 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate('/map')}>
          Annuler
        </Button>
        <Button type="submit">
          Ajouter la boutique
        </Button>
      </div>
      
      <div className="bg-secondary/50 p-4 rounded-lg mt-6">
        <h3 className="text-sm font-medium mb-2">Astuce:</h3>
        <p className="text-sm text-muted-foreground">
          Pour obtenir les coordonnées géographiques (latitude et longitude) d'une adresse, 
          vous pouvez utiliser Google Maps. Recherchez l'adresse, faites un clic droit sur le 
          point exact et sélectionnez "Obtenir l'itinéraire vers ce lieu". Les coordonnées 
          apparaîtront dans la barre d'adresse.
        </p>
      </div>
    </form>
  );
};

export default StoreForm;
