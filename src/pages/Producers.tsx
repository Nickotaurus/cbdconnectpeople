
import { useState } from 'react';
import { MapPin, Filter, Search, Leaf, Award, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for producers - In a real app, this would come from an API
const mockProducers = [
  {
    id: "p1",
    name: "Chanvre des Alpes",
    location: "Grenoble, France",
    description: "Producteur de chanvre biologique dans les Alpes françaises. Culture en extérieur avec méthodes traditionnelles.",
    certifications: ["Bio", "Sans pesticides"],
    cultivationType: "Outdoor",
    varieties: ["CBD Kush", "Charlotte's Web", "ACDC"],
    wholesaleOnly: false,
    imageUrl: "https://images.unsplash.com/photo-1589244159943-460088ed5c83?q=80&w=1000",
    distance: 120,
  },
  {
    id: "p2",
    name: "CBD Provence",
    location: "Aix-en-Provence, France",
    description: "Exploitation familiale spécialisée dans la culture de chanvre CBD de haute qualité sous le soleil de Provence.",
    certifications: ["Bio", "Eco-responsable"],
    cultivationType: "Greenhouse",
    varieties: ["Harlequin", "Critical Mass CBD", "Swiss Dream"],
    wholesaleOnly: true,
    imageUrl: "https://images.unsplash.com/photo-1625963580916-21eb7ea8d935?q=80&w=1000",
    distance: 245,
  },
  {
    id: "p3",
    name: "Loire Hemp",
    location: "Nantes, France",
    description: "Culture indoor de variétés CBD sélectionnées pour leur taux de cannabinoïdes et leurs profils terpéniques uniques.",
    certifications: ["Qualité Premium"],
    cultivationType: "Indoor",
    varieties: ["Candida", "Royal Medic", "Dinamed CBD"],
    wholesaleOnly: false,
    imageUrl: "https://images.unsplash.com/photo-1536819114556-1c10b30f9d94?q=80&w=1000",
    distance: 78,
  },
];

const Producers = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducers, setFilteredProducers] = useState(mockProducers);
  
  const isStore = user?.role === "store";
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredProducers(mockProducers);
      return;
    }
    
    const filtered = mockProducers.filter(
      producer => 
        producer.name.toLowerCase().includes(term.toLowerCase()) ||
        producer.location.toLowerCase().includes(term.toLowerCase()) ||
        producer.varieties.some(v => v.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredProducers(filtered);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Producteurs de CBD en France</h1>
          <p className="text-muted-foreground">
            {isStore 
              ? "Connectez-vous directement avec les meilleurs producteurs de CBD et de chanvre" 
              : "Découvrez les producteurs qui fournissent les meilleures boutiques CBD en France"}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, région ou variété..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                Tous les producteurs
              </DropdownMenuItem>
              <DropdownMenuItem>
                Culture indoor
              </DropdownMenuItem>
              <DropdownMenuItem>
                Culture outdoor
              </DropdownMenuItem>
              <DropdownMenuItem>
                Certifié Bio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Proximité
          </Button>
        </div>
        
        {!isStore && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm">
              Vous êtes un professionnel ? <a href="/register" className="text-primary font-medium hover:underline">Créez un compte boutique</a> pour contacter directement les producteurs.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducers.map(producer => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Producers;
