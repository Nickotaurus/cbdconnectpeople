
import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Store, Users } from "lucide-react";
import ProfileCard from "../cards/ProfileCard";

const ProfilesSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <ProfileCard
        icon={<Users className="h-12 w-12 text-primary" />}
        title="Je suis un Client"
        description={[
          "Trouves facilement un cbd shop",
          "Gardes en mémoire tes boutiques et produits CBD préférés",
          "Gagnes des tickets pour la loterie et débloques des avantages exclusifs en jouant à \"CBD Quest\" !",
        ]}
        primaryAction={() => navigate("/register?role=client")}
        primaryLabel="S'inscrire"
      />

      <ProfileCard
        icon={<Store className="h-12 w-12 text-primary" />}
        title="Je suis une Boutique"
        description="Référencez gratuitement votre boutique physique ou inscrivez votre site e-commerce pour gagner en visibilité"
        primaryAction={() => navigate("/register?role=store")}
        primaryLabel="Référencer ma boutique"
        banner="Gratuit pour les boutiques physiques"
      />

      <ProfileCard
        icon={<Briefcase className="h-12 w-12 text-primary" />}
        title="Je suis un Partenaire"
        description="Proposez vos services et connectez-vous avec les acteurs du CBD"
        primaryAction={() => navigate("/register?role=partner")}
        primaryLabel="Devenir partenaire"
        banner="Avocats, comptables, banques, assurances..."
      />
    </div>
  );
};

export default ProfilesSection;
