
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
  BrainCircuit,
  Users,
  Store,
  FileText,
  ShoppingBag,
  Settings,
  BarChart,
  Sprout,
  SeedingGoing,
  TrendingUp,
  Building,
  DollarSign,
  Network
} from 'lucide-react';

const CbdGuide = () => {
  const [activeSection, setActiveSection] = useState("client");
  const [activeTab, setActiveTab] = useState("what-is-cbd");
  
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Set default tab for each section
    switch (section) {
      case "client":
        setActiveTab("what-is-cbd");
        break;
      case "producer":
        setActiveTab("getting-started");
        break;
      case "store":
        setActiveTab("opening");
        break;
      default:
        setActiveTab("what-is-cbd");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Network className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Guide complet du CBD</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Des ressources adaptées pour chaque acteur de l'écosystème CBD
        </p>
        
        {/* Sections principales (Client, Producteur, Boutique) */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleSectionChange("client")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === "client" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Users className="h-4 w-4" />
            Guide Client
          </button>
          <button
            onClick={() => handleSectionChange("producer")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === "producer" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Leaf className="h-4 w-4" />
            Guide Producteur
          </button>
          <button
            onClick={() => handleSectionChange("store")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === "store" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <Store className="h-4 w-4" />
            Guide Boutique
          </button>
        </div>
        
        <div className="grid lg:grid-cols-[3fr_1fr] gap-6">
          <div>
            {/* Section Client */}
            {activeSection === "client" && (
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
                  
                  <TabsContent value="legality" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Légalité du CBD en France</h2>
                    <p>
                      Le cadre légal du CBD en France a connu plusieurs évolutions ces dernières années. Voici les principales informations à connaître.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Législation actuelle</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Le CBD est légal en France s'il provient de variétés de chanvre autorisées et contient moins de 0,3% de THC, conformément à la réglementation européenne.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Produits autorisés</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Les huiles, fleurs, résines, e-liquides et autres produits à base de CBD sont autorisés à la vente et à la consommation, sous réserve de respecter la limite de THC.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Histoire du CBD</h2>
                    <p>
                      Le CBD a une longue histoire qui remonte à plusieurs millénaires, bien que sa composition chimique n'ait été identifiée que récemment.
                    </p>
                    
                    <div className="space-y-4 my-6">
                      <div className="border-l-4 border-primary/30 pl-4">
                        <h3 className="text-lg font-medium">Utilisation historique</h3>
                        <p className="text-sm text-muted-foreground">
                          Le cannabis est utilisé à des fins médicinales depuis des millénaires dans de nombreuses civilisations, notamment en Chine, en Inde et au Moyen-Orient.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary/30 pl-4">
                        <h3 className="text-lg font-medium">Découverte scientifique</h3>
                        <p className="text-sm text-muted-foreground">
                          Le CBD a été isolé pour la première fois en 1940 par le chimiste américain Roger Adams. Sa structure chimique complète a été élucidée en 1963.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-primary/30 pl-4">
                        <h3 className="text-lg font-medium">Recherche moderne</h3>
                        <p className="text-sm text-muted-foreground">
                          Les recherches sur les applications thérapeutiques du CBD se sont intensifiées depuis les années 1990, avec la découverte du système endocannabinoïde.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="faq" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Questions fréquentes</h2>
                    
                    <div className="space-y-6 mt-4">
                      <div>
                        <h3 className="text-lg font-medium">Le CBD est-il addictif ?</h3>
                        <p className="mt-1">
                          Non, le CBD n'est pas considéré comme une substance addictive. Contrairement au THC, il n'active pas les mêmes récepteurs cérébraux qui peuvent conduire à la dépendance.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Le CBD va-t-il me faire planer ?</h3>
                        <p className="mt-1">
                          Non, le CBD n'a pas d'effets psychoactifs. Il ne provoque pas d'état d'euphorie ou de "high" comme le THC.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Combien de temps les effets du CBD durent-ils ?</h3>
                        <p className="mt-1">
                          La durée des effets varie selon le mode de consommation, la dose et le métabolisme individuel. En général, les effets peuvent durer de 2 à 6 heures.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Le CBD apparaît-il sur les tests de dépistage de drogues ?</h3>
                        <p className="mt-1">
                          La plupart des tests de dépistage standard recherchent le THC, pas le CBD. Cependant, certains produits CBD peuvent contenir des traces de THC qui pourraient théoriquement déclencher un résultat positif.
                        </p>
                      </div>
                    </div>
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
            )}
            
            {/* Section Producteur */}
            {activeSection === "producer" && (
              <Tabs 
                defaultValue="getting-started" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-8"
              >
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="getting-started" className="flex flex-col gap-1 h-auto py-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs">Se lancer</span>
                  </TabsTrigger>
                  <TabsTrigger value="growing" className="flex flex-col gap-1 h-auto py-2">
                    <Sprout className="h-4 w-4" />
                    <span className="text-xs">Cultiver</span>
                  </TabsTrigger>
                  <TabsTrigger value="selling" className="flex flex-col gap-1 h-auto py-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">Commercialiser</span>
                  </TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[60vh] rounded-md border p-6">
                  <TabsContent value="getting-started" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Se lancer dans la production de CBD</h2>
                    <p>
                      Tout ce que vous devez savoir pour démarrer votre activité de production de CBD.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Réglementation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Pour produire légalement du CBD en France, il faut utiliser des variétés de chanvre autorisées et respecter la limite de 0,3% de THC. Une déclaration auprès des autorités est nécessaire.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Financement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Le démarrage d'une exploitation de chanvre pour le CBD nécessite un investissement initial conséquent. Plusieurs options de financement existent, incluant les prêts agricoles spécialisés.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Choix des graines</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Seules les variétés inscrites au catalogue européen sont autorisées. Choisissez des variétés riches en CBD et pauvres en THC, adaptées à votre climat local.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Équipement nécessaire</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            La culture du CBD nécessite des équipements spécifiques pour la plantation, la récolte, le séchage et l'extraction, représentant un investissement initial important.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="growing" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Techniques de culture et qualité</h2>
                    <p>
                      Les meilleures pratiques pour cultiver du CBD de haute qualité et obtenir les certifications nécessaires.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Méthodes de culture</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Les cultures en extérieur, en serre ou en intérieur offrent chacune des avantages spécifiques. Le choix dépend de votre budget, de votre région et de vos objectifs de production.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Agriculture biologique</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            La certification biologique représente un avantage commercial significatif. Elle implique l'absence de pesticides et d'engrais chimiques, mais nécessite une démarche rigoureuse.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Contrôle qualité</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Des analyses régulières sont essentielles pour garantir la teneur en cannabinoïdes et l'absence de contaminants comme les métaux lourds ou les pesticides.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Récolte et post-récolte</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Le moment de la récolte et les techniques de séchage et de cure sont déterminants pour la qualité finale du produit et sa teneur en CBD.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="selling" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Stratégies de vente et distribution</h2>
                    <p>
                      Comment commercialiser efficacement vos produits CBD auprès des boutiques et respecter la réglementation en vigueur.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Approche des boutiques</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Développez une stratégie B2B solide en mettant en avant la qualité et la traçabilité de vos produits. Proposez des échantillons et un support marketing aux boutiques.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Fixation des prix</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            La tarification doit prendre en compte vos coûts de production, la qualité de votre produit et les prix du marché. Proposez différentes gammes pour toucher plusieurs segments.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Vente directe</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            La vente en ligne ou sur les marchés peut compléter votre distribution B2B, mais nécessite de respecter des réglementations spécifiques et d'investir dans le marketing.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Conformité légale</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Assurez-vous que votre étiquetage, vos allégations marketing et vos canaux de distribution respectent la législation en vigueur, qui évolue régulièrement.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            )}
            
            {/* Section Boutique */}
            {activeSection === "store" && (
              <Tabs 
                defaultValue="opening" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-8"
              >
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="opening" className="flex flex-col gap-1 h-auto py-2">
                    <Building className="h-4 w-4" />
                    <span className="text-xs">Ouvrir sa boutique</span>
                  </TabsTrigger>
                  <TabsTrigger value="managing" className="flex flex-col gap-1 h-auto py-2">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs">Gérer sa boutique</span>
                  </TabsTrigger>
                  <TabsTrigger value="selling-business" className="flex flex-col gap-1 h-auto py-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Revendre sa boutique</span>
                  </TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[60vh] rounded-md border p-6">
                  <TabsContent value="opening" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Ouvrir une boutique de CBD</h2>
                    <p>
                      Les étapes essentielles pour créer et lancer votre boutique de CBD en toute légalité.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Business plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Un business plan solide est essentiel pour obtenir des financements et clarifier votre vision. Il doit inclure une étude de marché, un plan financier et une stratégie commerciale.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Démarches administratives</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            L'ouverture d'une boutique CBD nécessite diverses formalités : choix du statut juridique, immatriculation, déclarations fiscales et parfois des autorisations spécifiques selon votre localité.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Choix du local</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            L'emplacement est crucial pour le succès d'une boutique CBD. Privilégiez les zones à fort passage, facilement accessibles, et vérifiez les contraintes d'urbanisme.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Approvisionnement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Sélectionnez soigneusement vos fournisseurs en vérifiant la qualité de leurs produits, leur conformité légale et leurs conditions commerciales. Diversifiez votre offre pour attirer différents profils de clients.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="managing" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Gérer sa boutique de CBD</h2>
                    <p>
                      Les meilleures pratiques pour assurer le succès et la pérennité de votre commerce.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Marketing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Développez une stratégie marketing multicanal : présence en ligne, réseaux sociaux, fidélisation client, et événements. Respectez les restrictions publicitaires spécifiques au CBD.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Gestion des stocks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Une gestion rigoureuse des stocks est essentielle pour éviter les ruptures et l'immobilisation de capital. Utilisez un logiciel adapté et suivez régulièrement vos indicateurs.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Relation client</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            La qualité du conseil est un facteur différenciant majeur. Formez votre équipe sur les produits, leurs effets et leurs utilisations pour garantir une expérience client optimale.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Veille réglementaire</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            La législation sur le CBD évolue régulièrement. Restez informé des changements réglementaires pour adapter votre offre et votre communication en conséquence.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="selling-business" className="space-y-4">
                    <h2 className="text-2xl font-semibold">Revendre sa boutique de CBD</h2>
                    <p>
                      Comment valoriser et céder votre commerce dans les meilleures conditions.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 my-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Valorisation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            La valeur d'une boutique CBD dépend de plusieurs facteurs : chiffre d'affaires, rentabilité, emplacement, clientèle fidélisée, et potentiel de développement. Faites réaliser une estimation professionnelle.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Préparation à la vente</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Optimisez votre boutique avant la mise en vente : clarifiez les comptes, formalisez les processus, renégociez les baux et contrats fournisseurs si nécessaire.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Transmission</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Une transmission réussie implique un accompagnement du repreneur : partage des connaissances, présentation aux fournisseurs et clients clés, formation sur les spécificités du secteur.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Aspects fiscaux</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            La cession d'un fonds de commerce a des implications fiscales importantes. Consultez un expert-comptable pour optimiser la transaction et anticiper l'imposition des plus-values.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            )}
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
