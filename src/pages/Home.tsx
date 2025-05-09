
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import NewsSection from '@/components/home/NewsSection';
import ProfilesSection from '@/components/home/ProfilesSection';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection 
        logoSrc="/lovable-uploads/553fc45c-9d08-41b8-abd8-7cceb445942c.png"
        tagline="Rejoignez la première communauté dédiée aux professionnels du CBD : trouvez des partenaires fiables, accédez à des ressources exclusives et développez votre activité plus vite — inscription gratuite !"
      />
      <FeaturesSection />
      <NewsSection />
      <ProfilesSection />
    </div>
  );
};

export default Home;
