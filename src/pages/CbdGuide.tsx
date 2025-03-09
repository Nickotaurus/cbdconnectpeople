
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { guideContent } from '@/utils/data';
import { Search, Briefcase, Store, Shield, Building, Calculator, MapPin, Tag, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const CbdGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // Business guide content for CBD professionals
  const businessGuide = [
    {
      id: "b1",
      title: "Trouver une banque adaptée au CBD",
      icon: <Building className="h-10 w-10 text-primary" />,
      content: "Le secteur bancaire peut parfois être réticent face aux entreprises du CBD. Découvrez les banques qui accompagnent spécifiquement les professionnels du CBD et comment présenter votre activité pour maximiser vos chances d'obtenir un compte professionnel.",
      partnerCategory: "bank"
    },
    {
      id: "b2",
      title: "Assurance pour votre activité CBD",
      icon: <Shield className="h-10 w-10 text-primary" />,
      content: "Protégez votre entreprise avec une assurance adaptée. Les risques spécifiques au secteur du CBD nécessitent des couvertures particulières que les assureurs traditionnels ne proposent pas toujours.",
      partnerCategory: "insurance"
    },
    {
      id: "b3",
      title: "Comptabilité et fiscalité du CBD",
      icon: <Calculator className="h-10 w-10 text-primary" />,
      content: "La comptabilité d'une entreprise CBD présente des spécificités, notamment en matière de TVA et de traitement fiscal des produits. Un comptable spécialisé vous aidera à optimiser votre gestion financière tout en restant en conformité.",
      partnerCategory: "accountant"
    },
    {
      id: "b4",
      title: "Trouver un local commercial adapté",
      icon: <MapPin className="h-10 w-10 text-primary" />,
      content: "L'emplacement est crucial pour une boutique CBD. Découvrez comment trouver le local idéal et négocier un bail favorable, en tenant compte des contraintes spécifiques liées à la vente de produits CBD.",
      partnerCategory: "realEstate"
    },
    {
      id: "b5",
      title: "Logistique et supply chain",
      icon: <Package className="h-10 w-10 text-primary" />,
      content: "La gestion des stocks et la distribution des produits CBD nécessitent une logistique adaptée. Découvrez comment optimiser votre chaîne d'approvisionnement et trouver des partenaires logistiques spécialisés.",
      partnerCategory: "logistics"
    },
    {
      id: "b6",
      title: "Certification et analyses de laboratoire",
      icon: <Tag className="h-10 w-10 text-primary" />,
      content: "Les analyses de laboratoire sont essentielles pour garantir la qualité et la conformité de vos produits CBD. Apprenez à choisir un laboratoire fiable et à interpréter les résultats d'analyses.",
      partnerCategory: "laboratory"
    },
  ];

  // Filter content based on search term
  const filteredGeneralContent = guideContent.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBusinessContent = businessGuide.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Guide complet du CBD</h1>
        
        {/* Search bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Rechercher dans le guide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Tabs navigation */}
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="general">
              Guide général
            </TabsTrigger>
            <TabsTrigger value="business">
              Guide professionnel
            </TabsTrigger>
          </TabsList>
          
          {/* General CBD guide content */}
          <TabsContent value="general">
            {filteredGeneralContent.length > 0 ? (
              <div className="grid gap-6">
                {filteredGeneralContent.map((item) => (
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
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Aucun résultat trouvé pour "{searchTerm}"</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Réinitialiser la recherche
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Business guide content */}
          <TabsContent value="business">
            {filteredBusinessContent.length > 0 ? (
              <div className="grid gap-6">
                {filteredBusinessContent.map((item) => (
                  <Card key={item.id} className="relative overflow-hidden">
                    <span className="absolute top-0 right-0 bg-primary/10 px-3 py-1 text-xs font-medium rounded-bl-lg">
                      Professionnel
                    </span>
                    <CardHeader className="flex flex-row items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {item.icon}
                      </div>
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>Guide spécifique pour les professionnels du CBD</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <p>{item.content}</p>
                      <div className="flex justify-end">
                        <Link to={`/partners?category=${item.partnerCategory}`}>
                          <Button variant="outline">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Trouver un partenaire
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Aucun résultat trouvé pour "{searchTerm}"</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Réinitialiser la recherche
                </Button>
              </div>
            )}
            
            {/* CTA section for business owners */}
            <div className="mt-8 p-6 border rounded-lg bg-primary/5">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <Store className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Vous êtes un professionnel du CBD ?</h3>
                  <p className="mb-4 text-muted-foreground">
                    Accédez à notre annuaire de partenaires spécialisés pour vous accompagner dans le développement 
                    de votre activité : banques, assurances, comptables, et bien plus encore.
                  </p>
                  <Link to="/partners">
                    <Button>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Consulter l'annuaire des partenaires
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CbdGuide;
