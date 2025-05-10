
import { useState } from 'react';
import { Star } from 'lucide-react';

interface EcommerceRatingProps {
  rating: number;
  reviewCount: number;
  isLoadingReviews?: boolean;
  isGoogleReview?: boolean;
}

const EcommerceRating = ({ 
  rating, 
  reviewCount, 
  isLoadingReviews = false,
  isGoogleReview = false 
}: EcommerceRatingProps) => {
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoadingReviews) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        <span className="text-xs text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="mb-3">
      {renderStars(rating)}
      <p className="text-xs text-muted-foreground mt-1">
        {reviewCount} avis {isGoogleReview ? 'Google' : 'clients'}
      </p>
    </div>
  );
};

export default EcommerceRating;
