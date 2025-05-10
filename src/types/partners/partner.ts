
import { PartnerCategory } from "@/types/auth";

/**
 * Partner interface for partner data across the application
 */
export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  location: string;
  description: string;
  certifications: string[];
  distance: number;
  imageUrl: string;
}

export interface UsePartnersResult {
  partnerProfiles: Partner[];
  filteredPartners: Partner[];
  isLoading: boolean;
  error: string | null;
  useTestData: boolean;
}
