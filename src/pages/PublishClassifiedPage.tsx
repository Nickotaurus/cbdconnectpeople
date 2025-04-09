
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Info } from "lucide-react";
import { ClassifiedCategory, ClassifiedType } from '@/types/classified';
import { useToast } from '@/components/ui/use-toast';

const PublishClassifiedPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ClassifiedType | ''>('');
  const [category, setCategory] = useState<ClassifiedCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [premiumPhotos, setPremiumPhotos] = useState(false);
  
  // Catégories basées sur les catégories de partenaires + 'autres'
  const categories = [
    { value: 'store', label: 'Boutique CBD' },
    { value: 'ecommerce', label: 'E-commerce CBD' },
    { value: 'realestate', label: 'Immobilier CBD' },
    { value: 'employer', label: 'Employeur CBD' },
    { value: 'employee', label: 'Employé CBD' },
    { value: 'bank', label: 'Banque' },
    { value: 'accountant', label: 'Comptable' },
    { value: 'legal', label: 'Juriste' },
    { value: 'insurance', label: 'Assurance' },
    { value: 'logistics', label: 'Logistique' },
    { value: 'breeder', label: 'Breeder' },
    { value: 'label', label: 'Label' },
    { value: 'association', label: 'Association' },
    { value: 'media', label: 'Média' },
    { value: 'laboratory', label: 'Laboratoire' },
    { value: 'production', label: 'Production' },
    { value: 'realEstate', label: 'Agence immobilière' },
    { value: 'other', label: 'Autre' }
  ];
  
  // Gérer l'ajout d'images (max 3 images gratuites ou 20 avec l'option premium)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const maxImages = premiumPhotos ? 20 : 3;
      
      if (images.length + fileList.length > maxImages) {
        toast({
          title: "Limite de photos atteinte",
          description: premiumPhotos 
            ? "Vous ne pouvez pas dépasser 20 photos au total." 
            : "Vous ne pouvez pas ajouter plus de 3 photos. Achetez l'option premium pour ajouter jusqu'à 20 photos.",
          variant: "destructive"
        });
        return;
      }
      
      setImages(prevImages => [...prevImages, ...fileList]);
    }
  };
  
  // Supprimer une image
  const removeImage = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };
  
  // Activer l'option premium photos
  const handlePremiumToggle = () => {
    setPremiumPhotos(!premiumPhotos);
  };
  
  // Soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || !category || !description || !location) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    // Ici on enverrait normalement les données à l'API
    toast({
      title: "Annonce soumise avec succès",
      description: "Votre annonce est en attente de validation par un administrateur.",
    });
    
    navigate('/classifieds');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Publier une annonce</h1>
          <p className="text-muted-foreground">
            Remplissez le formulaire ci-dessous pour soumettre votre annonce. Elle sera publiée après validation par nos équipes.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type d'annonce */}
          <div className="space-y-2">
            <Label className="text-base">Type d'annonce*</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as ClassifiedType)} className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sell" id="sell" />
                <Label htmlFor="sell" className="font-normal">Offre (vous vendez)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buy" id="buy" />
                <Label htmlFor="buy" className="font-normal">Demande (vous achetez)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service" className="font-normal">Service</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Titre de l'annonce*</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: Cession de boutique CBD Paris 3ème" 
              maxLength={100}
            />
          </div>
          
          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base">Catégorie*</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ClassifiedCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Prix (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-base">Prix (optionnel)</Label>
            <Input 
              id="price" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="Ex: 85 000 €"
            />
          </div>
          
          {/* Images */}
          <div className="space-y-3">
            <Label className="text-base">Photos ({premiumPhotos ? '0-20' : '0-3'})</Label>
            
            {/* Option premium */}
            <div className="bg-secondary/30 rounded-lg p-4 mb-2">
              <div className="flex items-start gap-2">
                <Checkbox 
                  id="premium-photos" 
                  checked={premiumPhotos}
                  onCheckedChange={handlePremiumToggle}
                />
                <div>
                  <Label htmlFor="premium-photos" className="font-medium">
                    Option Premium Photos (4,90€)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez jusqu'à 20 photos au lieu de 3 et augmentez la visibilité de votre annonce.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Liste des images téléchargées */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-80 hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Bouton d'upload */}
            <div className="flex justify-center">
              <Label 
                htmlFor="image-upload" 
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/20 ${
                  images.length >= (premiumPhotos ? 20 : 3) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="mb-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Cliquez pour ajouter des photos</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (max. 5MB)</p>
                </div>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageUpload}
                  multiple
                  disabled={images.length >= (premiumPhotos ? 20 : 3)}
                />
              </Label>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description*</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Décrivez votre annonce en détail..." 
              rows={6}
            />
          </div>
          
          {/* Localisation */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base">Localisation*</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Ex: Paris, France"
            />
          </div>
          
          {/* Note sur la modération */}
          <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Note sur la modération</p>
              <p>Votre annonce sera examinée par notre équipe avant d'être publiée. Ce processus peut prendre jusqu'à 24h ouvrées.</p>
            </div>
          </div>
          
          {/* Boutons de soumission */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="gap-2">
              Soumettre l'annonce
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/classifieds')}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishClassifiedPage;
