import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/auth";
import { ArrowRight, Store, Briefcase, Sprout } from 'lucide-react';

interface ProfileContent {
  title: string;
  points: string[];
  icon: React.ReactNode;
}

const profileContents: Record<Exclude<UserRole, 'client'>, ProfileContent> = {
  store: {
    title: "Augmentez votre visibilité et fidélisez vos clients !",
    points: [
      "Référencez votre boutique physique gratuitement",
      "Ou inscrivez votre site e-commerce (30€/an ou 50€/2ans)",
      "Offrez des réductions pour attirer plus de clients",
      "Gérez vos avis et améliorez votre réputation",
      "Accédez à un réseau de partenaires et fournisseurs fiables"
    ],
    icon: <Store className="h-12 w-12" />
  },
  partner: {
    title: "Connectez-vous avec les acteurs du CBD et développez votre activité !",
    points: [
      "Accédez à un marché en pleine croissance",
      "Développez votre réseau professionnel",
      "Soyez référencé dans notre annuaire exclusif",
      "Proposez vos services aux membres de la communauté",
      "Inclut désormais : producteurs, banques, comptables, juristes, assurances, logistique, breeders, labels, associations, médias, laboratoires, agences immobilières"
    ],
    icon: <Briefcase className="h-12 w-12" />
  },
  admin: {
    title: "Gérez la plateforme et supervisez les activités !",
    points: [
      "Administrez les utilisateurs et leurs profils",
      "Validez les boutiques et les partenaires",
      "Gérez le contenu et les fonctionnalités de la plateforme",
      "Accédez aux statistiques et aux rapports"
    ],
    icon: <Sprout className="h-12 w-12" />
  }
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileType, setProfileType] = useState<Exclude<UserRole, 'client'>>('store');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role') as Exclude<UserRole, 'client'>;
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
              Rejoignez CBD Connect People et connectez-vous à la communauté !
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Inscrivez-vous gratuitement et échangez avec les acteurs du CBD !
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
      <div className="py-16 bg-muted/50">
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
