
import React from "react";

interface HeroSectionProps {
  logoSrc: string;
  tagline: string;
}

const HeroSection = ({ logoSrc, tagline }: HeroSectionProps) => {
  return (
    <div className="text-center mb-10">
      <div className="flex justify-center mb-6">
        <img src={logoSrc} alt="Logo" className="h-64 w-64" />
      </div>
      <p className="text-xl text-muted-foreground mb-10">{tagline}</p>
    </div>
  );
};

export default HeroSection;
