
import { BookmarkCheck, Search } from 'lucide-react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

export const ProductsHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <CardHeader>
      <CardTitle className="flex items-center text-xl mb-4">
        <BookmarkCheck className="h-5 w-5 mr-2 text-primary" />
        Sélectionnez vos produits CBD préférés
      </CardTitle>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un produit..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </CardHeader>
  );
};

