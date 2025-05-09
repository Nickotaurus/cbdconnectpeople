
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SponsorshipCTA = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 mt-8 bg-primary/5 border-primary/10">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">Rejoignez notre réseau professionnel</h3>
        <p className="mb-4">
          Connectez-vous avec d'autres professionnels du CBD pour partager des conseils
          et des opportunités.
        </p>
        <Button onClick={() => navigate("/register")} className="mt-2">
          Inscrivez-vous gratuitement
        </Button>
      </div>
    </Card>
  );
};

export default SponsorshipCTA;
