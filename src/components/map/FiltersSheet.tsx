
import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FiltersSheetProps {
  onApplyFilters: (filters: {
    categories: string[];
    minRating: number;
    maxDistance: number | null;
  }) => void;
}

const FiltersSheet = ({ onApplyFilters }: FiltersSheetProps) => {
  // State for the different filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);

  // Product categories
  const productCategories = ['Fleurs CBD', 'Huiles CBD', 'Cosmétiques', 'Infusions', 'Résines'];

  // Handle category checkbox change
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  // Reset all filters
  const handleReset = () => {
    setSelectedCategories([]);
    setMinRating(0);
    setMaxDistance(null);
  };

  // Apply the filters
  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      minRating,
      maxDistance
    });
  };

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
                {productCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={category} 
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category, checked === true)
                      }
                    />
                    <label htmlFor={category} className="text-sm">
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
                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                      minRating >= rating 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    onClick={() => setMinRating(rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Distance maximale</h4>
              <RadioGroup 
                value={maxDistance?.toString() || 'all'} 
                onValueChange={(value) => {
                  if (value === 'all') {
                    setMaxDistance(null);
                  } else {
                    setMaxDistance(parseInt(value, 10));
                  }
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="r1" />
                    <label htmlFor="r1" className="text-sm">{'< 1 km'}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="r2" />
                    <label htmlFor="r2" className="text-sm">{'< 5 km'}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10" id="r3" />
                    <label htmlFor="r3" className="text-sm">{'< 10 km'}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="20" id="r4" />
                    <label htmlFor="r4" className="text-sm">{'< 20 km'}</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="r5" />
                    <label htmlFor="r5" className="text-sm">{'Toutes les distances'}</label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="pt-6 space-x-2 flex justify-between">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Réinitialiser
            </Button>
            <SheetClose asChild>
              <Button className="flex-1" onClick={handleApply}>
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
