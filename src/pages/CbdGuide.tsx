
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import AiRecommendations from '@/components/AiRecommendations';
import { 
  Leaf, 
  Pill, 
  BookOpen, 
  Scale, 
  History, 
  HelpCircle, 
  BrainCircuit 
} from 'lucide-react';

const CbdGuide = () => {
  const [activeTab, setActiveTab] = useState("what-is-cbd");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Guide complet du CBD</h1>
        <p className="text-muted-foreground mb-6">
          Découvrez tout ce que vous devez savoir sur le cannabidiol (CBD), ses bienfaits, son cadre légal et comment le consommer.
        </p>
        
        <div className="grid lg:grid-cols-[3fr_1fr] gap-6">
          <div>
            <Tabs 
              defaultValue="what-is-cbd" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 mb-6">
                <TabsTrigger value="what-is-cbd" className="flex flex-col gap-1 h-auto py-2">
                  <Leaf className="h-4 w-4" />
                  <span className="text-xs">Qu'est-ce que le CBD</span>
                </TabsTrigger>
                <TabsTrigger value="benefits" className="flex flex-col gap-1 h-auto py-2">
                  <Pill className="h-4 w-4" />
                  <span className="text-xs">Bienfaits</span>
                </TabsTrigger>
                <TabsTrigger value="consumption" className="flex flex-col gap-1 h-auto py-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">Consommation</span>
                </TabsTrigger>
                <TabsTrigger value="legality" className="flex flex-col gap-1 h-auto py-2">
                  <Scale className="h-4 w-4" />
                  <span className="text-xs">Légalité</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex flex-col gap-1 h-auto py-2">
                  <History className="h-4 w-4" />
                  <span className="text-xs">Histoire</span>
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex flex-col gap-1 h-auto py-2">
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-xs">FAQ</span>
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[60vh] rounded-md border p-6">
                <TabsContent value="what-is-cbd" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Qu'est-ce que le CBD ?</h2>
                  <p>
                    Le cannabidiol (CBD) est l'un des principaux cannabinoïdes présents dans la plante de cannabis. Contrairement au tétrahydrocannabinol (THC), le CBD n'a pas d'effets psychoactifs et ne provoque pas de "high".
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 my-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Le CBD dans la plante</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Le CBD est principalement présent dans les fleurs et les feuilles du cannabis. Il est extrait sous forme d'huile qui peut ensuite être transformée en divers produits.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Système endocannabinoïde</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Le CBD interagit avec le système endocannabinoïde du corps humain, qui joue un rôle dans la régulation de nombreux processus physiologiques.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <p>
                    Le CBD peut être extrait de deux variétés de cannabis : le chanvre et la marijuana. Les produits CBD commercialisés légalement en France proviennent exclusivement du chanvre industriel contenant moins de 0,3% de THC.
                  </p>
                </TabsContent>
                
                {/* Autres tabs... */}
                <TabsContent value="benefits" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Les bienfaits potentiels du CBD</h2>
                  <p>
                    De nombreuses études scientifiques suggèrent que le CBD pourrait présenter plusieurs bienfaits thérapeutiques, bien que la recherche soit encore en cours.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 my-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Réduction de l'anxiété</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Plusieurs études indiquent que le CBD peut aider à réduire l'anxiété, y compris l'anxiété sociale, le trouble panique et le SSPT.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Soulagement de la douleur</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Le CBD a montré des propriétés analgésiques qui peuvent aider à soulager différents types de douleurs chroniques.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Amélioration du sommeil</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          En réduisant l'anxiété et la douleur, le CBD peut indirectement améliorer la qualité du sommeil chez certaines personnes.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Effets neuroprotecteurs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Des recherches préliminaires suggèrent que le CBD pourrait avoir des effets neuroprotecteurs pour certaines maladies neurologiques.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <p className="text-sm text-muted-foreground italic">
                    Note : Ces informations ne constituent pas des conseils médicaux. Consultez toujours un professionnel de santé avant d'utiliser le CBD à des fins thérapeutiques.
                  </p>
                </TabsContent>
                
                {/* Autres tabs continuent... */}
                <TabsContent value="consumption" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Méthodes de consommation</h2>
                  <p>
                    Il existe diverses façons de consommer du CBD, chacune ayant ses propres avantages et inconvénients.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 my-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Huiles et teintures</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Placées sous la langue pour une absorption sublinguale, offrant un bon équilibre entre rapidité d'action et durée des effets.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Gélules et capsules</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Pratiques pour un dosage précis, mais peuvent prendre plus de temps à agir car absorbées par le système digestif.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Produits topiques</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Crèmes, baumes et lotions appliqués directement sur la peau pour un soulagement localisé.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Fleurs et e-liquides</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Inhalés par vaporisation, offrant l'effet le plus rapide mais généralement de plus courte durée.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-6">Conseils de dosage</h3>
                  <p>
                    Le dosage idéal varie considérablement d'une personne à l'autre en fonction de facteurs comme le poids, le métabolisme et la condition traitée. Il est généralement recommandé de commencer avec une faible dose et d'augmenter progressivement jusqu'à obtenir l'effet désiré.
                  </p>
                </TabsContent>
                
                {/* Autres tabs continuent... */}
                <TabsContent value="legality" className="space-y-4">
                  {/* Contenu de la section légalité */}
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4">
                  {/* Contenu de la section histoire */}
                </TabsContent>
                
                <TabsContent value="faq" className="space-y-4">
                  {/* Contenu de la section FAQ */}
                </TabsContent>
                
                <TabsContent value="ai-recommendations" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Recommandations personnalisées</h2>
                  <p className="mb-4">
                    Obtenez des conseils personnalisés en fonction de vos besoins spécifiques grâce à notre assistant IA spécialisé dans le CBD.
                  </p>
                  
                  <AiRecommendations />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          {/* Sidebar avec recommandations IA */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-background">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  Aide personnalisée
                </CardTitle>
                <CardDescription>
                  Besoin de conseils adaptés à votre situation?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Notre assistant IA peut vous proposer des recommandations personnalisées en fonction de vos besoins.
                </p>
                <button 
                  className="w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm font-medium transition-colors"
                  onClick={() => setActiveTab("ai-recommendations")}
                >
                  Obtenir des recommandations
                </button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ressources complémentaires</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="hover:underline">Guide des terpènes du CBD</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="hover:underline">Les cannabinoïdes expliqués</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <a href="#" className="hover:underline">CBD et autres médicaments</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CbdGuide;
