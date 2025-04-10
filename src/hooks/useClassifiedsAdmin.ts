
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classifiedService } from "@/services/classifiedService";
import { Classified, ClassifiedStatus } from "@/types/classified";
import { useToast } from "@/components/ui/use-toast";

export const useClassifiedsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ClassifiedStatus | 'all'>('pending');
  
  // Récupérer les annonces filtrées par statut
  const { data: classifieds, isLoading, error } = useQuery({
    queryKey: ['classifieds', statusFilter],
    queryFn: async () => {
      if (statusFilter === 'all') {
        return await classifiedService.getClassifiedsByStatus();
      } else {
        return await classifiedService.getClassifiedsByStatus(statusFilter);
      }
    }
  });
  
  // Mutation pour approuver une annonce
  const { mutate: approveClassified } = useMutation({
    mutationFn: (classifiedId: string) => 
      classifiedService.updateClassifiedStatus(classifiedId, 'approved'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classifieds'] });
      toast({
        title: "Annonce approuvée",
        description: "L'annonce a été publiée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'annonce.",
        variant: "destructive"
      });
      console.error("Erreur lors de l'approbation de l'annonce:", error);
    }
  });
  
  // Mutation pour rejeter une annonce
  const { mutate: rejectClassified } = useMutation({
    mutationFn: (classifiedId: string) => 
      classifiedService.updateClassifiedStatus(classifiedId, 'rejected'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classifieds'] });
      toast({
        title: "Annonce rejetée",
        description: "L'annonce a été rejetée."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'annonce.",
        variant: "destructive"
      });
      console.error("Erreur lors du rejet de l'annonce:", error);
    }
  });

  return {
    classifieds,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    approveClassified,
    rejectClassified
  };
};
