import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import LogoUpload from '@/components/partners/LogoUpload';
import PartnerBasicFields from '@/components/partners/PartnerBasicFields';
import PartnerAddressFields from '@/components/partners/PartnerAddressFields';
import PartnerCategorySelect from '@/components/partners/PartnerCategorySelect';
import PartnerDescriptionField from '@/components/partners/PartnerDescriptionField';

const AddPartner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fromRegistration = location.state?.fromRegistration || false;
  const initialCategory = location.state?.partnerCategory || '';

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    category: initialCategory || (user?.role === 'partner' ? (user as any).partnerCategory || '' : ''),
    address: '',
    city: '',
    postalCode: '',
    logoUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (url: string) => {
    console.log("Logo uploaded, setting URL:", url);
    setFormData(prev => ({ ...prev, logoUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      console.log("Creating partner profile with data:", formData);
      const partnerId = crypto.randomUUID();

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.companyName,
          partner_category: formData.category,
          logo_url: formData.logoUrl,
          partner_id: partnerId,
          certifications: [],
          partner_favorites: [
            formData.email,
            formData.phone,
            formData.address,
            formData.city,
            formData.postalCode,
            formData.website,
            formData.description
          ]
        })
        .eq('id', user?.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      console.log("Partner profile created successfully");
      toast({
        title: "Profil créé avec succès",
        description: "Votre profil partenaire a été enregistré",
      });

      setTimeout(() => {
        navigate('/partner/profile');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre profil",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && user?.role !== 'partner') {
    return (
      <div className="container max-w-md mx-auto py-16">
        <Card>
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
            <CardDescription>
              Cette page est réservée aux partenaires CBD Connect People
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Vous devez être enregistré en tant que partenaire pour accéder à cette page.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/register?role=partner">S'inscrire en tant que partenaire</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!user && !fromRegistration) {
    useEffect(() => {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour référencer votre activité",
      });
      navigate('/login', { state: { redirectTo: '/add-partner' } });
    }, []);
    
    return (
      <div className="container max-w-md mx-auto py-16 flex justify-center">
        <p>Redirection vers la page de connexion...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Référencer votre activité</h1>
      <p className="text-muted-foreground mb-8">
        Complétez votre profil pour être visible auprès de la communauté CBD
      </p>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'entreprise</CardTitle>
            <CardDescription>
              Ces informations seront affichées sur votre profil public
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LogoUpload onUploadComplete={handleLogoUpload} />
            
            <PartnerBasicFields
              companyName={formData.companyName}
              website={formData.website}
              email={formData.email}
              phone={formData.phone}
              handleChange={handleInputChange}
            />
            
            <PartnerCategorySelect
              category={formData.category}
              handleSelectChange={handleSelectChange}
              required
            />
            
            <PartnerDescriptionField
              description={formData.description}
              handleChange={handleInputChange}
            />
            
            <PartnerAddressFields
              address={formData.address}
              city={formData.city}
              postalCode={formData.postalCode}
              handleChange={handleInputChange}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/partners')}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Créer mon profil
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddPartner;
