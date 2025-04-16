
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerUser } from "@/types/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Get redirect path from location state if it exists
  const redirectTo = location.state?.redirectTo || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      console.log("Login form submitted for:", email);
      const user = await login(email, password);
      console.log("Login successful, user data:", user);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      // Redirect based on user role or redirectTo path
      if (user?.role === 'partner') {
        const partnerUser = user as PartnerUser;
        console.log("Partner login detected with partnerId:", partnerUser.partnerId, "and category:", partnerUser.partnerCategory);
        
        // Force a longer delay to ensure state is properly saved
        setTimeout(() => {
          if (partnerUser.partnerId === null) {
            console.log("Partner has no partnerId, redirecting to add-partner");
            navigate('/add-partner', {
              state: { 
                fromRegistration: false,
                partnerCategory: partnerUser.partnerCategory || ''
              }
            });
          } else {
            console.log("Partner has partnerId, redirecting to partner profile");
            navigate('/partner/profile');
          }
        }, 1500);
      } else if (user?.role === 'store') {
        setTimeout(() => {
          navigate('/store-dashboard');
        }, 1000);
      } else {
        setTimeout(() => {
          navigate(redirectTo);
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Accédez à votre compte CBD Connect People
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
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
                />
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Pas encore de compte? <a href="/register" className="text-primary hover:underline">S'inscrire</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
