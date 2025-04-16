import React, { createContext, useState, useContext, useEffect } from 'react';
import { ProductCategory, Product } from '@/types/product';
import { useAuth } from '@/contexts/auth';
import { mockProductCategories } from '@/data/productsData';
import { useToast } from '@/components/ui/use-toast';

interface ProductsContextType {
  categories: ProductCategory[];
  selectedProducts: { [categoryId: string]: string[] };
  toggleProduct: (categoryId: string, productId: string) => void;
  savePreferences: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ProductCategory[]>(mockProductCategories);
  const [selectedProducts, setSelectedProducts] = useState<{ [categoryId: string]: string[] }>({});
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize selected products from user preferences
    if (user && user.favoriteProducts) {
      const initialSelection: { [categoryId: string]: string[] } = {};
      categories.forEach(category => {
        initialSelection[category.id] = user.favoriteProducts!.filter(productId =>
          category.products.some(product => product.id === productId)
        );
      });
      setSelectedProducts(initialSelection);
    } else {
      // Initialize with empty arrays for each category
      const initialSelection: { [categoryId: string]: string[] } = {};
      categories.forEach(category => {
        initialSelection[category.id] = [];
      });
      setSelectedProducts(initialSelection);
    }
  }, [user, categories]);

  const toggleProduct = (categoryId: string, productId: string) => {
    setSelectedProducts(prev => {
      const categoryProducts = prev[categoryId] || [];
      if (categoryProducts.includes(productId)) {
        return {
          ...prev,
          [categoryId]: categoryProducts.filter(id => id !== productId),
        };
      } else {
        return {
          ...prev,
          [categoryId]: [...categoryProducts, productId],
        };
      }
    });
  };

  const savePreferences = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour enregistrer vos préférences.",
        variant: "destructive",
      });
      return;
    }

    const allSelectedProducts = Object.values(selectedProducts).flat();

    if (allSelectedProducts.length < 3) {
      toast({
        title: "Sélection insuffisante",
        description: "Veuillez sélectionner au moins 3 produits.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUserPreferences({ favoriteProducts: allSelectedProducts });
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

  const value: ProductsContextType = {
    categories,
    selectedProducts,
    toggleProduct,
    savePreferences,
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
