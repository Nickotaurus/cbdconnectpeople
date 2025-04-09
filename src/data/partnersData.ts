
import { PartnerCategory } from "@/types/auth";

// Mock data for partners
export const mockPartners = [
  {
    id: "p1",
    name: "Chanvre des Alpes",
    category: "production" as PartnerCategory,
    location: "Grenoble, France",
    description: "Producteur de chanvre biologique dans les Alpes françaises. Culture en extérieur avec méthodes traditionnelles.",
    certifications: ["Bio", "Sans pesticides"],
    distance: 120,
    imageUrl: "https://images.unsplash.com/photo-1589244159943-460088ed5c83?q=80&w=1000",
  },
  {
    id: "p2",
    name: "Green Comptabilité",
    category: "accountant" as PartnerCategory,
    location: "Paris, France",
    description: "Cabinet comptable spécialisé dans les entreprises du secteur du CBD et du chanvre.",
    certifications: ["Expertise CBD", "Agréé"],
    distance: 245,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000",
  },
  {
    id: "p3",
    name: "CannaBanque",
    category: "bank" as PartnerCategory,
    location: "Lyon, France",
    description: "Services bancaires adaptés aux professionnels du CBD avec des solutions de paiement spécifiques.",
    certifications: ["Fintech", "Sécurisé"],
    distance: 78,
    imageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=1000",
  },
  {
    id: "p4",
    name: "CBD Juridique",
    category: "legal" as PartnerCategory,
    location: "Bordeaux, France",
    description: "Cabinet d'avocats spécialisé dans la réglementation du CBD et du cannabis en France et en Europe.",
    certifications: ["Droit Commercial", "Expert CBD"],
    distance: 180,
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000",
  },
  {
    id: "p5",
    name: "CBD Quality Lab",
    category: "laboratory" as PartnerCategory,
    location: "Toulouse, France",
    description: "Laboratoire d'analyses spécialisé dans le contrôle qualité des produits CBD et chanvre.",
    certifications: ["ISO 9001", "Accrédité"],
    distance: 210,
    imageUrl: "https://images.unsplash.com/photo-1587613981449-fcd95a7d28fd?q=80&w=1000",
  },
];

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
