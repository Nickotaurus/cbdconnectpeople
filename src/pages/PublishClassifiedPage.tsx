import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Info, Briefcase, Building2, Mail } from "lucide-react";
import { ClassifiedCategory, ClassifiedType } from '@/types/classified';
import { useToast } from '@/components/ui/use-toast';
import { useClassifiedsUser } from '@/hooks/useClassifiedsUser';

const PublishClassifiedPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleClassifiedSubmit, isLoading } = useClassifiedsUser();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ClassifiedType | ''>('');
  const [category, setCategory] = useState<ClassifiedCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [premiumPhotos, setPremiumPhotos] = useState(false);
  
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [contractType, setContractType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  const [isJobOffer, setIsJobOffer] = useState(false);
  const [isJobSearch, setIsJobSearch] = useState(false);
  
  useEffect(() => {
    setIsJobOffer(type === 'service' && category === 'employer');
    setIsJobSearch(type === 'service' && category === 'employee');
  }, [type, category]);
  
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
  
  const contractTypes = [
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'interim', label: 'Intérim' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'apprentice', label: 'Apprentissage' },
    { value: 'internship', label: 'Stage' },
    { value: 'other', label: 'Autre' }
  ];
  
  const jobTypes = [
    { value: 'sales', label: 'Commercial / Vente' },
    { value: 'management', label: 'Direction / Management' },
    { value: 'production', label: 'Production' },
    { value: 'communication', label: 'Marketing / Communication' },
    { value: 'rd', label: 'R&D / Scientifique' },
    { value: 'delivery', label: 'Livraison / Logistique' },
    { value: 'admin', label: 'Administration' },
    { value: 'other', label: 'Autre' }
  ];
  
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
  
  const removeImage = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };
  
  const handlePremiumToggle = () => {
    setPremiumPhotos(!premiumPhotos);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || !category || !description || !location) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    if (isJobOffer && !jobType) {
      toast({
        title: "Information manquante",
        description: "Veuillez préciser le type de poste pour votre offre d'emploi.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await handleClassifiedSubmit({
        type,
        category,
        title,
        description,
        location,
        price,
        isPremium: premiumPhotos,
        images,
        jobType: isJobOffer ? jobType : undefined,
        salary: isJobOffer ? salary : undefined,
        experience: isJobOffer ? experience : undefined,
        contractType: isJobOffer ? contractType : undefined,
        companyName: isJobOffer ? companyName : undefined,
        contactEmail: isJobOffer ? contactEmail : undefined
      });
      
      navigate('/classifieds');
    } catch (error) {
      console.error("Erreur lors de la publication de l'annonce:", error);
    }
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
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              {isJobOffer ? "Titre du poste*" : isJobSearch ? "Titre de votre recherche d'emploi*" : "Titre de l'annonce*"}
            </Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder={isJobOffer ? "Ex: Vendeur(se) expérimenté(e) CBD" : isJobSearch ? "Ex: Cherche poste de conseiller CBD" : "Ex: Cession de boutique CBD Paris 3ème"} 
              maxLength={100}
            />
          </div>
          
          {!isJobOffer && !isJobSearch && (
            <div className="space-y-2">
              <Label htmlFor="price" className="text-base">Prix (optionnel)</Label>
              <Input 
                id="price" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Ex: 85 000 €"
              />
            </div>
          )}
          
          {isJobOffer && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <Briefcase className="text-primary h-5 w-5" />
                <h3 className="font-medium">Détails de l'offre d'emploi</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobType" className="text-sm">Type de poste*</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de poste" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((job) => (
                        <SelectItem key={job.value} value={job.value}>{job.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contractType" className="text-sm">Type de contrat</Label>
                  <Select value={contractType} onValueChange={setContractType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de contrat" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((contract) => (
                        <SelectItem key={contract.value} value={contract.value}>{contract.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm">Expérience requise</Label>
                    <Input
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Ex: 2 ans minimum"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-sm">Salaire proposé</Label>
                    <Input
                      id="salary"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="Ex: 30-35K€ selon expérience"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm">Nom de l'entreprise</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Votre entreprise"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="text-sm">Email de contact</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contact@entreprise.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isJobSearch && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <Briefcase className="text-primary h-5 w-5" />
                <h3 className="font-medium">Détails de votre recherche d'emploi</h3>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Décrivez votre profil, votre expérience, et le type de poste recherché dans le champ "Description" ci-dessous.
                N'hésitez pas à mentionner vos compétences, formations, et disponibilités.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Label className="text-base">Photos ({premiumPhotos ? '0-20' : '0-3'})</Label>
            
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
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              {isJobOffer ? "Description du poste*" : isJobSearch ? "Description de votre profil et attentes*" : "Description*"}
            </Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder={
                isJobOffer ? "Décrivez le poste, les missions, et les compétences recherchées..." :
                isJobSearch ? "Décrivez votre profil, votre expérience, et le type de poste recherché..." :
                "Décrivez votre annonce en détail..."
              } 
              rows={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base">Localisation*</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Ex: Paris, France"
            />
          </div>
          
          <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Note sur la modération</p>
              <p>Votre annonce sera examinée par notre équipe avant d'être publiée. Ce processus peut prendre jusqu'à 24h ouvrées.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="gap-2" disabled={isLoading}>
              {isLoading ? "Publication en cours..." : "Soumettre l'annonce"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/classifieds')}
              disabled={isLoading}
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
