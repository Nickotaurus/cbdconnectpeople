
import React from "react";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard = ({
  icon,
  title,
  description,
  onClick,
}: FeatureCardProps) => (
  <div
    className="bg-primary/5 rounded-lg p-4 flex flex-col items-center text-center hover:bg-primary/10 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default FeatureCard;
