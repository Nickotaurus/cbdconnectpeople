
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Image, 
  ExternalLink,
  Search,
  Eye
} from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { Classified, ClassifiedStatus } from '@/types/classified';

// Données mock pour les annonces en attente de validation
const mockPendingClassifieds: Classified[] = [
  {
    id: "ad1",
    type: "sell",
    category: "store",
    title: "Cession de boutique CBD Paris 3ème",
    description: "Boutique de 55m² dans quartier passant, clientèle fidèle, CA en hausse. Vente cause départ à l'étranger.",
    location: "Paris, France",
    price: "85 000 €",
    date: "2023-10-15",
    status: "pending",
    user: { 
      name: "John Doe", 
      id: "u1",
      email: "john.doe@example.com"
    },
    isPremium: true,
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1567449303183-ae0d6ed1c14e?q=80&w=1000", name: "facade.jpg" }
    ],
  },
  {
    id: "ad2",
    type: "buy",
    category: "ecommerce",
    title: "Recherche dropshipping CBD",
    description: "Nous recherchons un partenaire pour nos activités de e-commerce en dropshipping pour des produits de qualité.",
    location: "Lyon, France",
    date: "2023-10-18",
    status: "pending",
    user: { 
      name: "Jane Smith", 
      id: "u2",
      email: "jane.smith@example.com"
    },
    isPremium: false,
    images: [],
  },
  {
    id: "ad3",
    type: "service",
    category: "employer",
    title: "Recrute vendeur/vendeuse CBD",
    description: "Boutique CBD à Bordeaux recrute vendeur(se) avec expérience dans le secteur. Temps plein, CDI après période d'essai.",
    location: "Bordeaux, France",
    date: "2023-10-20",
    status: "pending",
    user: {
      name: "Pierre Dupont",
      id: "u3",
      email: "pierre.dupont@example.com"
    },
    isPremium: true,
    images: [
      { id: "img2", url: "https://images.unsplash.com/photo-1533392151650-269f96231f65?q=80&w=1000", name: "boutique.jpg" },
      { id: "img3", url: "https://images.unsplash.com/photo-1589244159943-460088ed5c83?q=80&w=1000", name: "produits.jpg" }
    ],
  }
];

const AdminClassifiedsPage = () => {
  const { toast } = useToast();
  const [classifieds, setClassifieds] = useState<Classified[]>(mockPendingClassifieds);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClassifiedStatus | 'all'>('pending');
  
  // Filtrer les annonces
  const filteredClassifieds = classifieds.filter(classified => {
    const matchesSearch = 
      classified.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classified.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classified.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || classified.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Approuver une annonce
  const approveClassified = (id: string) => {
    setClassifieds(
      classifieds.map(classified => 
        classified.id === id 
          ? { ...classified, status: 'approved' as const } 
          : classified
      )
    );
    
    toast({
      title: "Annonce approuvée",
      description: "L'annonce a été publiée avec succès."
    });
  };
  
  // Rejeter une annonce
  const rejectClassified = (id: string) => {
    setClassifieds(
      classifieds.map(classified => 
        classified.id === id 
          ? { ...classified, status: 'rejected' as const } 
          : classified
      )
    );
    
    toast({
      title: "Annonce rejetée",
      description: "L'annonce a été rejetée et ne sera pas publiée."
    });
  };
  
  // Formatter le statut pour l'affichage
  const getStatusBadge = (status: ClassifiedStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejetée</Badge>;
      default:
        return null;
    }
  };
  
  // Formatter le type pour l'affichage
  const getTypeBadge = (type: Classified['type']) => {
    switch (type) {
      case 'buy':
        return <Badge className="bg-blue-100 text-blue-800">Achat</Badge>;
      case 'sell':
        return <Badge className="bg-green-100 text-green-800">Vente</Badge>;
      case 'service':
        return <Badge className="bg-purple-100 text-purple-800">Service</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Administration des annonces</h1>
            <p className="text-muted-foreground">
              Validez, modifiez ou rejetez les annonces soumises par les utilisateurs
            </p>
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as ClassifiedStatus | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher dans les annonces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres avancés
          </Button>
        </div>
        
        <div className="rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Annonce</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassifieds.length > 0 ? (
                filteredClassifieds.map((classified) => (
                  <TableRow key={classified.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{classified.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                          {classified.description}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {classified.isPremium && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">Premium</Badge>
                          )}
                          {classified.images && classified.images.length > 0 && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Image className="h-3 w-3" />
                              {classified.images.length} photos
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(classified.type)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{classified.user.name}</div>
                        <div className="text-xs text-muted-foreground">{classified.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(classified.date).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(classified.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {classified.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => approveClassified(classified.id)}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => rejectClassified(classified.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucune annonce ne correspond à vos critères de recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminClassifiedsPage;
