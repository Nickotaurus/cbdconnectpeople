import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, PartnerCategory } from '@/types/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ClientRegistrationInfo from './ClientRegistrationInfo';
import StoreRegistrationInfo from './StoreRegistrationInfo';
import PartnerRegistrationInfo from './PartnerRegistrationInfo';

interface RegisterFormProps {
  initialRole: UserRole;
}

const RegisterForm = ({ initialRole }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [partnerCategory, setPartnerCategory] = useState<PartnerCategory | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  return (
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
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="client">Client</TabsTrigger>
              <TabsTrigger value="store">Boutique</TabsTrigger>
              <TabsTrigger value="partner">Partenaire</TabsTrigger>
            </TabsList>
            
            <ClientRegistrationInfo />
            <StoreRegistrationInfo />
            <PartnerRegistrationInfo
              partnerCategory={partnerCategory}
              setPartnerCategory={setPartnerCategory}
            />
          </Tabs>
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Création du compte..." : "S'inscrire"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
