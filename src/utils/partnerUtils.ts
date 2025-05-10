import { PartnerCategory } from "@/types/auth";
import { partnerCategories } from "@/data/partnerCategoriesData";
import { Partner } from "@/types/partners/partner";

// Get category label based on the category value
export const getCategoryLabel = (categoryValue: PartnerCategory) => {
  const category = partnerCategories.find(c => c.value === categoryValue);
  return category ? category.label : categoryValue;
};

// Get category icon name based on the category value
export const getCategoryIconName = (categoryValue: PartnerCategory): string => {
  const category = partnerCategories.find(c => c.value === categoryValue);
  if (!category) return "Briefcase";
  
  return category.iconName || "Briefcase";
};

// Filter partners based on search term and category
export const filterPartners = (partners: Partner[], searchTerm: string, category: string) => {
  console.log("Filtering partners:", partners.length, "with search:", searchTerm, "and category:", category);
  
  let filtered = [...partners];
  
  if (searchTerm.trim()) {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    console.log("Normalizing search term:", normalizedSearchTerm);
    
    filtered = filtered.filter(partner => {
      const nameMatch = partner.name.toLowerCase().includes(normalizedSearchTerm);
      const locationMatch = partner.location.toLowerCase().includes(normalizedSearchTerm);
      const descMatch = partner.description.toLowerCase().includes(normalizedSearchTerm);
      
      return nameMatch || locationMatch || descMatch;
    });
    
    console.log("After search filtering:", filtered.length, "partners remain");
  }
  
  if (category !== 'all') {
    console.log("Filtering by category:", category);
    filtered = filtered.filter(partner => {
      const categoryMatch = partner.category === category;
      if (categoryMatch) {
        console.log("Partner matches category:", partner.name, partner.category);
      }
      return categoryMatch;
    });
    
    console.log("After category filtering:", filtered.length, "partners remain");
  }
  
  return filtered;
};
