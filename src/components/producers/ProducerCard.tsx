
import { MapPin, Leaf, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Producer {
  id: string;
  name: string;
  location: string;
  description: string;
  certifications: string[];
  cultivationType: string;
  varieties: string[];
  wholesaleOnly: boolean;
  imageUrl: string;
  distance: number;
}

interface ProducerCardProps {
  producer: Producer;
  isStore: boolean;
}

const ProducerCard = ({ producer, isStore }: ProducerCardProps) => {
  return (
    <Card key={producer.id} className="overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={producer.imageUrl} 
          alt={producer.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{producer.name}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 font-normal">
            <Leaf className="h-3 w-3" />
            {producer.cultivationType}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {producer.location} • <span>{producer.distance} km</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-muted-foreground mb-3">{producer.description}</p>
        
        <div className="mb-3">
          <p className="text-xs font-medium mb-1.5">Certifications:</p>
          <div className="flex flex-wrap gap-1.5">
            {producer.certifications.map(cert => (
              <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                {cert}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-xs font-medium mb-1.5">Variétés cultivées:</p>
          <div className="flex flex-wrap gap-1.5">
            {producer.varieties.map(variety => (
              <Badge key={variety} variant="outline" className="text-xs">
                {variety}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {isStore ? (
          <Button className="w-full">Contacter</Button>
        ) : (
          <Button variant="outline" className="w-full">Voir le détail</Button>
        )}
      </CardFooter>
      
      {producer.wholesaleOnly && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-primary-foreground">Vente en gros uniquement</Badge>
        </div>
      )}
    </Card>
  );
};

export default ProducerCard;
