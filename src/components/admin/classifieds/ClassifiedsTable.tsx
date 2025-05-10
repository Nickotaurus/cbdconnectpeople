
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Eye, Trash2, Image } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Classified, ClassifiedStatus, ClassifiedType } from "@/types/classified";

interface ClassifiedsTableProps {
  classifieds: Classified[];
  approveClassified: (id: string) => void;
  rejectClassified: (id: string) => void;
  deleteClassified: (id: string) => void;
}

export const ClassifiedsTable = ({
  classifieds,
  approveClassified,
  rejectClassified,
  deleteClassified
}: ClassifiedsTableProps) => {
  const [classifiedToDelete, setClassifiedToDelete] = useState<string | null>(null);

  // Format the status for display
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
  
  // Format the type for display
  const getTypeBadge = (type: ClassifiedType) => {
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
  
  return (
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
          {classifieds.length > 0 ? (
            classifieds.map((classified) => (
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
  );
};
