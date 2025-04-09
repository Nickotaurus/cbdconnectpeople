
import { PartnerCategory } from "@/types/auth";
import { partnerCategories } from "@/data/partnerCategoriesData";
import { Briefcase } from "lucide-react";

// Get category label based on the category value
export const getCategoryLabel = (categoryValue: PartnerCategory) => {
  const category = partnerCategories.find(c => c.value === categoryValue);
  return category ? category.label : categoryValue;
};

// Get category icon based on the category value
export const getCategoryIcon = (categoryValue: PartnerCategory) => {
  const category = partnerCategories.find(c => c.value === categoryValue);
  return category ? category.icon : <Briefcase className="h-4 w-4" />;
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
