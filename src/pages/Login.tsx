
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  const { login, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Get redirect path from location state if it exists
  const redirectTo = location.state?.redirectTo || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectionAttempted, setRedirectionAttempted] = useState(false);
  
  console.log("Login component - Current state:", { 
    userExists: !!user, 
    authLoading, 
    isLoading, 
    redirectionAttempted 
  });
  
  // Reset loading state when component unmounts or route changes
  useEffect(() => {
    return () => {
      setIsLoading(false);
      setRedirectionAttempted(false);
    };
  }, []);
  
  // Effect to handle redirect after successful login
  useEffect(() => {
    console.log("Login useEffect - user:", user, "authLoading:", authLoading, "isLoading:", isLoading, "redirectionAttempted:", redirectionAttempted);
    
    if (user && !authLoading && !redirectionAttempted) {
      console.log("User authenticated, attempting redirection based on role:", user.role);
      setRedirectionAttempted(true);
      setIsLoading(false); // Reset loading state before navigation
      
      // Redirection immédiate sans délai
      if (user.role === 'partner') {
        const partnerUser = user as PartnerUser;
        console.log("Partner login detected with partnerId:", partnerUser.partnerId, "and category:", partnerUser.partnerCategory);
        
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
      } else if (user.role === 'store') {
        console.log("Store user detected, redirecting to store dashboard");
        navigate('/store-dashboard');
      } else {
        console.log("Client user detected, redirecting to:", redirectTo);
        navigate(redirectTo);
      }
    } else if (!user && !authLoading) {
      // Ensure loading state is reset when auth is finished and no user
      setIsLoading(false);
    }
  }, [user, authLoading, navigate, redirectTo, redirectionAttempted]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only proceed if not already loading
    if (isLoading || authLoading) return;
    
    setIsLoading(true);
    try {
      console.log("Login form submitted for:", email);
      await login(email, password);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      // No manual navigation here - let the useEffect handle it based on user role
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      setIsLoading(false); // Reset loading state on error
    }
  };
  
  // If already authenticated, we can show a loading state
  if (user && !authLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirection en cours...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Rôle détecté: {user.role}
          </p>
        </div>
      </div>
    );
  }
  
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
              
              <Button type="submit" disabled={isLoading || authLoading}>
                {(isLoading || authLoading) ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Pas encore de compte? <Link to="/register" className="text-primary hover:underline">S'inscrire</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
