
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import type { Store } from '@/utils/data';
import { getReviewsByCategory } from '@/utils/data';

interface ReviewSectionProps {
  reviews: Store['reviews'];
}

const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const displayReviews = activeTab === "all" 
    ? reviews 
    : getReviewsByCategory(reviews, activeTab);
  
  const categoryLabels: Record<string, string> = {
    all: "Tous les avis",
    flowers: "Fleurs CBD",
    oils: "Huiles CBD",
    experience: "Expérience",
    originality: "Originalité"
  };
  
  const getCategoryCount = (category: string) => {
    if (category === "all") return reviews.length;
    return getReviewsByCategory(reviews, category).length;
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TabsTrigger key={key} value={key} className="relative">
              {label}
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {getCategoryCount(key)}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-4">
          <div className="space-y-4">
            {displayReviews.length > 0 ? (
              displayReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Aucun avis dans cette catégorie
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ReviewCardProps {
  review: Store['reviews'][0];
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  // Parse the date
  const date = new Date(review.date);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }).format(date);
  
  return (
    <Card className="transition-all duration-300 hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-medium">{review.author}</p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
        
        <p className="text-sm mt-2">{review.text}</p>
        
        <div className="flex items-center gap-4 mt-3">
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Utile</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>Pas utile</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
