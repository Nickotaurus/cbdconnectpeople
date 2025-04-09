import { useState } from 'react';
import { MapPin, Filter, Search, Briefcase, Users, Building, Calculator, Shield, Package, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PartnerCategory } from '@/types/auth';
import PartnerCard from '@/components/partners/PartnerCard';
import PremiumAccessBanner from '@/components/partners/PremiumAccessBanner';
import PartnerSearchFilters from '@/components/partners/PartnerSearchFilters';
import PartnerSubscriptionOffers from '@/components/partners/PartnerSubscriptionOffers';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filteredPartners, setFilteredPartners] = useState(mockPartners);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  const isProfessional = user?.role === "store" || user?.role === "partner";
  const hasPremium = user?.role === "store" && user.isVerified; // Assuming isVerified indicates premium status
  
  const handleSearch = (term: string) => {
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
      console.log('User needs premium to view contact info');
    }
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
        
        <PartnerSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          categoryFilter={categoryFilter}
          handleCategoryFilter={handleCategoryFilter}
          partnerCategories={partnerCategories}
          getCategoryLabel={getCategoryLabel}
        />
        
        <PremiumAccessBanner 
          isProfessional={isProfessional} 
          hasPremium={hasPremium} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map(partner => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              getCategoryIcon={getCategoryIcon}
              getCategoryLabel={getCategoryLabel}
              isProfessional={isProfessional}
              hasPremium={hasPremium}
              onContactClick={handleContactClick}
            />
          ))}
        </div>

        <PartnerSubscriptionOffers />
      </div>
    </div>
  );
};

export default Partners;
