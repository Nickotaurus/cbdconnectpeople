
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RoleDashboardWrapper from "./RoleDashboardWrapper";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <RoleDashboardWrapper
      title="Espace Partenaire"
      description="Bienvenue dans votre espace partenaire. Depuis cet espace, vous pouvez gérer votre profil et accéder aux statistiques de visite."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-xl p-6 flex flex-col items-center">
          <h3 className="text-xl font-medium mb-3">Profil Partenaire</h3>
          <p className="text-muted-foreground text-center mb-4">
            Complétez votre profil pour augmenter votre visibilité
          </p>
          <Button onClick={() => navigate("/partner/profile")}>
            Gérer mon profil
          </Button>
        </div>
        <div className="border rounded-xl p-6 flex flex-col items-center">
          <h3 className="text-xl font-medium mb-3">Mes statistiques</h3>
          <p className="text-muted-foreground text-center mb-4">
            Consultez les statistiques de visite de votre profil
          </p>
          <Button onClick={() => navigate("/partner/stats")}>
            Voir les statistiques
          </Button>
        </div>
      </div>
    </RoleDashboardWrapper>
  );
};

export default PartnerDashboard;
