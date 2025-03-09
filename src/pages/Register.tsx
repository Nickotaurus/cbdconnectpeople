
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, PartnerCategory } from '@/types/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [partnerCategory, setPartnerCategory] = useState<PartnerCategory | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Extract role from URL if present
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role') as UserRole | null;
    if (roleParam && ['client', 'store', 'producer', 'partner'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [location]);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    if (role === 'partner' && !partnerCategory) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie de partenaire",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Pour cette démo, nous allons simplement passer les informations supplémentaires
      // Dans une vraie application, ces données seraient traitées côté serveur
      await register(email, password, name, role);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const partnerCategories = [
    { value: "bank", label: "Banque" },
    { value: "accountant", label: "Comptable" },
    { value: "legal", label: "Juriste" },
    { value: "insurance", label: "Assurance" },
    { value: "logistics", label: "Logistique" },
    { value: "breeder", label: "Breeder" },
    { value: "label", label: "Label" },
    { value: "association", label: "Association" },
    { value: "media", label: "Média" },
    { value: "laboratory", label: "Laboratoire" },
    { value: "production", label: "Production" },
    { value: "realEstate", label: "Agence immobilière" }
  ];
  
  return (
    <div className="container max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Créer votre compte</CardTitle>
          <CardDescription>
            Rejoignez la plus grande communauté CBD en France
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Type de compte</Label>
                <Tabs defaultValue={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="client">Client</TabsTrigger>
                    <TabsTrigger value="store">Boutique</TabsTrigger>
                    <TabsTrigger value="producer">Producteur</TabsTrigger>
                    <TabsTrigger value="partner">Partenaire</TabsTrigger>
                  </TabsList>
                  <TabsContent value="client" className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Trouvez les meilleures boutiques de CBD près de chez vous et accédez aux coupons exclusifs.
                    </p>
                  </TabsContent>
                  <TabsContent value="store" className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Référencez votre boutique CBD, gérez votre présence en ligne et connectez-vous avec des producteurs.
                    </p>
                  </TabsContent>
                  <TabsContent value="producer" className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Présentez vos produits et connectez-vous directement avec les boutiques CBD en France.
                    </p>
                  </TabsContent>
                  <TabsContent value="partner" className="mt-2">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Proposez vos services spécialisés aux professionnels du CBD et développez votre activité.
                      </p>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="partnerCategory">Catégorie de partenaire</Label>
                        <Select 
                          value={partnerCategory} 
                          onValueChange={(value) => setPartnerCategory(value as PartnerCategory)}
                        >
                          <SelectTrigger id="partnerCategory">
                            <SelectValue placeholder="Sélectionnez votre activité" />
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
                  </TabsContent>
                </Tabs>
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création du compte..." : "S'inscrire"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Déjà inscrit? <a href="/login" className="text-primary hover:underline">Connexion</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
