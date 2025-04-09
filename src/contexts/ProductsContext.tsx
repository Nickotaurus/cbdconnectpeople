
import { createContext, useState, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { ClientUser } from '@/types/auth';

interface ProductsContextProps {
  selectedProducts: string[];
  handleToggleProduct: (productId: string) => void;
  handleSave: () => Promise<void>;
  isValid: boolean;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export interface CbdProduct {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  description: string;
}

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    clientUser?.favoriteProducts || []
  );
  
  const handleToggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  const handleSave = async () => {
    try {
      if (selectedProducts.length < 3) {
        toast({
          title: "Sélection insuffisante",
          description: "Veuillez sélectionner au moins 3 produits",
          variant: "destructive",
        });
        return;
      }
      
      await updateUserPreferences({ favoriteProducts: selectedProducts });
      
      toast({
        title: "Préférences enregistrées",
        description: "Vos produits favoris ont été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences",
        variant: "destructive",
      });
    }
  };
  
  const value = {
    selectedProducts,
    handleToggleProduct,
    handleSave,
    isValid: selectedProducts.length >= 3
  };
  
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

// Export products data to be used by components
export const cbdProducts: CbdProduct[] = [
  // FLEURS
  { id: "f1", name: "Fleur CBD Indoor Amnesia", category: "Fleurs", subCategory: "Indoor", description: "Fleur cultivée en intérieur, qualité premium" },
  { id: "f2", name: "Fleur CBD Indoor Strawberry", category: "Fleurs", subCategory: "Indoor", description: "Fleur cultivée en intérieur, qualité premium" },
  { id: "f3", name: "Fleur CBD Indoor Lemon Haze", category: "Fleurs", subCategory: "Indoor", description: "Fleur cultivée en intérieur, qualité premium" },
  { id: "f4", name: "Fleur CBD Outdoor Critical", category: "Fleurs", subCategory: "Outdoor", description: "Fleur cultivée en extérieur, culture naturelle" },
  { id: "f5", name: "Fleur CBD Outdoor Super Silver", category: "Fleurs", subCategory: "Outdoor", description: "Fleur cultivée en extérieur, culture naturelle" },
  
  // RÉSINES
  { id: "r1", name: "Résine CBD Grasse Maroc Gold", category: "Résines", subCategory: "Grasse", description: "Résine souple et aromatique" },
  { id: "r2", name: "Résine CBD Grasse Afghan", category: "Résines", subCategory: "Grasse", description: "Résine souple et aromatique" },
  { id: "r3", name: "Résine CBD Sèche Népalaise", category: "Résines", subCategory: "Sèche", description: "Résine friable et concentrée" },
  { id: "r4", name: "Résine CBD Sèche Lebanese", category: "Résines", subCategory: "Sèche", description: "Résine friable et concentrée" },
  
  // CONCENTRÉS
  { id: "c1", name: "CBD Wax Full Spectrum", category: "Concentrés", subCategory: "Wax", description: "Concentré de haute pureté" },
  { id: "c2", name: "CBD Crumble 99%", category: "Concentrés", subCategory: "Crumble", description: "Texture friable et facile à doser" },
  { id: "c3", name: "CBD Shatter Transparent", category: "Concentrés", subCategory: "Shatter", description: "Texture cassante et cristalline" },
  { id: "c4", name: "CBD Isolat Pur", category: "Concentrés", subCategory: "Isolats", description: "99% de pureté, sans terpènes" },
  
  // TERPÈNES
  { id: "t1", name: "Terpènes CBD Citron", category: "Terpènes", subCategory: "Citron", description: "Arômes d'agrumes frais" },
  { id: "t2", name: "Terpènes CBD Pin", category: "Terpènes", subCategory: "Pin", description: "Arômes boisés et résineux" },
  { id: "t3", name: "Terpènes CBD Lavande", category: "Terpènes", subCategory: "Lavande", description: "Arômes floraux et apaisants" },
  { id: "t4", name: "Terpènes CBD Poivre", category: "Terpènes", subCategory: "Poivre", description: "Arômes épicés et chauds" },
  { id: "t5", name: "Terpènes CBD Fuel", category: "Terpènes", subCategory: "Fuel", description: "Arômes puissants et chimiques" },
  
  // HUILES
  { id: "h1", name: "Huile CBD 10%", category: "Huiles", subCategory: "10%", description: "Huile sublinguale à spectre complet" },
  { id: "h2", name: "Huile CBD 20%", category: "Huiles", subCategory: "20%", description: "Huile sublinguale à spectre complet" },
  { id: "h3", name: "Huile CBD 30%", category: "Huiles", subCategory: "30%", description: "Huile sublinguale à spectre complet" },
  { id: "h4", name: "Huile CBD 40%", category: "Huiles", subCategory: "40%", description: "Huile sublinguale à spectre complet" },
  
  // TISANES
  { id: "ti1", name: "Tisane CBD 30%", category: "Tisanes", subCategory: "30%", description: "Infusion relaxante au CBD" },
  { id: "ti2", name: "Tisane CBD 50%", category: "Tisanes", subCategory: "50%", description: "Infusion relaxante au CBD" },
  { id: "ti3", name: "Tisane CBD 70%", category: "Tisanes", subCategory: "70%", description: "Infusion relaxante au CBD" },
  
  // THÉS
  { id: "th1", name: "Thé CBD Detox", category: "Thés", subCategory: "Detox", description: "Thé purifiant au CBD" },
  { id: "th2", name: "Thé CBD Matcha", category: "Thés", subCategory: "Matcha", description: "Thé énergisant au CBD" },
  
  // FILTRES
  { id: "fi1", name: "Filtre CBD Mousse", category: "Filtres", subCategory: "Mousse", description: "Filtre doux pour combustion" },
  { id: "fi2", name: "Filtre CBD Verre", category: "Filtres", subCategory: "Verre", description: "Filtre réutilisable premium" },
  { id: "fi3", name: "Filtre CBD Coton", category: "Filtres", subCategory: "Coton", description: "Filtre naturel biodégradable" },
  { id: "fi4", name: "Filtre CBD Charbon Actif", category: "Filtres", subCategory: "Charbon actif", description: "Filtre purifiant haute performance" },
  
  // COMESTIBLES
  { id: "g1", name: "Gummies CBD Fruits", category: "Comestibles", subCategory: "Gummies", description: "Bonbons fruités infusés au CBD" },
  { id: "g2", name: "Gélules CBD 15mg", category: "Comestibles", subCategory: "Gélules", description: "Gélules dosées précisément" },
  { id: "g3", name: "Granulés CBD", category: "Comestibles", subCategory: "Granulés", description: "Granulés à dissoudre dans l'eau" },
  
  // BOISSONS
  { id: "b1", name: "Bière CBD Artisanale", category: "Boissons", subCategory: "Bières", description: "Bière infusée au CBD" },
  { id: "b2", name: "Thé Glacé CBD Pêche", category: "Boissons", subCategory: "Thés glacés", description: "Boisson rafraîchissante au CBD" },
  { id: "b3", name: "Sirop CBD", category: "Boissons", subCategory: "Sirops", description: "Sirop à diluer dans vos boissons" },
  
  // VAPE
  { id: "v1", name: "Pods CBD Fraise", category: "Vape", subCategory: "Pods", description: "Cartouche prête à l'emploi" },
  { id: "v2", name: "E-liquide CBD 1000mg", category: "Vape", subCategory: "E-liquide", description: "Liquide pour cigarette électronique" },
  { id: "v3", name: "Puff CBD Jetable", category: "Vape", subCategory: "Puffs", description: "Vaporisateur jetable prêt à l'emploi" },
  
  // COSMÉTIQUES
  { id: "co1", name: "Patchs CBD Anti-douleur", category: "Cosmétiques", subCategory: "Patchs", description: "Application locale pour zones douloureuses" },
  { id: "co2", name: "Crème CBD Hydratante", category: "Cosmétiques", subCategory: "Crèmes", description: "Soin hydratant au CBD" },
  { id: "co3", name: "Baume CBD Musculaire", category: "Cosmétiques", subCategory: "Baumes", description: "Soin apaisant pour muscles" },
  { id: "co4", name: "Sérum CBD Anti-âge", category: "Cosmétiques", subCategory: "Sérums", description: "Soin concentré pour le visage" },
  
  // CBD POUR ANIMAUX
  { id: "a1", name: "Huile CBD pour Chiens", category: "CBD pour animaux", description: "Formule adaptée pour les chiens" },
  { id: "a2", name: "Friandises CBD pour Chats", category: "CBD pour animaux", description: "Snacks apaisants pour les chats" },
  { id: "a3", name: "Baume CBD pour Articulations Animales", category: "CBD pour animaux", description: "Soin local pour animaux âgés" }
];

// Group products by category for easier access
export const getProductsByCategory = () => {
  return cbdProducts.reduce<Record<string, CbdProduct[]>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
};
