
import { Trophy } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-amber-100 dark:from-primary/20 dark:to-amber-900/20 rounded-xl p-8 mb-10">
      <div className="text-center">
        <div className="inline-block p-4 bg-white dark:bg-black rounded-full shadow-lg mb-4">
          <Trophy className="h-12 w-12 text-amber-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Classement CBD</h1>
        <p className="text-muted-foreground max-w-xl mx-auto mb-4">
          Découvrez les meilleurs produits, boutiques et sites CBD en France, sélectionnés par notre communauté
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
