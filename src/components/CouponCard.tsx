
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CouponProps {
  code: string;
  discount: string;
  validUntil: string;
  storeName: string;
}

const CouponCard = ({ code, discount, validUntil, storeName }: CouponProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Code copié!",
      description: `Le code ${code} a été copié dans votre presse-papier.`,
      duration: 3000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="relative border-dashed border-2 border-primary/50 overflow-hidden">
      <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-background rounded-full border-2 border-dashed border-primary/50" />
      <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-background rounded-full border-2 border-dashed border-primary/50" />
      
      <div className="p-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <Scissors className="text-primary h-5 w-5" />
          <span className="text-sm font-medium">Coupon exclusif</span>
        </div>
        
        <h3 className="text-xl font-bold mb-1">{discount}</h3>
        <p className="text-sm text-muted-foreground mb-3">Valable jusqu'au {validUntil}</p>
        
        <div className="flex items-center bg-secondary rounded-md px-3 py-2 mb-3 w-full">
          <code className="font-mono text-base font-bold flex-1 text-center">{code}</code>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 px-2 h-8"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          À présenter en boutique chez {storeName} ou à utiliser sur leur site web
        </p>
      </div>
    </Card>
  );
};

export default CouponCard;
