
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, AlertCircle, Globe, Star, Clock, Phone, MapPin, Info, Globe2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewData } from '@/types/store-types';
import { Badge } from '@/components/ui/badge';

interface BusinessProfileProps {
  businessDetails: {
    name: string;
    address: string;
    phone?: string;
    website?: string;
    rating?: number;
    totalReviews?: number;
    photos?: string[];
    reviews?: ReviewData[];
    openingHours?: string[];
  } | null;
  isLoading: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const GoogleBusinessIntegration = ({
  businessDetails,
  isLoading,
  onAccept,
  onReject
}: BusinessProfileProps) => {
  const [activeTab, setActiveTab] = useState('info');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-background/40">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm text-muted-foreground">Recherche d'une fiche Google Business...</p>
        </div>
      </div>
    );
  }

  if (!businessDetails) {
    return (
      <Alert variant="default" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucune fiche entreprise trouvée</AlertTitle>
        <AlertDescription>
          Votre boutique n'a pas été trouvée sur Google Business. Vous pouvez continuer l'inscription normalement ou 
          créer une fiche Google Business plus tard pour améliorer votre visibilité.
        </AlertDescription>
      </Alert>
    );
  }

  const hasPhotos = businessDetails.photos && businessDetails.photos.length > 0;
  const hasReviews = businessDetails.reviews && businessDetails.reviews.length > 0;

  return (
    <Card className="border-green-200 bg-green-50 mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Globe className="mr-2 h-5 w-5 text-green-600" />
              Fiche Google Business trouvée
            </CardTitle>
            <CardDescription>
              Nous avons trouvé votre établissement sur Google. Voulez-vous importer ces informations ?
            </CardDescription>
          </div>
          {businessDetails.rating && (
            <div className="bg-white px-2 py-1 rounded-md flex items-center">
              <span className="text-amber-500 mr-1">★</span>
              <span className="font-medium">{businessDetails.rating}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ({businessDetails.totalReviews || 0} avis)
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <div className="px-6 py-2">
        <Alert variant="default" className="bg-green-100 border-green-200">
          <Info className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 text-sm font-medium">Avantage Google Business</AlertTitle>
          <AlertDescription className="text-xs text-green-700">
            En utilisant votre fiche Google Business, votre boutique sera mieux référencée et affichera vos photos, horaires et avis clients.
          </AlertDescription>
        </Alert>
      </div>
      
      <Tabs defaultValue="info" className="px-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="info">Infos</TabsTrigger>
          <TabsTrigger value="photos" disabled={!hasPhotos}>Photos</TabsTrigger>
          <TabsTrigger value="reviews" disabled={!hasReviews}>Avis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 pt-2">
          <div>
            <div className="flex items-center mb-1">
              <h4 className="font-semibold text-base">{businessDetails.name}</h4>
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">
                <Globe2 className="h-3 w-3 mr-1" />
                Fiche Google
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span>{businessDetails.address}</span>
            </div>
            
            {businessDetails.phone && (
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Phone className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                <span>{businessDetails.phone}</span>
              </div>
            )}
            
            {businessDetails.website && (
              <div className="text-sm text-blue-600 underline truncate mt-1">
                <a href={businessDetails.website} target="_blank" rel="noopener noreferrer">
                  {businessDetails.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            
            {businessDetails.openingHours && businessDetails.openingHours.length > 0 && (
              <div className="mt-3 border-t pt-2">
                <div className="flex items-center mb-1">
                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <h5 className="text-sm font-medium">Horaires d'ouverture</h5>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 ml-5">
                  {businessDetails.openingHours.map((day, index) => (
                    <div key={index}>{day}</div>
                  ))}
                </div>
              </div>
            )}
            
            {hasPhotos && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {businessDetails.photos.slice(0, 3).map((photo, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted">
                    <img 
                      src={photo} 
                      alt={`${businessDetails.name} ${index + 1}`} 
                      className="object-cover w-full h-full" 
                      onClick={() => {
                        setActivePhotoIndex(index);
                        setActiveTab('photos');
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-4 pt-2">
          {hasPhotos && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-3">
                <img 
                  src={businessDetails.photos[activePhotoIndex]} 
                  alt={`${businessDetails.name} - Photo principale`} 
                  className="object-cover w-full h-full" 
                />
              </div>
              
              <div className="flex overflow-x-auto pb-2 gap-2 snap-x">
                {businessDetails.photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden cursor-pointer snap-start ${
                      index === activePhotoIndex ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActivePhotoIndex(index)}
                  >
                    <img 
                      src={photo} 
                      alt={`${businessDetails.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4 pt-2">
          {hasReviews ? (
            <div className="space-y-3">
              {businessDetails.reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-md p-3 text-sm">
                  <div className="flex items-center mb-1">
                    {review.profile_photo_url ? (
                      <img 
                        src={review.profile_photo_url} 
                        alt={review.author_name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                        <span className="text-xs">{review.author_name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium">{review.author_name}</span>
                    <div className="ml-auto flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3.5 w-3.5 ${
                              i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {review.relative_time_description && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {review.relative_time_description}
                    </div>
                  )}
                  
                  <p className="text-muted-foreground text-xs">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Aucun avis disponible.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between pt-2 px-6 pb-4">
        <Button variant="outline" onClick={onReject}>
          Ignorer
        </Button>
        <Button onClick={onAccept} className="gap-1">
          <Check className="h-4 w-4" />
          Utiliser ces informations
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoogleBusinessIntegration;
