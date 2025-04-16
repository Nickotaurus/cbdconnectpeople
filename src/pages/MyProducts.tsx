
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductsProvider } from '@/contexts/ProductsContext';
import { ProductCategoryList } from '@/components/products/ProductCategoryList';
import { SavePreferencesFooter } from '@/components/products/SavePreferencesFooter';
import { ProductsHeader } from '@/components/products/ProductsHeader';

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if not a client user
  useEffect(() => {
    if (!user || user.role !== 'client') {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mes produits préférés</h1>
          <Button onClick={() => navigate('/')}>
            Retour au tableau de bord
          </Button>
        </div>
        
        <ProductsProvider>
          <Card className="mb-6">
            <ProductsHeader />
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Veuillez sélectionner au moins 3 produits qui vous intéressent. Nous vous tiendrons informé des offres et nouveautés concernant ces produits.
              </p>
              
              <ProductCategoryList />
            </CardContent>
          </Card>
          
          <SavePreferencesFooter />
        </ProductsProvider>
      </div>
    </div>
  );
};

export default MyProducts;
