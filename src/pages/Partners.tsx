
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PartnerCategory } from '@/types/auth';
import { Shield, Building, MapPin, Calculator, User, Tag, Package, Signpost } from 'lucide-react';
import SubscriptionPlans from '@/components/SubscriptionPlans';

// Données simulées de partenaires
const partners = [
  { 
    id: '1', 
    name: 'AssurCBD', 
    category: 'insurance', 
    description: 'Spécialiste de l'assurance pour les professionnels du CBD',
    isPremium: true 
  },
  { 
    id: '2', 
    name: 'Comptabilité Cannabis', 
    category: 'accountant', 
    description: 'Cabinet comptable spécialisé dans le cannabis légal',
    isPremium: false 
  },
  { 
    id: '3', 
    name: 'CBD Bank', 
    category: 'bank', 
    description: 'Solutions bancaires pour les entreprises du secteur CBD',
    isPremium: true 
  },
  { 
    id: '4', 
    name: 'CBD Logistics', 
    category: 'logistics', 
    description: 'Transport et logistique spécialisés pour le CBD',
    isPremium: false 
  },
  { 
    id: '5', 
    name: 'CBD Legal', 
    category: 'legal', 
    description: 'Cabinet d'avocats spécialisé dans la législation du CBD',
    isPremium: true 
  },
  { 
    id: '6', 
    name: 'CBD Media', 
    category: 'media', 
    description: 'Agence de communication dédiée au CBD',
    isPremium: false 
  },
  { 
    id: '7', 
    name: 'CBD Lab', 
    category: 'laboratory', 
    description: 'Analyses et certifications de produits CBD',
    isPremium: true 
  },
  { 
    id: '8', 
    name: 'CBD Immobilier', 
    category: 'realEstate', 
    description: 'Agence immobilière spécialisée dans les locaux commerciaux pour CBD',
    isPremium: false 
  }
];

const partnerCategories = [
  { value: "bank", label: "Banque" },
  { value: "accountant", label: "Comptable" },
  { value: "legal", label: "Juriste" },
  { value: "insurance", label: "Assurance" },
  { value: "logistics", label: "Logistique" },
  { value: "breeder", label: "Breeder" },
  { value: "label", label: "Label" },
  { value: "association", label: "Association" },
  { value: "media", label: "Média" },
  { value: "laboratory", label: "Laboratoire" },
  { value: "production", label: "Production" },
  { value: "realEstate", label: "Agence immobilière" }
];

const getCategoryName = (category: string) => {
  const found = partnerCategories.find(c => c.value === category);
  return found ? found.label : category;
};

const Partners = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showSubscription, setShowSubscription] = useState(false);
  
  // Vérifie si l'utilisateur a un abonnement premium (pour la démo)
  const hasPremium = user?.role === 'store' || user?.role === 'producer';
  
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? partner.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });
  
  const handleViewContact = (partnerId: string) => {
    if (hasPremium) {
      // Dans une app réelle, afficherait les coordonnées ou redirigerait vers un profil détaillé
      alert("Contact affiché (simulation) - Dans une version en production, vous verriez les coordonnées complètes du partenaire.");
    } else {
      setShowSubscription(true);
    }
  };
  
  const handleSubscription = (planId: string) => {
    // Dans une app réelle, traiterait l'abonnement
    setShowSubscription(false);
    alert(`Abonnement ${planId} souscrit (simulation) - Dans une version en production, vous auriez accès aux coordonnées des partenaires.`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Annuaire des Partenaires</h1>
          <p className="text-muted-foreground">Trouvez des services spécialisés pour votre activité CBD</p>
        </div>
        
        {(user?.role === 'partner') && (
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/partner/profile')}>
            Gérer mon profil partenaire
          </Button>
        )}
      </div>
      
      {/* Filtres */}
      <div className="grid gap-4 mb-8 md:grid-cols-2">
        <div>
          <Input
            placeholder="Rechercher un partenaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les catégories</SelectItem>
              {partnerCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showSubscription ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Accès aux coordonnées des partenaires</CardTitle>
            <CardDescription>
              Avec un abonnement premium, accédez aux coordonnées complètes de tous nos partenaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionPlans onSelectPlan={handleSubscription} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setShowSubscription(false)}>
              Fermer
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partenaire</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{getCategoryName(partner.category)}</TableCell>
                    <TableCell className="hidden md:table-cell">{partner.description}</TableCell>
                    <TableCell>
                      <Button 
                        variant={hasPremium ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => handleViewContact(partner.id)}
                      >
                        {hasPremium ? "Voir contact" : "Contact premium"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Aucun partenaire trouvé avec les critères sélectionnés
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Section réservée aux visiteurs non inscrits comme partenaires */}
      {!user || user.role !== 'partner' ? (
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Vous proposez des services pour les professionnels du CBD ?</h2>
          <p className="mb-6">
            Rejoignez notre annuaire de partenaires et connectez-vous avec des boutiques et producteurs de CBD à la recherche de vos services.
          </p>
          <Button onClick={() => navigate('/register?role=partner')}>
            Devenir partenaire
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Partners;
