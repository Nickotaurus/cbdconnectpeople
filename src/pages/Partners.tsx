
import { useState } from 'react';
import { MapPin, Filter, Search, Briefcase, Check, Users, Building, Calculator, Shield, Package, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PartnerCategory } from '@/types/auth';

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

const Partners = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filteredPartners, setFilteredPartners] = useState(mockPartners);
  
  const isProfessional = user?.role === "store" || user?.role === "partner";
  
  // Filter partners when search term or category changes
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
    
    // Apply search term filter
    if (term.trim()) {
      filtered = filtered.filter(
        partner => 
          partner.name.toLowerCase().includes(term.toLowerCase()) ||
          partner.location.toLowerCase().includes(term.toLowerCase()) ||
          partner.description.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Apply category filter
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
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{partner.name}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1 font-normal">
                    {getCategoryIcon(partner.category)}
                    {getCategoryLabel(partner.category)}
                  </Badge>
                </div>
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
                      <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                {isProfessional ? (
                  <Button className="w-full">Contacter</Button>
                ) : (
                  <Button variant="outline" className="w-full">Voir le détail</Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;
