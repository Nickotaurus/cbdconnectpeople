
import React from 'react';
import { MapPin, Users, Book } from 'lucide-react';
import FeatureCard from '../cards/FeatureCard';

const FeaturesSection = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous rejoindre ?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<MapPin className="h-10 w-10 text-primary" />}
          title="Cartographie professionnelle"
          description="Accédez à une carte complète des acteurs du CBD en France et faites-vous connaître dans votre région"
        />
        
        <FeatureCard 
          icon={<Users className="h-10 w-10 text-primary" />}
          title="Réseau d'entraide"
          description="Connectez-vous avec d'autres professionnels du CBD pour partager des conseils et des opportunités de collaboration"
        />
        
        <FeatureCard 
          icon={<Book className="h-10 w-10 text-primary" />}
          title="Ressources et formations"
          description="Accédez à des guides et formations spécialisées pour développer votre activité dans le secteur du CBD"
        />
      </div>
    </div>
  );
};

export default FeaturesSection;
