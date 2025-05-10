import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info, Loader2 } from "lucide-react";
import { ClassifiedCategory, ClassifiedType } from '@/types/classified';
import { useToast } from '@/components/ui/use-toast';
import { useClassifiedsUser } from '@/hooks/useClassifiedsUser';

import ClassifiedTypeSelector from './ClassifiedTypeSelector';
import CategorySelector from './CategorySelector';
import JobDetailsForm from './JobDetailsForm';
import JobSearchInfoBox from './JobSearchInfoBox';
import ImageUpload from './ImageUpload';

const ClassifiedForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    handleClassifiedSubmit, 
    isLoading, 
    images, 
    setImages, 
    handleImageUpload, 
    isUploading 
  } = useClassifiedsUser();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ClassifiedType | ''>('');
  const [category, setCategory] = useState<ClassifiedCategory | ''>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  
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
        isPremium: false,
        images,
        jobType: isJobOffer ? jobType : undefined,
        salary: isJobOffer ? salary : undefined,
        experience: isJobOffer ? experience : undefined,
        contractType: isJobOffer ? contractType : undefined,
        companyName: isJobOffer ? companyName : undefined,
        contactEmail: isJobOffer ? contactEmail : undefined
      });
    } catch (error) {
      console.error("Erreur lors de la publication de l'annonce:", error);
    }
  };

  // Modification du composant ImageUpload
  const handleFilesSelected = async (files: File[]) => {
    try {
      await handleImageUpload(files);
    } catch (error) {
      console.error("Erreur lors du téléchargement des images:", error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors du téléchargement des images.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ClassifiedTypeSelector type={type} setType={setType} />
      <CategorySelector category={category} setCategory={setCategory} />

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
      
      <JobDetailsForm 
        jobType={jobType}
        setJobType={setJobType}
        contractType={contractType}
        setContractType={setContractType}
        salary={salary}
        setSalary={setSalary}
        experience={experience}
        setExperience={setExperience}
        companyName={companyName}
        setCompanyName={setCompanyName}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        isJobOffer={isJobOffer}
      />
      
      <JobSearchInfoBox isJobSearch={isJobSearch} />
      
      <ImageUpload 
        images={images} 
        setImages={setImages} 
        onFilesSelected={handleFilesSelected}
        isUploading={isUploading}
      />
      
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
        <Button 
          type="submit" 
          className="gap-2" 
          disabled={isLoading || isUploading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publication en cours...
            </>
          ) : "Soumettre l'annonce"}
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
  );
};

export default ClassifiedForm;
