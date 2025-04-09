
import { useState } from 'react';
import { Link, Award } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import PartnerSubscriptionHero from '@/components/partners/PartnerSubscriptionHero';
import PartnerBenefitsGrid from '@/components/partners/PartnerBenefitsGrid';
import PartnerSubscriptionCard from '@/components/partners/PartnerSubscriptionCard';

const PartnersSubscriptionPage = () => {
  const { toast } = useToast();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [selectedDurations, setSelectedDurations] = useState({
    basic: "1",
    premium: "1",
    ultimate: "1"
  });

  // Subscription offers data
  const offers = [
    {
      id: "basic",
      name: "Offre 1 : Visibilité Essentielle",
      prices: {
        yearly: 50,
        biennial: 90
      },
      savings: 10,
      features: [
        "Backlink de qualité renvoyant vers votre société",
        "Visibilité accrue avec la possibilité de faire gagner vos produits/services à la loterie du CBD",
        "Accès au carnet d'adresses B2B avec coordonnées et contacts",
        "Récupérez plus d'avis Google grâce au jeu CBD Quest"
      ],
      icon: <Link className="h-8 w-8 text-primary" />
    },
    {
      id: "premium",
      name: "Offre 2 : Visibilité Premium",
      prices: {
        yearly: 100,
        biennial: 180
      },
      savings: 20,
      features: [
        "Tous les avantages de l'Offre 1",
        "Affichage prioritaire dans la recherche",
        "Accès aux demandes de contacts directs",
        "Publiez un article promotionnel avec lien direct vers votre site",
        "Sponsorisez votre boutique ou produit dans le Classement CBD et gagnez en visibilité (option payante)"
      ],
      icon: <Award className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero Section */}
      <PartnerSubscriptionHero />

      {/* Benefits Grid */}
      <PartnerBenefitsGrid />

      {/* Subscription Cards */}
      <div className="container mx-auto px-4 py-12 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos offres de partenariat</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choisissez l'offre et la durée qui correspondent à vos besoins
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {offers.map((offer) => (
            <PartnerSubscriptionCard
              key={offer.id}
              offer={offer}
              selectedDurations={selectedDurations}
              setSelectedDurations={setSelectedDurations}
              setSelectedOffer={setSelectedOffer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersSubscriptionPage;
