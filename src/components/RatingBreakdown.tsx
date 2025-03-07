
import React from 'react';
import { Star, Flower, Oil, User, Lightbulb } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Store } from '@/utils/data';

interface RatingBreakdownProps {
  store: Store;
  activeSortBy?: string;
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ store, activeSortBy }) => {
  // Calculate category-specific ratings
  const getCategoryRating = (category: string) => {
    const reviews = store.reviews.filter(review => review.category === category);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  };
  
  const ratings = {
    flowers: getCategoryRating('flowers'),
    oils: getCategoryRating('oils'),
    experience: getCategoryRating('experience'),
    originality: getCategoryRating('originality')
  };
  
  // Category display info
  const categories = [
    { 
      id: 'flowers', 
      name: 'Fleurs CBD', 
      icon: Flower, 
      color: 'bg-green-500' 
    },
    { 
      id: 'oils', 
      name: 'Huiles CBD', 
      icon: Oil, 
      color: 'bg-amber-500' 
    },
    { 
      id: 'experience', 
      name: 'Expérience', 
      icon: User, 
      color: 'bg-blue-500' 
    },
    { 
      id: 'originality', 
      name: 'Originalité', 
      icon: Lightbulb, 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium mb-2 flex items-center">
        <Star className="h-4 w-4 mr-1 text-yellow-500" />
        Notes détaillées
      </h4>
      
      <div className="space-y-2">
        {categories.map((category) => {
          const rating = ratings[category.id as keyof typeof ratings];
          const Icon = category.icon;
          const isActive = activeSortBy === category.id;
          
          return (
            <div 
              key={category.id} 
              className={`flex items-center gap-2 ${isActive ? 'bg-background p-1 rounded-md' : ''}`}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${category.color} text-white`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{category.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex-1 flex items-center gap-1">
                <Progress 
                  value={rating * 20} 
                  className={`h-2 ${isActive ? 'bg-secondary' : ''}`}
                />
                <span className="text-xs font-medium min-w-6 text-right">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingBreakdown;
