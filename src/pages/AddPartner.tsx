
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Loader2 } from 'lucide-react';
import LogoUpload from '@/components/partners/LogoUpload';
import PartnerBasicFields from '@/components/partners/PartnerBasicFields';
import PartnerAddressFields from '@/components/partners/PartnerAddressFields';
import PartnerCategorySelect from '@/components/partners/PartnerCategorySelect';
import PartnerDescriptionField from '@/components/partners/PartnerDescriptionField';
import UnauthorizedAccess from '@/components/partners/UnauthorizedAccess';
import LoadingRedirect from '@/components/partners/LoadingRedirect';
import { usePartnerForm } from '@/hooks/usePartnerForm';

const AddPartner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fromRegistration = location.state?.fromRegistration || false;
  const initialCategory = location.state?.partnerCategory || '';
  const isEditing = location.state?.isEditing || false;

  const {
    formData,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleLogoUpload,
    handleSubmit
  } = usePartnerForm(
    initialCategory || (user?.role === 'partner' ? (user as any).partnerCategory || '' : ''),
    user?.id || '',
    isEditing
  );

  // Handle unauthorized user
  if (user && user?.role !== 'partner') {
    return <UnauthorizedAccess />;
  }

  // Handle not logged in user
  if (!user && !fromRegistration) {
    useEffect(() => {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour référencer votre activité",
      });
    }, []);
    
    return <LoadingRedirect />;
  }

  // Show loading state when fetching partner data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">
        {isEditing ? 'Modifier votre profil' : 'Référencer votre activité'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {isEditing 
          ? 'Mettez à jour les informations de votre profil partenaire'
          : 'Complétez votre profil pour être visible auprès de la communauté CBD'
        }
      </p>

      <form onSubmit={(e) => handleSubmit(e, user?.id!)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'entreprise</CardTitle>
            <CardDescription>
              Ces informations seront affichées sur votre profil public
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LogoUpload onUploadComplete={handleLogoUpload} logoUrl={formData.logoUrl} />
            
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
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate('/partners')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
                </>
              ) : (
                <>
                  <Briefcase className="mr-2 h-4 w-4" />
                  {isEditing ? 'Mettre à jour mon profil' : 'Créer mon profil'}
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
