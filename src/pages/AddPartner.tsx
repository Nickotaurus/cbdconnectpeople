
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { PartnerCategory } from '@/types/auth';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Building, FileText, Link2 } from 'lucide-react';
import { partnerCategories } from '@/data/partnerCategoriesData';

const AddPartner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if we've come from registration
  const fromRegistration = location.state?.fromRegistration || false;
  const initialCategory = location.state?.partnerCategory || '';

  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    category: initialCategory || (user?.role === 'partner' ? (user as any).partnerCategory || '' : ''),
    address: '',
    city: '',
    postalCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pour l'instant, nous simulons juste le succès
    toast({
      title: "Profil créé avec succès",
      description: "Votre profil partenaire a été enregistré",
    });
    
    setTimeout(() => {
      navigate('/partners');
    }, 1500);
  };

  // If user is logged in but not a partner, show access denied
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

  // If not logged in at all, redirect to login
  if (!user && !fromRegistration) {
    useEffect(() => {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour référencer votre activité",
      });
      navigate('/login', { state: { redirectTo: '/add-partner' } });
    }, []);
    
    // Show loading state while redirecting
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
            <div className="grid gap-2">
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <div className="flex gap-2">
                <Building className="h-4 w-4 mt-3 text-muted-foreground" />
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="flex-1"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Secteur d'activité</Label>
              <div className="flex gap-2">
                <Briefcase className="h-4 w-4 mt-3 text-muted-foreground" />
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionnez votre secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {partnerCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description de votre activité</Label>
              <div className="flex gap-2">
                <FileText className="h-4 w-4 mt-3 text-muted-foreground" />
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex-1"
                  placeholder="Décrivez votre activité, vos services..."
                  rows={4}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">Site web</Label>
              <div className="flex gap-2">
                <Link2 className="h-4 w-4 mt-3 text-muted-foreground" />
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="flex-1"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Rue, numéro..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="ex: Paris"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="ex: 75001"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate('/partners')}>
              Annuler
            </Button>
            <Button type="submit">
              <Briefcase className="mr-2 h-4 w-4" />
              Créer mon profil
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddPartner;
