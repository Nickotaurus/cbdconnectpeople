
import { Badge } from "@/components/ui/badge";

export interface GoogleReviewButtonProps {
  storeId: string;
  store?: string;
}

const GoogleReviewButton = ({ storeId }: GoogleReviewButtonProps) => {
  return (
    <Badge variant="outline" className="bg-gray-100/50 text-gray-700 border-gray-300/30 text-xs cursor-pointer hover:bg-gray-200/50 transition-colors">
      Google Reviews
    </Badge>
  );
};

export default GoogleReviewButton;
