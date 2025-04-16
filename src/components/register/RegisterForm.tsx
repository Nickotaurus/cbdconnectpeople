
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, PartnerCategory, StoreType } from '@/types/auth';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import BasicFields from './BasicFields';
import PasswordFields from './PasswordFields';
import RoleSelector from './RoleSelector';

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
  const [storeType, setStoreType] = useState<StoreType>('physical');
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
      await register(
        email, 
        password, 
        name, 
        role, 
        role === 'store' 
          ? { storeType } 
          : role === 'partner' 
            ? { partnerCategory: partnerCategory as PartnerCategory } 
            : undefined
      );
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      if (role === 'store') {
        navigate('/add-store', { 
          state: { 
            fromRegistration: true,
            storeType: storeType,
            requiresSubscription: storeType === 'ecommerce' || storeType === 'both'
          }
        });
      } else if (role === 'partner') {
        navigate('/add-partner', {
          state: {
            fromRegistration: true,
            partnerCategory: partnerCategory
          }
        });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to handle partner category changes with proper typing
  const handlePartnerCategoryChange = (category: string) => {
    setPartnerCategory(category as PartnerCategory | '');
  };
  
  return (
    <form onSubmit={handleRegister}>
      <div className="grid gap-6">
        <BasicFields
          name={name}
          email={email}
          setName={setName}
          setEmail={setEmail}
        />
        
        <PasswordFields
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
        />
        
        <RoleSelector
          role={role}
          storeType={storeType}
          partnerCategory={partnerCategory}
          setRole={setRole}
          setStoreType={setStoreType}
          setPartnerCategory={handlePartnerCategoryChange}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Création du compte..." : "S'inscrire"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
