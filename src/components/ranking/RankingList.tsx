
import { RankingCategory } from '@/data/rankingsData';
import RankingItemCard from './RankingItemCard';

interface RankingListProps {
  currentRanking: RankingCategory;
}

const RankingList = ({ currentRanking }: RankingListProps) => {
  const IconComponent = currentRanking.icon;
  
  // Determine background and text colors based on category
  const getBgColorClass = () => {
    switch(currentRanking.id) {
      case 'stores': return 'bg-violet-100 text-violet-600';
      case 'ecommerce': return 'bg-blue-100 text-blue-600';
      case 'flowers': return 'bg-green-100 text-green-600';
      case 'resins': return 'bg-amber-100 text-amber-700';
      case 'oils': return 'bg-red-100 text-red-600';
      default: return 'bg-primary/5';
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${getBgColorClass()}`}>
          <IconComponent className="h-5 w-5" />
          <h2 className="text-xl font-bold">{currentRanking.name}</h2>
        </div>
      </div>
      
      <div className="space-y-6">
        {currentRanking.items.map((item, index) => (
          <RankingItemCard 
            key={item.id} 
            item={item} 
            index={index} 
          />
        ))}
      </div>
    </>
  );
};

export default RankingList;
