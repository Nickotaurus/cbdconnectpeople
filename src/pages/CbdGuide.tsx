
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { guideContent } from '@/utils/data';
import AiRecommendations from '@/components/AiRecommendations';
import { Shield, Building, MapPin, Calculator, Flask, Tag, Package, Signpost, Sprout, Book, Coins } from 'lucide-react';

const CbdGuide = () => {
  const [selectedTab, setSelectedTab] = useState('client');
  const [showAiRecommendations, setShowAiRecommendations] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleAiRecommendationsToggle = () => {
    setShowAiRecommendations(!showAiRecommendations);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar pour la navigation */}
        <div className="md:w-1/4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium mb-3">Guide par profil</h3>
              <Tabs 
                value={selectedTab} 
                onValueChange={setSelectedTab} 
                className="w-full" 
                orientation="vertical"
              >
                <TabsList className="flex flex-col h-auto items-stretch">
                  <TabsTrigger value="client" className="justify-start">
                    Guide Client
                  </TabsTrigger>
                  <TabsTrigger value="producer" className="justify-start">
                    Guide Producteur
                  </TabsTrigger>
                  <TabsTrigger value="store" className="justify-start">
                    Guide Boutique
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
              <h3 className="font-medium mb-2">IA Recommandations</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Obtenez des recommandations personnalisées basées sur vos besoins spécifiques.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleAiRecommendationsToggle}
              >
                {showAiRecommendations ? "Masquer l'IA" : "Consulter l'IA"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="md:w-3/4">
          {showAiRecommendations ? (
            <AiRecommendations />
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">Guide du CBD</h1>
              
              <TabsContent value="client" className={selectedTab === 'client' ? 'block' : 'hidden'}>
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    {guideContent.map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{item.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="producer" className={selectedTab === 'producer' ? 'block' : 'hidden'}>
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold border-b pb-2">Guide pour les producteurs</h2>
                  
                  {/* Se Lancer */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Sprout className="h-6 w-6 mr-2 text-primary" />
                      <h3 className="text-xl font-medium">Se Lancer</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Réglementation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Comprendre la législation française et européenne concernant la culture du cannabis à faible teneur en THC (moins de 0,3%).</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Financement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Options de financement adaptées aux cultivateurs de CBD et stratégies pour convaincre les investisseurs.</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Choix des graines</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Sélection des variétés de cannabis inscrites au catalogue européen et adaptées à la production de CBD.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Cultiver */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Book className="h-6 w-6 mr-2 text-primary" />
                      <h3 className="text-xl font-medium">Cultiver</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Techniques de culture</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Méthodes de culture optimales pour maximiser la teneur en CBD tout en maintenant la teneur en THC sous les seuils légaux.</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Certifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Processus d'obtention des certifications bio et autres labels de qualité pour valoriser votre production.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Commercialiser */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Coins className="h-6 w-6 mr-2 text-primary" />
                      <h3 className="text-xl font-medium">Commercialiser</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Stratégies de vente</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Établir votre proposition de valeur unique et développer des relations commerciales durables avec les boutiques.</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Chaînes de distribution optimales et méthodes pour connecter directement avec les boutiques CBD.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <Button onClick={() => navigate('/partners')}>
                      Consulter l'annuaire des partenaires
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="store" className={selectedTab === 'store' ? 'block' : 'hidden'}>
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold border-b pb-2">Guide pour les boutiques</h2>
                  
                  {/* Ouvrir sa boutique */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Building className="h-6 w-6 mr-2 text-primary" />
                      <h3 className="text-xl font-medium">Ouvrir sa boutique</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Business plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Comment créer un business plan solide pour votre boutique CBD et estimer votre rentabilité.</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Démarches administratives</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Les étapes administratives à suivre pour créer légalement une boutique CBD en France.</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Approvisionnement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Comment identifier et sélectionner des fournisseurs fiables pour votre boutique.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Trouver un partenaire */}
                  <div>
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-medium">Trouver un partenaire</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <Shield className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Assurance spécialisée CBD</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Trouver une assurance adaptée à votre activité CBD et comprendre les garanties spécifiques.</p>
                          <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => navigate('/partners?category=insurance')}>
                            Voir les assurances
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <Building className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Banque acceptant le CBD</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Comment trouver une banque qui accompagne les entreprises du secteur CBD.</p>
                          <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => navigate('/partners?category=bank')}>
                            Voir les banques
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Local commercial</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Où et comment trouver le local idéal pour ouvrir une boutique CBD.</p>
                          <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => navigate('/partners?category=realEstate')}>
                            Voir les agences
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <Calculator className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Comptable expert en CBD</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">L'importance d'un comptable qui connaît les spécificités fiscales du secteur CBD.</p>
                          <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => navigate('/partners?category=accountant')}>
                            Voir les comptables
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <Flask className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Créer sa marque blanche</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Comment développer votre propre marque de produits CBD avec des fabricants partenaires.</p>
                          <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => navigate('/partners?category=laboratory')}>
                            Voir les fabricants
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <Tag className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Créer ses étiquettes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Les règles d'étiquetage des produits CBD et où trouver des designers spécialisés.</p>
                          <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => navigate('/partners?category=media')}>
                            Voir les designers
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Emballages adaptés</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Trouver des fournisseurs d'emballages adaptés aux produits CBD et respectant la réglementation.</p>
                          <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => navigate('/partners?category=logistics')}>
                            Voir les fournisseurs
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <Signpost className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Poser une enseigne</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Les démarches administratives pour installer une enseigne de boutique CBD.</p>
                          <Button className="mt-4 w-full" variant="outline" size="sm" onClick={() => navigate('/partners?category=legal')}>
                            Voir les experts
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Gérer sa boutique */}
                  <div>
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-medium">Gérer sa boutique</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Marketing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Stratégies de marketing adaptées au secteur du CBD, dans le respect des contraintes légales.</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Gestion des stocks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Comment optimiser votre approvisionnement et gérer efficacement vos stocks de produits CBD.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Revendre sa boutique */}
                  <div>
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-medium">Revendre sa boutique</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Valorisation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Comment évaluer la valeur de votre boutique CBD pour une revente optimale.</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Transmission</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Les étapes juridiques et administratives pour céder votre commerce de CBD.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <Button onClick={() => navigate('/partners')}>
                      Consulter l'annuaire des partenaires
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CbdGuide;
