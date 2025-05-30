
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { UserRole } from '@/types/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import RegisterForm from '@/components/register/RegisterForm';

const Register = () => {
  const location = useLocation();
  const [initialRole, setInitialRole] = useState<UserRole>('store');
  
  useEffect(() => {
    // Extract role from URL if present
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role') as UserRole | null;
    if (roleParam && ['store', 'producer', 'partner'].includes(roleParam)) {
      setInitialRole(roleParam);
    }
  }, [location]);
  
  return (
    <div className="container max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Créer votre compte</CardTitle>
          <CardDescription>
            Rejoignez la communauté CBD Connect People
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm initialRole={initialRole} />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Déjà inscrit? <Link to="/login" className="text-primary hover:underline">Connexion</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
