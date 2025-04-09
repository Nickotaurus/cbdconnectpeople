
import React from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewsSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-12 text-center">
      <div className="flex items-center justify-center mb-4 gap-2">
        <Newspaper className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Actualités du CBD</h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Restez informé des dernières actualités et tendances du monde du CBD
      </p>
      <Button variant="outline" onClick={() => navigate("/news")}>
        <Newspaper className="h-4 w-4 mr-2" />
        Voir les actualités
      </Button>
    </div>
  );
};

export default NewsSection;
