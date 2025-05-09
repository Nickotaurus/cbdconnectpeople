
import React from "react";
import { useNavigate } from "react-router-dom";
import { Store, Briefcase } from "lucide-react";
import ProfileCard from "../cards/ProfileCard";

const ProfilesSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <ProfileCard
        icon={<Store className="h-12 w-12 text-primary" />}
        title="Je suis une Boutique CBD"
        description="Référencez gratuitement votre boutique physique ou inscrivez votre site e-commerce pour gagner en visibilité et rejoindre notre réseau professionnel"
        primaryAction={() => navigate("/register?role=store")}
        primaryLabel="Référencer ma boutique"
        banner="Rejoignez notre réseau professionnel"
      />

      <ProfileCard
        icon={<Briefcase className="h-12 w-12 text-primary" />}
        title="Je suis un Partenaire"
        description="Proposez vos services aux boutiques de CBD et connectez-vous avec les acteurs du secteur (avocats, comptables, banques, assurances...)"
        primaryAction={() => navigate("/register?role=partner")}
        primaryLabel="Devenir partenaire"
        banner="Avocats, comptables, banques, assurances..."
      />
    </div>
  );
};

export default ProfilesSection;
