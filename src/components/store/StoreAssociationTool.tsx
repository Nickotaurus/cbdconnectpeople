
import { useState, useEffect } from 'react';
import { associateStoreWithUser } from '@/utils/storeUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface StoreAssociationToolProps {
  defaultEmail?: string;
  defaultStoreName?: string;
  onSuccess?: () => void;
}

const StoreAssociationTool = ({ 
  defaultEmail = "histoiredechanvre29@gmail.com",
  defaultStoreName = "CBD Histoire de Chanvre",
  onSuccess
}: StoreAssociationToolProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [storeName, setStoreName] = useState(defaultStoreName);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    storeId?: string;
  }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Nettoyer les données de session au démarrage pour éviter les conflits
  useEffect(() => {
    // Nettoyage des données stockées pour ce profil
    localStorage.removeItem('userStoreId');
    sessionStorage.removeItem('userStoreId');
    sessionStorage.removeItem('newlyAddedStore');
  }, []);
  
  // Vérifier si la boutique est déjà associée au démarrage
  useEffect(() => {
    const checkExistingAssociation = async () => {
      if (!email) return;
      
      try {
        // 1. Trouver l'ID utilisateur à partir de l'email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id, store_id, email')
          .eq('email', email)
          .single();

        if (userError) {
          console.error('Erreur lors de la recherche du profil:', userError);
          return;
        }

        if (userData?.store_id) {
          // L'utilisateur a déjà une boutique associée
          console.log("Boutique déjà associée:", userData.store_id);
          localStorage.setItem('userStoreId', userData.store_id);
          sessionStorage.setItem('userStoreId', userData.store_id);
          
          setResult({
            success: true,
            message: 'Boutique déjà associée à ce profil',
            storeId: userData.store_id
          });
          
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification d'association:", err);
      }
    };
    
    checkExistingAssociation();
  }, [email, onSuccess]);

  const handleAssociate = async () => {
    if (!email || !storeName) return;

    setProcessing(true);
    setResult({});

    try {
      // Forcer la suppression de toute association existante
      if (email === 'histoiredechanvre29@gmail.com') {
        // Récupérer l'ID utilisateur
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();
        
        if (userError) {
          console.error('Erreur lors de la récupération du profil:', userError);
          throw new Error('Profil non trouvé');
        }
        
        // Supprimer l'association store_id du profil
        await supabase
          .from('profiles')
          .update({ store_id: null })
          .eq('id', userData.id);
          
        // Nettoyer l'association côté boutique si elle existe
        const { data: storeData } = await supabase
          .from('stores')
          .select('id')
          .eq('name', 'ilike', `%${storeName}%`);
          
        if (storeData && storeData.length > 0) {
          await supabase
            .from('stores')
            .update({ user_id: null, claimed_by: null })
            .eq('id', storeData[0].id);
        }
        
        // Nettoyer le stockage local
        localStorage.removeItem('userStoreId');
        sessionStorage.removeItem('userStoreId');
      }
      
      // Créer une nouvelle association
      // FIX: Remove the third argument from the associateStoreWithUser call
      // The function only expects 2 arguments: email and storeName
      const response = await associateStoreWithUser(email, storeName);
      setResult(response);
      
      if (response.success && response.storeId) {
        // Afficher une notification de succès
        toast({
          title: "Association réussie",
          description: "Votre boutique a été associée avec succès à votre profil",
        });
        
        // Si l'association a réussi, recharger la page après 1.5 secondes
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate(`/store/${response.storeId}/admin`);
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Erreur lors de l'association:", error);
      setResult({
        success: false,
        message: "Une erreur inattendue s'est produite"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Association de boutique</CardTitle>
        <CardDescription>Associez votre boutique existante à votre profil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email du propriétaire</label>
          <Input 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="email@exemple.com"
            disabled={processing || result.success}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="storeName" className="text-sm font-medium">Nom de la boutique</label>
          <Input 
            id="storeName" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)} 
            placeholder="Nom de la boutique"
            disabled={processing || result.success}
          />
        </div>

        {result.message && (
          <Alert 
            variant="default" 
            className={
              result.success 
                ? "border-green-200 bg-green-50" 
                : "border-red-200 bg-red-50"
            }
          >
            {result.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={
              result.success ? "text-green-800" : "text-red-800"
            }>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAssociate} 
          disabled={processing || !email || !storeName || result.success}
          className="w-full"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Association en cours...
            </>
          ) : result.success ? (
            "Boutique associée"
          ) : (
            "Associer la boutique au profil"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreAssociationTool;
