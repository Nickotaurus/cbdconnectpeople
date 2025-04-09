
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Tag, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PromoCodePopoverProps {
  itemName: string;
  itemType: string;
}

const PromoCodePopover = ({ itemName, itemType }: PromoCodePopoverProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate a pseudo-random promo code based on the item name
  const generatePromoCode = (name: string, type: string) => {
    const prefix = type.substring(0, 3).toUpperCase();
    const nameCode = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${nameCode}-${randomNum}`;
  };
  
  const promoCode = generatePromoCode(itemName, itemType);
  const discount = Math.floor(10 + Math.random() * 15); // Random discount between 10-25%
  
  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    
    toast({
      title: "Code promo copié !",
      description: `Le code ${promoCode} a été copié dans votre presse-papier.`,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Lock className="h-4 w-4" />
              Code promo
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connectez-vous pour accéder aux codes promo exclusifs</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Tag className="h-4 w-4" />
          Code promo
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-medium">Code promo exclusif</h4>
            <p className="text-sm text-muted-foreground">Économisez {discount}% chez {itemName}</p>
          </div>
          
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <code className="font-mono text-sm font-bold">{promoCode}</code>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyPromoCode}
              className="h-8 w-8 p-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Ce code est valable jusqu'au {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PromoCodePopover;
