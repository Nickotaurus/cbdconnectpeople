
import React from 'react';
import { rankings } from '@/data/rankingsData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import StarRating from './StarRating';

interface RankingItemCardProps {
  item: any;
  position: number;
}

const RankingItemCard = ({ item, position }: RankingItemCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-3">
            {position}
          </div>
          <CardTitle className="text-lg">{item.name || "Boutique CBD"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{item.address || "Adresse non disponible"}</span>
        </div>
        <div className="flex items-center">
          <StarRating rating={item.rating || 0} />
          <span className="ml-2 text-sm text-muted-foreground">
            {item.reviewCount || 0} avis
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingItemCard;
