import { useState } from 'react';
import { MapPin, Filter, Search, Briefcase, Check, Users, Building, Calculator, Shield, Package, Tag, Award, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { PartnerCategory } from '@/types/auth';
import BecomePartnerCTA from '@/components/partners/BecomePartnerCTA';
import PartnerSubscriptionModal from '@/components/partners/PartnerSubscriptionModal';

// Partner categories data
const partnerCategories = [
  { value: "bank", label: "Banque", icon: <Building className="h-4 w-4" /> },
  { value: "accountant", label: "Comptable", icon: <Calculator className="h-4 w-4" /> },
  { value: "legal", label: "Juriste", icon: <Briefcase className="h-4 w-4" /> },
  { value: "insurance", label: "Assurance", icon: <Shield className="h-4 w-4" /> },
  { value: "logistics", label: "Logistique", icon: <Package className="h-4 w-4" /> },
  { value: "breeder", label: "Breeder", icon: <Users className="h-4 w-4" /> },
  { value: "label", label: "Label", icon: <Tag className="h-4 w-4" /> },
  { value: "association", label: "Association", icon: <Users className="h-4 w-4" /> },
  { value: "media", label: "Média", icon: <Briefcase className="h-4 w-4" /> },
  { value: "laboratory", label: "Laboratoire", icon: <Briefcase className="h-4 w-4" /> },
  { value: "production", label: "Production", icon: <Package className="h-4 w-4" /> },
  { value: "realEstate", label: "Agence immobilière", icon: <Building className="h-4 w-4" /> }
];

// Mock data for partners
const mockPartners = [
  {
    id: "p1",
    name: "Chanvre des Alpes",
    category: "production" as PartnerCategory,
    location: "Grenoble, France",
    description: "Producteur de chanvre biologique dans les Alpes françaises. Culture en extérieur avec méthodes traditionnelles.",
    certifications: ["Bio", "Sans pesticides"],
    distance: 120,
    imageUrl: "https://images.unsplash.com/photo-1589244159943-460088ed5c83?q=80&w=1000",
  },
  {
    id: "p2",
    name: "Green Comptabilité",
    category: "accountant" as PartnerCategory,
    location: "Paris, France",
    description: "Cabinet comptable spécialisé dans les entreprises du secteur du CBD et du chanvre.",
    certifications: ["Expertise CBD", "Agréé"],
    distance: 245,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000",
  },
  {
    id: "p3",
    name: "CannaBanque",
    category: "bank" as PartnerCategory,
    location: "Lyon, France",
    description: "Services bancaires adaptés aux professionnels du CBD avec des solutions de paiement spécifiques.",
    certifications: ["Fintech", "Sécurisé"],
    distance: 78,
    imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=1000",
  },
  {
    id: "p4",
    name: "CBD Juridique",
    category: "legal" as PartnerCategory,
    location: "Bordeaux, France",
    description: "Cabinet d'avocats spécialisé dans la réglementation du CBD et du cannabis en France et en Europe.",
    certifications: ["Droit Commercial", "Expert CBD"],
    distance: 180,
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000",
  },
  {
    id: "p5",
    name: "CBD Quality Lab",
    category: "laboratory" as PartnerCategory,
    location: "Toulouse, France",
    description: "Laboratoire d'analyses spécialisé dans le contrôle qualité des produits CBD et chanvre.",
    certifications: ["ISO 9001", "Accrédité"],
    distance: 210,
    imageUrl: "https://images.unsplash.com/photo-1587613981449-fcd95a7d28fd?q=80&w=1000",
  },
];

// Subscription offers data
const subscriptionOffers = [
  {
    id: 'essential',
    title: 'Visibilité Essentielle',
    description: 'Démarrez votre présence en ligne avec des avantages clés',
    prices: {
      yearly: 50,
      biennial: 90,
    },
    savings: 10,
    benefits: [
      'Backlink de qualité renvoyant vers votre société',
      'Visibilité accrue avec la possibilité de faire gagner vos produits/services à la loterie du CBD',
      'Accès au carnet d\'adresses B2B avec coordonnées et contacts',
      'Récupérez plus d\'avis Google grâce au jeu CBD Quest'
    ],
    icon: <Briefcase className="h-8 w-8 text-primary" />
  },
  {
    id: 'premium',
    title: 'Visibilité Premium',
    description: 'Maximisez votre impact et votre visibilité',
    prices: {
      yearly: 100,
      biennial: 180,
    },
    savings: 20,
    benefits: [
      'Tous les avantages de l\'offre Visibilité Essentielle',
      'Affichage prioritaire dans la recherche',
      'Accès aux demandes de contacts directs',
      'Publiez un article promotionnel avec lien direct vers votre site',
      'Sponsorisez votre boutique ou produit dans le Classement CBD et gagnez en visibilité (option payante)'
    ],
    icon: <Award className="h-8 w-8 text-primary" />
  }
];

const Partners = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filteredPartners, setFilteredPartners] = useState(mockPartners);
  const [selectedDurations, setSelectedDurations] = useState({
    essential: "1",
    premium: "1"
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  const isProfessional = user?.role === "store" || user?.role === "partner";
  const hasPremium = user?.role === "store" && user.isVerified; // Assuming isVerified indicates premium status
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterPartners(term, categoryFilter);
  };
  
  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    filterPartners(searchTerm, category);
  };
  
  const filterPartners = (term: string, category: string) => {
    let filtered = mockPartners;
    
    if (term.trim()) {
      filtered = filtered.filter(
        partner => 
          partner.name.toLowerCase().includes(term.toLowerCase()) ||
          partner.location.toLowerCase().includes(term.toLowerCase()) ||
          partner.description.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(partner => partner.category === category);
    }
    
    setFilteredPartners(filtered);
  };
  
  const getCategoryLabel = (categoryValue: PartnerCategory) => {
    const category = partnerCategories.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  
  const getCategoryIcon = (categoryValue: PartnerCategory) => {
    const category = partnerCategories.find(c => c.value === categoryValue);
    return category ? category.icon : <Briefcase className="h-4 w-4" />;
  };
  
  const handleContactClick = (partnerId: string) => {
    if (hasPremium) {
      console.log(`Showing contact info for partner ${partnerId}`);
      setSelectedPartnerId(partnerId);
    } else {
      setShowSubscriptionModal(true);
    }
  };
  
  const handleSubscribe = (planId: string) => {
    setShowSubscriptionModal(false);
    console.log(`Subscribing to plan: ${planId}`);
    navigate('/partners/subscription');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Partenaires CBD Connect</h1>
          <p className="text-muted-foreground">
            {isProfessional 
              ? "Connectez-vous avec tous les partenaires de l'écosystème CBD" 
              : "Découvrez les partenaires qui font vivre l'écosystème CBD en France"}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, région ou service..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {categoryFilter === 'all' ? 'Toutes catégories' : getCategoryLabel(categoryFilter as PartnerCategory)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleCategoryFilter('all')}>
                Toutes catégories
              </DropdownMenuItem>
              {partnerCategories.map((category) => (
                <DropdownMenuItem 
                  key={category.value} 
                  onClick={() => handleCategoryFilter(category.value)}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Proximité
          </Button>
        </div>
        
        {(!user || (user.role !== "store" && user.role !== "partner")) && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm">
              Vous êtes un professionnel ? <a href="/register" className="text-primary font-medium hover:underline">Créez un compte professionnel</a> pour contacter directement les partenaires.
            </p>
          </div>
        )}
        
        {isProfessional && !hasPremium && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Lock className="text-primary h-10 w-10" />
              <div>
                <h3 className="font-medium">Accès aux coordonnées des partenaires</h3>
                <p className="text-sm text-muted-foreground">
                  Accédez aux coordonnées de nos partenaires avec un abonnement premium.
                </p>
              </div>
              <Button 
                className="ml-auto"
                onClick={() => setShowSubscriptionModal(true)}
              >
                Débloquer l'accès
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map(partner => (
            <Card key={partner.id} className="overflow-hidden flex flex-col h-full">
              <div className="h-48 overflow-hidden">
                <img 
                  src={partner.imageUrl} 
                  alt={partner.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <Badge variant="secondary" className="flex items-center gap-1 text-base px-3 py-1.5 mb-2 font-semibold">
                  {getCategoryIcon(partner.category)}
                  {getCategoryLabel(partner.category)}
                </Badge>
                <CardTitle className="text-xl">{partner.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {partner.location} • <span>{partner.distance} km</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                <p className="text-sm text-muted-foreground mb-3">{partner.description}</p>
                
                <div className="mb-3">
                  <p className="text-xs font-medium mb-1.5">Certifications:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.certifications.map(cert => (
                      <Badge key={cert} variant="outline" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                {isProfessional ? (
                  <Button 
                    className="w-full gap-2"
                    onClick={() => handleContactClick(partner.id)}
                  >
                    {!hasPremium && <Lock className="h-4 w-4 mr-1" />}
                    {hasPremium ? "Contacter" : "Voir les coordonnées"}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">Voir le détail</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-primary/5 rounded-lg p-6 mt-12 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Référencez votre entreprise sur CBD Connect</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {subscriptionOffers.map(offer => (
              <Card 
                key={offer.id} 
                className={`border ${offer.id === 'premium' ? 'border-2 border-primary' : 'border-primary/20'} overflow-hidden`}
              >
                {offer.id === 'premium' && (
                  <Badge className="absolute top-4 right-4 bg-primary">Recommandé</Badge>
                )}
                
                <div className={`px-6 py-4 flex items-center justify-between ${offer.id === 'premium' ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <div>
                    <h3 className="text-xl font-bold">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                  </div>
                  {offer.icon}
                </div>
                
                <CardContent className="pt-6">
                  <div className="flex gap-4 mb-6">
                    <div 
                      className={`cursor-pointer flex-1 text-center px-4 py-3 rounded-lg border ${
                        selectedDurations[offer.id as keyof typeof selectedDurations] === "1" 
                          ? "border-primary bg-primary/10" 
                          : "border-muted bg-muted/50"
                      }`}
                      onClick={() => setSelectedDurations(prev => ({...prev, [offer.id]: "1"}))}
                    >
                      <p className="font-medium">1 An</p>
                      <p className="text-lg font-bold mt-1">{offer.prices.yearly}€</p>
                    </div>
                    
                    <div 
                      className={`cursor-pointer flex-1 text-center px-4 py-3 rounded-lg border relative overflow-hidden ${
                        selectedDurations[offer.id as keyof typeof selectedDurations] === "2" 
                          ? "border-primary bg-primary/10" 
                          : "border-muted bg-muted/50"
                      }`}
                      onClick={() => setSelectedDurations(prev => ({...prev, [offer.id]: "2"}))}
                    >
                      <div className="absolute -right-7 -top-1 bg-primary text-primary-foreground px-8 py-0.5 text-xs rotate-45">
                        -{offer.savings}€
                      </div>
                      <p className="font-medium">2 Ans</p>
                      <p className="text-lg font-bold mt-1">{offer.prices.biennial}€</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        au lieu de {offer.prices.yearly * 2}€
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Ce que vous obtenez :</h4>
                    <ul className="space-y-2">
                      {offer.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 bg-muted/30 p-3 rounded-lg mt-4">
                      <p className="text-sm">
                        <strong>Pourquoi choisir 2 ans ? </strong>
                        Économisez {offer.savings}€ et assurez une visibilité prolongée pour votre entreprise.
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4">
                  <Button 
                    className="w-full gap-2" 
                    variant={offer.id === 'premium' ? 'default' : 'secondary'}
                    onClick={() => navigate('/partners/subscription', { 
                      state: { 
                        offer: offer.id,
                        duration: selectedDurations[offer.id as keyof typeof selectedDurations] 
                      } 
                    })}
                  >
                    Sélectionner cette offre
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {showSubscriptionModal && (
          <PartnerSubscriptionModal 
            onClose={() => setShowSubscriptionModal(false)}
            onSubscribe={handleSubscribe}
          />
        )}
      </div>
    </div>
  );
};

export default Partners;
