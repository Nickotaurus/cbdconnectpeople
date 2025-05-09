import { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { rankings } from '@/data/rankingsData';
import HeroSection from '@/components/ranking/HeroSection';
import CategoryTabs from '@/components/ranking/CategoryTabs';
import RankingList from '@/components/ranking/RankingList';
import SponsorshipCTA from '@/components/ranking/SponsorshipCTA';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState<string>(rankings[0].id);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get the current ranking category
  const currentRanking = rankings.find(r => r.id === activeTab) || rankings[0];
  
  // Only show SponsorshipCTA if user is not logged in or is not a client
  const showSponsorshipCTA = !user || user.role !== 'client';
  
  // The ranking functionality has been simplified but keeping the structure
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Rejoignez notre réseau professionnel CBD</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            La fonctionnalité de classement a été remplacée par un réseau d'entraide entre professionnels du CBD.
            Rejoignez-nous pour connecter avec d'autres acteurs du secteur, accéder à des ressources 
            et à la cartographie des boutiques et partenaires.
          </p>
          <Button onClick={() => navigate("/register")}>
            S'inscrire gratuitement
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingPage;
