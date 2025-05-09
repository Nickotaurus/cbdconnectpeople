
interface ActiveFiltersProps {
  categories: string[];
  minRating: number;
  maxDistance: number | null;
}

const ActiveFiltersDisplay = ({ categories, minRating, maxDistance }: ActiveFiltersProps) => {
  if (categories.length === 0 && minRating === 0 && maxDistance === null) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {categories.length > 0 && (
        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          {categories.length} catégorie(s)
        </div>
      )}
      
      {minRating > 0 && (
        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          {minRating}+ étoiles
        </div>
      )}
      
      {maxDistance !== null && (
        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          &lt; {maxDistance} km
        </div>
      )}
    </div>
  );
};

export default ActiveFiltersDisplay;
