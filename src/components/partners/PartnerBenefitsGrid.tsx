
import React from 'react';
import { Search, Link, MessageSquare, FileText, Star, ArrowRight } from 'lucide-react';

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

const PartnerBenefitsGrid = () => {
  return (
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
  );
};

export default PartnerBenefitsGrid;
