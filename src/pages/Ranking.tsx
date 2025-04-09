
import { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { rankings } from '@/data/rankingsData';
import HeroSection from '@/components/ranking/HeroSection';
import CategoryTabs from '@/components/ranking/CategoryTabs';
import RankingList from '@/components/ranking/RankingList';
import SponsorshipCTA from '@/components/ranking/SponsorshipCTA';

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState<string>(rankings[0].id);
  
  // Get the current ranking category
  const currentRanking = rankings.find(r => r.id === activeTab) || rankings[0];
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="relative">
        {/* Hero Section with Gradient Background */}
        <HeroSection />
        
        {/* Category Tabs */}
        <Tabs defaultValue={rankings[0].id} onValueChange={setActiveTab} className="w-full mb-8">
          <CategoryTabs categories={rankings} />
          
          {/* Ranking Items */}
          <RankingList currentRanking={currentRanking} />
        </Tabs>
        
        {/* Sponsorship CTA */}
        <SponsorshipCTA />
      </div>
    </div>
  );
};

export default RankingPage;
