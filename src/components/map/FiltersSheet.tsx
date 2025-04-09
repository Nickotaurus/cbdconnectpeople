
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const FiltersSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Filtrer les résultats</h3>
          
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Catégories de produits</h4>
              <div className="space-y-2">
                {['Fleurs CBD', 'Huiles CBD', 'Cosmétiques', 'Infusions', 'Résines'].map((category) => (
                  <div key={category} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={category} 
                      className="h-4 w-4 rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor={category} className="ml-2 text-sm">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Note minimum</h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button 
                    key={rating}
                    className="h-8 w-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80"
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Distance maximale</h4>
              <div className="space-y-2">
                {['< 1 km', '< 5 km', '< 10 km', '< 20 km', 'Toutes les distances'].map((distance) => (
                  <div key={distance} className="flex items-center">
                    <input 
                      type="radio" 
                      id={distance} 
                      name="distance"
                      className="h-4 w-4 rounded-full text-primary focus:ring-primary"
                    />
                    <label htmlFor={distance} className="ml-2 text-sm">
                      {distance}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-6 space-x-2 flex justify-between">
            <Button variant="outline" className="flex-1">
              Réinitialiser
            </Button>
            <SheetClose asChild>
              <Button className="flex-1">
                Appliquer
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSheet;
