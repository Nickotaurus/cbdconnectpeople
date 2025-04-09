
import { PartnerCategory } from "@/types/auth";
import { partnerCategories } from "@/data/partnerCategoriesData";
import { Building, Calculator, Briefcase, Shield, Package, Users, Tag } from "lucide-react";
import React from "react";

// Get category label based on the category value
export const getCategoryLabel = (categoryValue: PartnerCategory) => {
  const category = partnerCategories.find(c => c.value === categoryValue);
  return category ? category.label : categoryValue;
};

// Get category icon based on the category value
export const getCategoryIcon = (categoryValue: PartnerCategory) => {
  const category = partnerCategories.find(c => c.value === categoryValue);
  if (!category) return <Briefcase size={16} />;
  
  switch (category.iconName) {
    case "Building":
      return <Building size={16} />;
    case "Calculator":
      return <Calculator size={16} />;
    case "Briefcase":
      return <Briefcase size={16} />;
    case "Shield":
      return <Shield size={16} />;
    case "Package":
      return <Package size={16} />;
    case "Users":
      return <Users size={16} />;
    case "Tag":
      return <Tag size={16} />;
    default:
      return <Briefcase size={16} />;
  }
};

// Filter partners based on search term and category
export const filterPartners = (partners, searchTerm, category) => {
  let filtered = partners;
  
  if (searchTerm.trim()) {
    filtered = filtered.filter(
      partner => 
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (category !== 'all') {
    filtered = filtered.filter(partner => partner.category === category);
  }
  
  return filtered;
};
