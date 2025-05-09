
import React from "react";
import { TabsContent } from "@/components/ui/tabs";

interface RankingListProps {
  currentRanking: {
    id: string;
    title: string;
    description: string;
    items: any[];
  };
}

const RankingList = ({ currentRanking }: RankingListProps) => {
  return (
    <TabsContent value={currentRanking.id} className="mt-4">
      <div className="text-center p-4">
        <p>Le classement CBD a été retiré pour se concentrer sur la mise en relation des professionnels.</p>
      </div>
    </TabsContent>
  );
};

export default RankingList;
