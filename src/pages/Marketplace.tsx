
import { MapPin, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define types
interface ProductCategory {
  name: string;
  image: string;
}

interface CategorySection {
  title: string;
  items: ProductCategory[];
}

const concernsCategories: CategorySection = {
  title: "Par préoccupation",
  items: [
    { name: "Stress et anxiété", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7" },
    { name: "Sommeil", image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04" },
    { name: "Douleur", image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b" },
    { name: "Libido", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Douleurs menstruelles", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901" },
  ]
};

const productCategories: CategorySection = {
  title: "Par produit",
  items: [
    { name: "Fleur", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Résine", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Concentrés", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Huiles", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Gélules", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Gummies", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Tisanes", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Cosmétiques", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Vape", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Pré-roll", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Substituts", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Accessoires", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
    { name: "Animaux", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901" },
    { name: "Box/Coffrets", image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
  ]
};

const MarketplacePage = () => {
  const CategorySection = ({ section }: { section: CategorySection }) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {section.items.map((item, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-40 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Marketplace CBD</h1>
          <p className="text-muted-foreground mb-8">
            Recherchez vos produits par besoin ou par catégorie.
          </p>

          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-10"
            />
          </div>
        </div>

        <CategorySection section={concernsCategories} />
        <CategorySection section={productCategories} />

        <div className="mt-12 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Boostez votre boutique avec la Marketplace Premium !
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Téléchargez votre fichier CSV et laissez notre IA s'occuper du reste. 
            Offrez une promotion exclusive aux clients Premium !
          </p>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium">
            Passer à Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
