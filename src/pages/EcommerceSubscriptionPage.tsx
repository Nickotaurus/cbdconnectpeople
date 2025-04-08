import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Award, Link, Search, MessageSquare, FileText, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const subscriptionFormSchema = z.object({
  duration: z.enum(["1", "2"], {
    required_error: "Veuillez sélectionner une durée",
  }),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

const EcommerceSubscriptionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [selectedDurations, setSelectedDurations] = useState({
    essential: "1",
    premium: "1"
  });

  const handleSelectDuration = (offerId: string, duration: string) => {
    setSelectedDurations(prev => ({
      ...prev,
      [offerId]: duration
    }));
  };

  const handleSubscribe = (offer: string, offerId: string) => {
    const duration = selectedDurations[offerId as keyof typeof selectedDurations];
    setSelectedOffer(offer);
    toast({
      title: "Offre sélectionnée",
      description: `Vous avez choisi l'${offer} pour ${duration} an${duration === "2" ? "s" : ""}. Complétez votre inscription pour finaliser.`,
      duration: 5000,
    });
  };

  const redirectToSignup = () => {
    if (selectedOffer) {
      const offerId = selectedOffer.includes("Visibilité Essentielle") ? "essential" : "premium";
      const duration = selectedDurations[offerId as keyof typeof selectedDurations];
      navigate(`/register?role=store&type=ecommerce&offer=${encodeURIComponent(selectedOffer)}&duration=${duration}`);
    }
  };

  const offers = [
    {
      id: "essential",
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
        "Augmentez vos avis Google grâce au jeu CBD Quest"
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
        "Accès au catalogue d'envoi d'offres spéciales vers clients/boutiques",
        "Un article sponsorisé avec lien retour vers votre site"
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
              Boostez la visibilité de votre e-commerce CBD !
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez notre plateforme et profitez de nombreux avantages pour augmenter vos ventes 
              et développer votre réseau.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi référencer votre site e-commerce ?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les avantages exclusifs de notre plateforme dédiée aux e-commerçants CBD
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <Search className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visibilité Ciblée</h3>
            <p className="text-muted-foreground">
              Accédez à une audience qualifiée, intéressée par vos produits CBD
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <Link className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">SEO Optimisé</h3>
            <p className="text-muted-foreground">
              Obtenez un backlink de qualité vers votre site et améliorez votre référencement
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <MessageSquare className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Réseau Professionnel</h3>
            <p className="text-muted-foreground">
              Connectez-vous avec d'autres acteurs du CBD et développez votre réseau B2B
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <FileText className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Contenu Exclusif</h3>
            <p className="text-muted-foreground">
              Accédez à du contenu premium et à la possibilité de publier des articles sponsorisés
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <Star className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Plus d'Avis</h3>
            <p className="text-muted-foreground">
              Augmentez vos avis Google grâce au jeu CBD Quest et améliorez votre e-réputation
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm">
            <ArrowRight className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trafic Qualifié</h3>
            <p className="text-muted-foreground">
              Redirigez des visiteurs intéressés vers votre boutique en ligne
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="container mx-auto px-4 py-12 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos offres de référencement</h2>
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
                      Référencement pour votre e-commerce CBD
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
                      -{offer.prices.savings}€
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
                      Économisez {offer.prices.savings}€ et assurez une visibilité prolongée pour votre e-commerce.
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
                        <li>Créer un compte e-commerçant</li>
                        <li>Renseigner les informations de votre site</li>
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
                        handleSubscribe(offer.name, offer.id);
                        redirectToSignup();
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
      
      {/* CTA Section */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à booster votre e-commerce CBD ?</h2>
            <p className="text-lg mb-8">
              Choisissez l'offre qui correspond à vos besoins et bénéficiez de la visibilité 
              et des outils pour développer votre activité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  setSelectedOffer(offers[0].name);
                  navigate('/register?role=store&type=ecommerce&offer=' + encodeURIComponent(offers[0].name) + '&duration=' + selectedDurations.essential);
                }}
                className="gap-2"
              >
                Souscrire à l'Offre Essentielle
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  setSelectedOffer(offers[1].name);
                  navigate('/register?role=store&type=ecommerce&offer=' + encodeURIComponent(offers[1].name) + '&duration=' + selectedDurations.premium);
                }}
                className="gap-2"
              >
                Souscrire à l'Offre Premium
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceSubscriptionPage;
