
import { useState } from 'react';
import { Briefcase, Award } from 'lucide-react';
import PartnerOfferCard from './PartnerOfferCard';

// Subscription offers data - now free
const subscriptionOffers = [
  {
    id: 'free',
    title: 'Visibilité Professionnelle',
    description: 'Rejoignez notre réseau professionnel CBD gratuitement',
    prices: {
      yearly: 0,
      biennial: 0,
    },
    savings: 0,
    benefits: [
      'Backlink de qualité renvoyant vers votre société',
      'Visibilité sur la carte et dans notre répertoire',
      'Accès au carnet d\'adresses B2B avec coordonnées et contacts',
      'Accès aux ressources et formations pour les professionnels',
      'Participez à notre communauté d\'entraide'
    ],
    icon: <Briefcase className="h-8 w-8 text-primary" />
  }
];

const PartnerSubscriptionOffers = () => {
  const [selectedDurations, setSelectedDurations] = useState({
    free: "1"
  });
  
  const handleSelectDuration = (offerId: string, duration: string) => {
    setSelectedDurations(prev => ({...prev, [offerId]: duration}));
  };
  
  return (
    <div className="bg-primary/5 rounded-lg p-6 mt-12 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Rejoignez le réseau professionnel CBD Connect</h2>
      
      <div className="grid grid-cols-1 max-w-xl mx-auto">
        {subscriptionOffers.map(offer => (
          <PartnerOfferCard
            key={offer.id}
            offer={offer}
            selectedDuration={selectedDurations[offer.id as keyof typeof selectedDurations]}
            onSelectDuration={(duration) => handleSelectDuration(offer.id, duration)}
            isPremium={false}
          />
        ))}
      </div>
    </div>
  );
};

export default PartnerSubscriptionOffers;
