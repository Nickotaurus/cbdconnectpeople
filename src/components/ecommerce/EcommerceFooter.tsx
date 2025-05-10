
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EcommerceFooterProps {
  url: string;
}

const EcommerceFooter = ({ url }: EcommerceFooterProps) => {
  return (
    <Button className="w-full gap-2" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Visiter le site <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  );
};

export default EcommerceFooter;
