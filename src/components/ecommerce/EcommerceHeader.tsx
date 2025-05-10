
import React from 'react';

interface EcommerceHeaderProps {
  title: string;
  subtitle: string;
}

const EcommerceHeader: React.FC<EcommerceHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-6">
        {subtitle}
      </p>
    </div>
  );
};

export default EcommerceHeader;
