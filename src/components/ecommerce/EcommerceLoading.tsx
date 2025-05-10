
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface EcommerceLoadingProps {
  count?: number;
}

const EcommerceLoading = ({ count = 6 }: EcommerceLoadingProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="h-24 bg-muted"></div>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </CardContent>
          <CardFooter>
            <div className="h-10 bg-muted rounded w-full"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EcommerceLoading;
