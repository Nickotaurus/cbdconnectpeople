
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Award, Link, Search, MessageSquare, FileText, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { subscriptionPlans } from '@/data/subscriptionData';

const PartnersSubscriptionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [selectedDurations, setSelectedDurations] = useState({
    basic: "1",
    premium: "1",
    ultimate: "1"
  });

  const handleSelectDuration = (offerId: string, duration: string) => {
    setSelectedDurations(prev => ({
      ...prev,
      [offerId]: duration
    }));
  };

  const handleSubscribe = (plan: any) => {
    const duration = selectedDurations[plan.id as keyof typeof selectedDurations];
    setSelectedOffer(plan.name);
    toast({
      title: "Offre sélectionnée",
      description: `Vous avez choisi l'offre ${plan.name} pour ${duration} an${duration === "2" ? "s" : ""}. Complétez votre inscription pour finaliser.`,
      duration: 5000,
    });
  };

  const redirectToSignup = (plan: any) => {
    if (plan) {
      const duration = selectedDurations[plan.id as keyof typeof selectedDurations];
      navigate(`/register?role=partner&offer=${encodeURIComponent(plan.name)}&duration=${duration}`);
    }
  };

  // Benefits sections
  const benefits = [
    {
      icon: <Search className="h-10 w-10 text-primary mb-4" />,
      title: "Visibilité Ciblée",
      description: "Accédez à une audience qualifiée, intéressée par vos services professionnels"
    },
    {
      icon: <Link className="h-10 w-10 text-primary mb-4" />,
      title: "SEO Optimisé",
      description: "Obtenez un backlink de qualité vers votre site et améliorez votre référencement"
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary mb-4" />,
      title: "Réseau Professionnel",
      description: "Connectez-vous avec les acteurs du CBD et développez votre réseau B2B"
    },
    {
      icon: <FileText className="h-10 w-10 text-primary mb-4" />,
      title: "Contenu Exclusif",
      description: "Accédez à du contenu premium et publiez des articles sponsorisés"
    },
    {
      icon: <Star className="h-10 w-10 text-primary mb-4" />,
      title: "Plus de Notoriété",
      description: "Augmentez votre e-réputation et votre crédibilité dans l'industrie du CBD"
    },
    {
      icon: <ArrowRight className="h-10 w-10 text-primary mb-4" />,
      title: "Contacts Qualifiés",
      description: "Recevez des demandes de contact directement de prospects intéressés"
    }
  ];

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
      <div className="relative pt-24 pb-12 lg:pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rejoignez le réseau de partenaires professionnels CBD Connect
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Développez votre activité avec une visibilité accrue auprès des professionnels et des consommateurs du CBD
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi devenir partenaire ?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les avantages exclusifs de notre plateforme dédiée aux professionnels du CBD
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
              {benefit.icon}
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

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
            <Card key={offer.id} className="overflow-visible">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {offer.icon}
                  <div>
                    <CardTitle>{offer.name}</CardTitle>
                    <CardDescription>
                      Référencement pour votre société partenaire CBD
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 mb-6">
                  <div 
                    className={`cursor-pointer flex-1 text-center px-4 py-3 rounded-lg border ${
                      selectedDurations[offer.id] === "1" 
                        ? "border-primary bg-primary/10" 
                        : "border-muted bg-muted/50"
                    }`}
                    onClick={() => setSelectedDurations(prev => ({...prev, [offer.id]: "1"}))}
                  >
                    <p className="font-medium">1 An</p>
                    <p className="text-lg font-bold mt-1">{offer.prices.yearly}€</p>
                  </div>
                  
                  <div 
                    className={`cursor-pointer flex-1 text-center px-4 py-3 rounded-lg border relative overflow-hidden ${
                      selectedDurations[offer.id] === "2" 
                        ? "border-primary bg-primary/10" 
                        : "border-muted bg-muted/50"
                    }`}
                    onClick={() => setSelectedDurations(prev => ({...prev, [offer.id]: "2"}))}
                  >
                    <div className="absolute -right-7 -top-1 bg-primary text-primary-foreground px-8 py-0.5 text-xs rotate-45">
                      -{offer.savings}€
                    </div>
                    <p className="font-medium">2 Ans</p>
                    <p className="text-lg font-bold mt-1">{offer.prices.biennial}€</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      au lieu de {offer.prices.yearly * 2}€
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Ce que vous obtenez :</h4>
                  <ul className="space-y-2">
                    {offer.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="mt-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 bg-muted/30 p-3 rounded-lg mt-4">
                    <p className="text-sm">
                      <strong>Pourquoi choisir 2 ans ? </strong>
                      Économisez {offer.savings}€ et assurez une visibilité prolongée pour votre entreprise.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      Souscrire à cette offre
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Confirmer votre choix</DialogTitle>
                      <DialogDescription>
                        Vous avez sélectionné : {offer.name} pour {selectedDurations[offer.id]} an{selectedDurations[offer.id] === "2" ? "s" : ""}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="mb-2">
                        Pour finaliser votre inscription et bénéficier de cette offre, vous devez :
                      </p>
                      <ol className="list-decimal pl-4 space-y-2">
                        <li>Créer un compte partenaire</li>
                        <li>Renseigner les informations de votre entreprise</li>
                        <li>Procéder au paiement</li>
                      </ol>
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium">Montant total : {selectedDurations[offer.id] === "1" ? offer.prices.yearly : offer.prices.biennial}€</p>
                      </div>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                      <DialogTrigger asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogTrigger>
                      <Button onClick={() => {
                        handleSubscribe(offer);
                        redirectToSignup(offer);
                      }}>
                        Continuer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersSubscriptionPage;
