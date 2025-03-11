
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/auth";
import { ArrowRight, Store, Users, Briefcase, Leaf } from 'lucide-react';

interface ProfileContent {
  title: string;
  points: string[];
  icon: React.ReactNode;
}

const profileContents: Record<UserRole, ProfileContent> = {
  client: {
    title: "Trouvez facilement votre CBD de qualité !",
    points: [
      "Accédez aux meilleures boutiques près de chez vous",
      "Profitez d'offres exclusives et de réductions",
      "Lisez et laissez des avis pour guider la communauté"
    ],
    icon: <Users className="h-12 w-12" />
  },
  store: {
    title: "Augmentez votre visibilité et attirez plus de clients !",
    points: [
      "Référencez votre boutique gratuitement",
      "Gérez vos avis et améliorez votre réputation",
      "Accédez à un réseau de producteurs de confiance"
    ],
    icon: <Store className="h-12 w-12" />
  },
  producer: {
    title: "Développez votre réseau et trouvez des partenaires !",
    points: [
      "Soyez visible auprès des boutiques intéressées",
      "Mettez en avant votre savoir-faire et vos produits",
      "Recevez des demandes de collaboration en direct"
    ],
    icon: <Leaf className="h-12 w-12" />
  },
  partner: {
    title: "Connectez-vous avec les acteurs du CBD !",
    points: [
      "Accédez à un marché en pleine croissance",
      "Développez votre réseau professionnel",
      "Soyez référencé dans notre annuaire exclusif"
    ],
    icon: <Briefcase className="h-12 w-12" />
  }
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileType, setProfileType] = useState<UserRole>('client');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role') as UserRole;
    if (role && Object.keys(profileContents).includes(role)) {
      setProfileType(role);
    }
  }, [location]);

  const content = profileContents[profileType];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 lg:pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rejoignez CBD Connect World !
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Profitez d'une inscription gratuite et découvrez tous les avantages adaptés à votre profil.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/register?role=' + profileType)}
              className="gap-2"
            >
              Créer mon compte gratuitement
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Content Section */}
      <div className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              {content.icon}
              <h2 className="text-3xl font-bold mt-6 mb-8">{content.title}</h2>
              <ul className="space-y-4">
                {content.points.map((point, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 text-left p-4 bg-background rounded-lg shadow-sm"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-lg">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Prêt à rejoindre la communauté ?
          </h2>
          <Button
            size="lg"
            onClick={() => navigate('/register?role=' + profileType)}
            className="gap-2"
          >
            Créer mon compte maintenant
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
