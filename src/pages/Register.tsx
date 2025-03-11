
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserRole } from '@/types/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from '@/components/register/RegisterForm';

const Register = () => {
  const location = useLocation();
  const [initialRole, setInitialRole] = useState<UserRole>('client');
  
  useEffect(() => {
    // Extract role from URL if present
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role') as UserRole | null;
    if (roleParam && ['client', 'store', 'producer', 'partner'].includes(roleParam)) {
      setInitialRole(roleParam);
    }
  }, [location]);
  
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
          <RegisterForm initialRole={initialRole} />
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
