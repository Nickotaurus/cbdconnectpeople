
import React from "react";
import { 
  Building, 
  Calculator, 
  Briefcase, 
  Shield, 
  Package, 
  Users, 
  Tag,
  LucideIcon
} from "lucide-react";
import { PartnerCategory } from "@/types/auth";
import { getCategoryIconName } from "@/utils/partnerUtils";

interface PartnerIconProps {
  category: PartnerCategory;
  size?: number;
}

export const PartnerIcon: React.FC<PartnerIconProps> = ({ 
  category,
  size = 16 
}) => {
  const iconName = getCategoryIconName(category);
  
  switch (iconName) {
    case "Building":
      return <Building size={size} />;
    case "Calculator":
      return <Calculator size={size} />;
    case "Briefcase":
      return <Briefcase size={size} />;
    case "Shield":
      return <Shield size={size} />;
    case "Package":
      return <Package size={size} />;
    case "Users":
      return <Users size={size} />;
    case "Tag":
      return <Tag size={size} />;
    default:
      return <Briefcase size={size} />;
  }
};
