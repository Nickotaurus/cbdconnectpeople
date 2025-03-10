import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { guideContent } from '@/utils/data';
import { Building, Shield, Calculator, MapPin, Tag, Package } from 'lucide-react';
import GuideSearch from '@/components/guide/GuideSearch';
import GeneralGuideSection from '@/components/guide/GeneralGuideSection';
import BusinessGuideSection from '@/components/guide/BusinessGuideSection';

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
        
        <GuideSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="general">Guide général</TabsTrigger>
            <TabsTrigger value="business">Guide professionnel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralGuideSection 
              content={filteredGeneralContent}
              searchTerm={searchTerm}
              onResetSearch={() => setSearchTerm("")}
            />
          </TabsContent>
          
          <TabsContent value="business">
            <BusinessGuideSection 
              content={filteredBusinessContent}
              searchTerm={searchTerm}
              onResetSearch={() => setSearchTerm("")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CbdGuide;
