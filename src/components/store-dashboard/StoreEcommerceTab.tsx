
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EcommerceField from '@/components/store-form/EcommerceField';
import LogoUpload from './LogoUpload';

interface StoreEcommerceTabProps {
  ecommerceData: {
    isEcommerce: boolean;
    ecommerceUrl: string;
  };
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onLogoUpload: (file: File) => Promise<string | null>;
  uploadingLogo: boolean;
  currentLogoUrl?: string | null;
}

const StoreEcommerceTab = ({ 
  ecommerceData, 
  isSubmitting, 
  onChange, 
  onSubmit,
  onLogoUpload,
  uploadingLogo,
  currentLogoUrl
}: StoreEcommerceTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion E-commerce</CardTitle>
        <CardDescription>
          Configurez votre boutique pour qu'elle apparaisse dans la section E-commerce
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            En activant cette option, votre boutique sera également visible dans la section "E-commerce CBD" 
            de notre plateforme. Cela vous permettra d'atteindre davantage de clients potentiels qui 
            recherchent spécifiquement des boutiques en ligne.
          </p>
          
          <EcommerceField 
            isEcommerce={ecommerceData.isEcommerce}
            ecommerceUrl={ecommerceData.ecommerceUrl}
            onChange={onChange}
          />
          
          {ecommerceData.isEcommerce && !ecommerceData.ecommerceUrl && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md">
              <p className="text-sm">
                <strong>Attention:</strong> Vous n'avez pas indiqué d'URL pour votre boutique en ligne. 
                Si vous avez un site web dédié à l'e-commerce, indiquez-le ici, sinon votre site web 
                principal sera utilisé.
              </p>
            </div>
          )}

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Logo de votre boutique</h3>
            <p className="text-sm text-muted-foreground">
              Ce logo sera affiché sur la page E-commerce pour représenter votre boutique.
              Choisissez une image claire et de bonne qualité pour attirer l'attention des clients.
            </p>
            
            <LogoUpload 
              onUpload={onLogoUpload}
              isUploading={uploadingLogo}
              currentLogoUrl={currentLogoUrl}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="default"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreEcommerceTab;
