
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, ShoppingCart, Upload, Loader2 } from "lucide-react";
import LogoUpload from '@/components/store-dashboard/LogoUpload';

interface StoreEcommerceTabProps {
  ecommerceData: {
    isEcommerce: boolean;
    ecommerceUrl: string;
  };
  isSubmitting: boolean;
  uploadingLogo: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
  onLogoUpload: (file: File) => Promise<string | null>;
  currentLogoUrl?: string;
  isStoreOwner?: boolean;
}

const StoreEcommerceTab = ({
  ecommerceData,
  isSubmitting,
  uploadingLogo,
  onChange,
  onSubmit,
  onLogoUpload,
  currentLogoUrl,
  isStoreOwner = false
}: StoreEcommerceTabProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStoreOwner) return;
    onSubmit();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>E-commerce</CardTitle>
          <CardDescription>
            Indiquez si votre boutique dispose d'une activité de vente en ligne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="isEcommerce"
                name="isEcommerce"
                checked={ecommerceData.isEcommerce}
                onCheckedChange={(checked) => 
                  onChange({
                    target: { 
                      name: 'isEcommerce', 
                      type: 'checkbox',
                      checked 
                    }
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                disabled={!isStoreOwner || isSubmitting}
              />
              <Label htmlFor="isEcommerce" className="font-medium">
                Cette boutique propose de l'e-commerce
              </Label>
            </div>
            
            {ecommerceData.isEcommerce && (
              <div className="space-y-2">
                <Label htmlFor="ecommerceUrl">URL de votre site e-commerce</Label>
                <div className="flex gap-2 items-center">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ecommerceUrl"
                    name="ecommerceUrl"
                    value={ecommerceData.ecommerceUrl}
                    onChange={onChange}
                    placeholder="https://www.votre-boutique.com"
                    className="flex-1"
                    disabled={!isStoreOwner || isSubmitting}
                  />
                </div>
              </div>
            )}
            
            {isStoreOwner && (
              <Button 
                type="submit" 
                className="w-full sm:w-auto" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Enregistrer les paramètres e-commerce
                  </>
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Logo de la boutique</CardTitle>
          <CardDescription>
            Téléchargez un logo pour votre boutique (format recommandé: carré, 512x512px)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogoUpload 
            onUpload={onLogoUpload} 
            isUploading={uploadingLogo} 
            currentLogoUrl={currentLogoUrl}
            disabled={!isStoreOwner}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreEcommerceTab;
