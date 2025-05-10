
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Image, 
  Search,
  Eye,
  Trash2
} from "lucide-react";
import { useState } from 'react';
import { useClassifiedsAdmin } from "@/hooks/useClassifiedsAdmin";
import { ClassifiedStatus, Classified } from '@/types/classified';

const AdminClassifiedsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classifiedToDelete, setClassifiedToDelete] = useState<string | null>(null);
  
  const {
    classifieds,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    approveClassified,
    rejectClassified,
    deleteClassified
  } = useClassifiedsAdmin();
  
  // Filtrer les annonces par recherche
  const filteredClassifieds = classifieds?.filter(classified => {
    const matchesSearch = 
      classified.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classified.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classified.user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];
  
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

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (classifiedToDelete) {
      deleteClassified(classifiedToDelete);
      setClassifiedToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Chargement des annonces...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600">Une erreur est survenue</h1>
          <p className="mt-4">Impossible de charger les annonces. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }
  
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
                        <div>{classified.user.name || 'Utilisateur inconnu'}</div>
                        <div className="text-xs text-muted-foreground">{classified.user.email || ''}</div>
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

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setClassifiedToDelete(classified.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setClassifiedToDelete(null)}>
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
