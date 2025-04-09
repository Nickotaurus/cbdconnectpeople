
import { Trophy } from 'lucide-react';
import { RankingCategory } from '@/data/rankingsData';
import RankingItemCard from './RankingItemCard';

interface RankingListProps {
  currentRanking: RankingCategory;
}

const RankingList = ({ currentRanking }: RankingListProps) => {
  const IconComponent = currentRanking.icon;
  
  return (
    <>
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-full">
          <IconComponent className="h-5 w-5 text-amber-400" />
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
