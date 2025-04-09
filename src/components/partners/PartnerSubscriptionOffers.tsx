
import { useState } from 'react';
import { Briefcase, Award } from 'lucide-react';
import PartnerOfferCard from './PartnerOfferCard';

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

const PartnerSubscriptionOffers = () => {
  const [selectedDurations, setSelectedDurations] = useState({
    essential: "1",
    premium: "1"
  });
  
  const handleSelectDuration = (offerId: string, duration: string) => {
    setSelectedDurations(prev => ({...prev, [offerId]: duration}));
  };
  
  return (
    <div className="bg-primary/5 rounded-lg p-6 mt-12 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Référencez votre entreprise sur CBD Connect</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {subscriptionOffers.map(offer => (
          <PartnerOfferCard
            key={offer.id}
            offer={offer}
            selectedDuration={selectedDurations[offer.id as keyof typeof selectedDurations]}
            onSelectDuration={(duration) => handleSelectDuration(offer.id, duration)}
            isPremium={offer.id === 'premium'}
          />
        ))}
      </div>
    </div>
  );
};

export default PartnerSubscriptionOffers;
