
import { ProductCategory } from "@/types/product";

export const mockProductCategories: ProductCategory[] = [
  {
    id: "flowers",
    name: "Fleurs CBD",
    products: [
      {
        id: "flower1",
        name: "Amnesia",
        description: "Fleur de CBD premium avec arômes citronnés",
        subCategory: "Indoor"
      },
      {
        id: "flower2",
        name: "OG Kush",
        description: "Fleur de CBD aux notes terreuses et épicées",
        subCategory: "Indoor"
      },
      {
        id: "flower3",
        name: "Strawberry",
        description: "Fleur de CBD aux arômes fruités de fraise",
        subCategory: "Greenhouse"
      }
    ]
  },
  {
    id: "oils",
    name: "Huiles CBD",
    products: [
      {
        id: "oil1",
        name: "Huile Full Spectrum 5%",
        description: "Huile complète avec tous les cannabinoïdes"
      },
      {
        id: "oil2",
        name: "Huile Broad Spectrum 10%",
        description: "Huile sans THC mais avec autres cannabinoïdes"
      },
      {
        id: "oil3",
        name: "Huile Isolat 15%",
        description: "Huile pure à base d'isolat de CBD"
      }
    ]
  },
  {
    id: "edibles",
    name: "Comestibles",
    products: [
      {
        id: "edible1",
        name: "Gummies CBD",
        description: "Bonbons gélifiés infusés au CBD"
      },
      {
        id: "edible2", 
        name: "Chocolat au CBD",
        description: "Chocolat noir infusé au CBD"
      }
    ]
  }
];

// Fonction pour obtenir les produits par catégorie
export const getProductsByCategory = () => {
  const productsByCategory: Record<string, any[]> = {};
  
  mockProductCategories.forEach(category => {
    productsByCategory[category.name] = category.products;
  });
  
  return productsByCategory;
};
