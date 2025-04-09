
import React from "react";
import { useNavigate } from "react-router-dom";
import { Award, Globe, MapPin, MessageCircle } from "lucide-react";
import FeatureCard from "../cards/FeatureCard";

const FeaturesSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      <FeatureCard
        icon={<MapPin className="h-8 w-8 text-primary" />}
        title="Boutiques"
        description="Trouvez les boutiques CBD près de chez vous"
        onClick={() => navigate("/map")}
      />
      <FeatureCard
        icon={<Globe className="h-8 w-8 text-primary" />}
        title="E-commerce"
        description="Découvrez les meilleurs sites CBD"
        onClick={() => navigate("/e-commerce")}
      />
      <FeatureCard
        icon={<MessageCircle className="h-8 w-8 text-primary" />}
        title="Annonces"
        description="Achetez, vendez et échangez"
        onClick={() => navigate("/classifieds")}
      />
      <FeatureCard
        icon={<Award className="h-8 w-8 text-primary" />}
        title="Classements"
        description="Top boutiques et produits"
        onClick={() => navigate("/ranking")}
      />
    </div>
  );
};

export default FeaturesSection;
