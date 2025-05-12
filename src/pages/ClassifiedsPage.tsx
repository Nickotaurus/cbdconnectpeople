
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, MapPin, Search, Tag, Clock } from 'lucide-react';
import PublishButton from '@/components/classifieds/PublishButton';
import { Classified, ClassifiedType, ClassifiedCategory } from '@/types/classified';
import { useQuery } from '@tanstack/react-query';
import { classifiedService } from '@/services/classified';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';

const ClassifiedsPage = () => {
  const { user } = useAuth();
  const [activeType, setActiveType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClassifieds, setFilteredClassifieds] = useState<Classified[]>([]);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [selectedClassified, setSelectedClassified] = useState<Classified | null>(null);
  
  // Fetch real classified ads from the database
  const { data: classifieds, isLoading, error } = useQuery({
    queryKey: ['classifieds', 'approved'],
    queryFn: async () => {
      return await classifiedService.getApprovedClassifieds();
    }
  });
  
  useEffect(() => {
    if (classifieds) {
      filterClassifieds(activeType, searchTerm);
    }
  }, [classifieds, activeType, searchTerm]);
  
  const filterClassifieds = (type: string, term: string) => {
    if (!classifieds) return;
    
    let filtered = [...classifieds];
    
    if (type !== 'all') {
      filtered = filtered.filter(classified => classified.type === type);
    }
    
    if (term.trim()) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        classified => 
          classified.title.toLowerCase().includes(lowerTerm) ||
          classified.description.toLowerCase().includes(lowerTerm) ||
          classified.location.toLowerCase().includes(lowerTerm)
      );
    }
    
    setFilteredClassifieds(filtered);
  };
  
  const handleTypeChange = (value: string) => {
    setActiveType(value);
    filterClassifieds(value, searchTerm);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterClassifieds(activeType, term);
  };

  const handleViewClassified = (classified: Classified) => {
    if (user) {
      // Si l'utilisateur est connecté, on pourrait le rediriger vers la page détaillée de l'annonce
      // Pour l'instant, nous pourrions simplement stocker l'annonce sélectionnée
      setSelectedClassified(classified);
      // Ici, vous pourriez ajouter une redirection vers une page d'annonce détaillée
      // navigate(`/classifieds/${classified.id}`);
      console.log("Voir l'annonce:", classified.title);
    } else {
      // Si l'utilisateur n'est pas connecté, afficher la boîte de dialogue de connexion
      setSelectedClassified(classified);
      setLoginDialogOpen(true);
    }
  };
  
  const getTypeLabel = (type: ClassifiedType) => {
    switch (type) {
      case 'buy': return 'Achat';
      case 'sell': return 'Vente';
      case 'service': return 'Service';
      default: return type;
    }
  };
  
  const getCategoryLabel = (category: ClassifiedCategory) => {
    switch (category) {
      case 'store': return 'Boutique CBD';
      case 'ecommerce': return 'E-commerce CBD';
      case 'realestate': return 'Immobilier CBD';
      case 'employer': return 'Employeur CBD';
      case 'employee': return 'Employé CBD';
      default: return category;
    }
  };
  
  const getTypeBadgeColor = (type: ClassifiedType) => {
    switch (type) {
      case 'buy': return 'bg-blue-100 text-blue-800';
      case 'sell': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Petites Annonces CBD</h1>
          <p className="text-muted-foreground mb-6">
            Achetez, vendez et échangez des biens et services liés au CBD
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une annonce..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            
            <Button variant="default" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
            
            <Button variant="default" className="gap-2">
              <MapPin className="h-4 w-4" />
              Carte
            </Button>
          </div>
          
          <Tabs defaultValue="all" onValueChange={handleTypeChange} className="w-full max-w-3xl mx-auto">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="buy">Achat</TabsTrigger>
              <TabsTrigger value="sell">Vente</TabsTrigger>
              <TabsTrigger value="service">Services</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {user ? (
            <PublishButton />
          ) : (
            <div className="bg-secondary/30 rounded-lg p-4 mb-10 max-w-lg mx-auto">
              <p className="text-sm">
                Vous souhaitez publier une annonce ? <Link to="/register" className="text-primary font-medium hover:underline">Créez un compte gratuit</Link> pour commencer.
              </p>
            </div>
          )}
        </div>
        
        {isLoading ? (
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
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Une erreur est survenue lors du chargement des annonces. Veuillez réessayer plus tard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassifieds.map(classified => (
              <Card key={classified.id} className={cn("overflow-hidden", classified.isPremium && "border-2 border-primary")}>
                {classified.images && classified.images.length > 0 && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={classified.images[0].url}
                      alt={classified.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardHeader className={cn("pb-2", !classified.images && "pt-6")}>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getTypeBadgeColor(classified.type)}>
                      {getTypeLabel(classified.type)}
                    </Badge>
                    {classified.isPremium && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl">{classified.title}</CardTitle>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <CardDescription>{classified.location}</CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {classified.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-gray-50">
                      <Tag className="h-3 w-3 mr-1" />
                      {getCategoryLabel(classified.category)}
                    </Badge>
                    
                    {classified.price && (
                      <Badge variant="secondary" className="font-semibold">
                        {classified.price}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(classified.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </div>
                  
                  <Button 
                    variant="default"
                    onClick={() => handleViewClassified(classified)}
                  >
                    Voir l'annonce
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoading && !error && filteredClassifieds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune annonce ne correspond à votre recherche.</p>
          </div>
        )}

        {/* Boîte de dialogue pour inciter à la création de compte */}
        <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créez un compte pour voir les détails</DialogTitle>
              <DialogDescription>
                Pour accéder aux détails de cette annonce et contacter l'annonceur, vous devez créer un compte ou vous connecter.
              </DialogDescription>
            </DialogHeader>
            
            {selectedClassified && (
              <div className="py-4">
                <h3 className="font-medium mb-1">{selectedClassified.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{selectedClassified.description}</p>
              </div>
            )}
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" asChild className="sm:flex-1">
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button asChild className="sm:flex-1">
                <Link to="/register">Créer un compte</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default ClassifiedsPage;
