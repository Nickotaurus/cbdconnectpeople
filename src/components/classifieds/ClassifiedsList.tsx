
import React from 'react';
import { Classified } from '@/types/classified';
import ClassifiedCard from './ClassifiedCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ClassifiedsListProps {
  classifieds: Classified[];
  isLoading: boolean;
  error: unknown;
  onViewClassified: (classified: Classified) => void;
}

const ClassifiedsList = ({ classifieds, isLoading, error, onViewClassified }: ClassifiedsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48">
              <Skeleton className="w-full h-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Une erreur est survenue lors du chargement des annonces. Veuillez réessayer plus tard.
        </p>
      </div>
    );
  }

  if (classifieds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune annonce ne correspond à votre recherche.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classifieds.map(classified => (
        <ClassifiedCard 
          key={classified.id} 
          classified={classified} 
          onViewClick={onViewClassified} 
        />
      ))}
    </div>
  );
};

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default ClassifiedsList;
