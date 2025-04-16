
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { Product, ProductCategory } from '@/types/product';
import { useAuth } from '@/contexts/auth';
import { mockProductCategories, getProductsByCategory } from '@/data/productsData';
import { useToast } from '@/components/ui/use-toast';

// Type pour le CbdProduct (utilisé dans les composants)
export type CbdProduct = Product;

interface ProductsContextType {
  categories: ProductCategory[];
  selectedProducts: string[];
  toggleProduct: (productId: string) => void;
  savePreferences: () => Promise<void>;
  handleToggleProduct: (productId: string) => void;
  handleSave: () => Promise<void>;
  isValid: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories] = useState<ProductCategory[]>(mockProductCategories);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  
  // Variable pour déterminer si la sélection est valide (min 3 produits)
  const isValid = selectedProducts.length >= 3;

  useEffect(() => {
    // Initialiser les produits sélectionnés à partir des préférences utilisateur
    if (user && user.favoriteProducts) {
      setSelectedProducts(user.favoriteProducts);
    }
  }, [user]);

  // Fonction pour basculer la sélection d'un produit
  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Alias pour la fonction toggleProduct pour la compatibilité des composants
  const handleToggleProduct = toggleProduct;

  // Fonction pour sauvegarder les préférences
  const savePreferences = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer vos préférences.",
        variant: "destructive",
      });
      return;
    }

    if (selectedProducts.length < 3) {
      toast({
        title: "Sélection insuffisante",
        description: "Veuillez sélectionner au moins 3 produits.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUserPreferences({ favoriteProducts: selectedProducts });
      toast({
        title: "Préférences enregistrées",
        description: "Vos préférences de produits ont été mises à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos préférences.",
        variant: "destructive",
      });
    }
  };

  // Alias pour la fonction savePreferences pour la compatibilité des composants
  const handleSave = savePreferences;

  const value: ProductsContextType = {
    categories,
    selectedProducts,
    toggleProduct,
    savePreferences,
    handleToggleProduct,
    handleSave,
    isValid
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

// Réexporter la fonction getProductsByCategory pour la compatibilité des composants
export { getProductsByCategory };
