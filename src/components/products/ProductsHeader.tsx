
import { BookmarkCheck } from 'lucide-react';
import { CardHeader, CardTitle } from "@/components/ui/card";

export const ProductsHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center text-xl">
        <BookmarkCheck className="h-5 w-5 mr-2 text-primary" />
        Sélectionnez vos produits CBD préférés
      </CardTitle>
    </CardHeader>
  );
};
