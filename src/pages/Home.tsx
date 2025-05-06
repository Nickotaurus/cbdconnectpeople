
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import NewsSection from '@/components/home/NewsSection';
import ProfilesSection from '@/components/home/ProfilesSection';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection 
        logoSrc="/lovable-uploads/553fc45c-9d08-41b8-abd8-7cceb445942c.png"
        tagline="Connectez-vous avec l'écosystème CBD"
      />
      <FeaturesSection />
      <NewsSection />
      <ProfilesSection />
    </div>
  );
};

export default Home;
