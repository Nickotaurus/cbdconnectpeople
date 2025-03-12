import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/auth";
import { ArrowRight, Store, Users, Briefcase, Trophy, Star, MessageSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ProfileContent {
  title: string;
  points: string[];
  icon: React.ReactNode;
}

const profileContents: Record<UserRole, ProfileContent> = {
  client: {
    title: "Trouvez facilement votre CBD et échangez avec la communauté !",
    points: [
      "Accédez aux meilleures boutiques près de chez vous",
      "Profitez d'offres exclusives et de réductions",
      "Lisez et laissez des avis pour partager votre expérience",
      "Participez aux discussions et obtenez des conseils !"
    ],
    icon: <Users className="h-12 w-12" />
  },
  store: {
    title: "Augmentez votre visibilité et fidélisez vos clients !",
    points: [
      "Référencez votre boutique gratuitement",
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
  }
};

interface BadgeInfo {
  name: string;
  requirement: string;
  icon: React.ReactNode;
}

const badges: BadgeInfo[] = [
  { name: "Débutant", requirement: "Inscription sur la plateforme", icon: <Trophy className="h-4 w-4" /> },
  { name: "Explorateur", requirement: "1er avis laissé", icon: <Star className="h-4 w-4" /> },
  { name: "Ambassadeur", requirement: "Participation active aux discussions", icon: <MessageSquare className="h-4 w-4" /> },
  { name: "Expert CBD", requirement: "Contributions régulières et reconnues par la communauté", icon: <Star className="h-4 w-4" /> }
];

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
              Rejoignez CBD Connect World et connectez-vous à la communauté !
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

      {/* Badge System Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Progressez et devenez un expert CBD !
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center bg-muted/30 p-6 rounded-lg border border-primary/10">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    {badge.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{badge.name}</h3>
                  <Badge variant="outline" className="mb-2">Niveau {index + 1}</Badge>
                  <p className="text-sm text-muted-foreground text-center">{badge.requirement}</p>
                </div>
              ))}
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
