
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classifiedService } from "@/services/classified";
import { Classified, ClassifiedStatus } from "@/types/classified";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for admin operations on classifieds
 * Provides functions to filter, approve, and reject classifieds
 */
export const useClassifiedsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ClassifiedStatus | 'all'>('pending');
  
  // Get classifieds based on status filter
  const { 
    data: classifieds, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['classifieds', statusFilter],
    queryFn: async () => {
      try {
        if (statusFilter === 'all') {
          return await classifiedService.getClassifiedsByStatus();
        } else {
          return await classifiedService.getClassifiedsByStatus(statusFilter);
        }
      } catch (error) {
        console.error("Error fetching classifieds:", error);
        throw new Error("Failed to load classifieds. Please try again later.");
      }
    }
  });
  
  // Mutation to update classified status to 'approved'
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
  
  // Mutation to update classified status to 'rejected'
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

  // Delete a classified
  const { mutate: deleteClassified } = useMutation({
    mutationFn: (classifiedId: string) => 
      classifiedService.deleteClassified(classifiedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classifieds'] });
      toast({
        title: "Annonce supprimée",
        description: "L'annonce a été supprimée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'annonce.",
        variant: "destructive"
      });
      console.error("Erreur lors de la suppression de l'annonce:", error);
    }
  });
  
  /**
   * Check if classified is a job posting
   */
  const isJobClassified = (classified: Classified): boolean => {
    return classified.type === 'service' && 
           (classified.category === 'employer' || classified.category === 'employee');
  };
  
  /**
   * Extract job related information from classified description
   */
  const extractJobInfo = (classified: Classified) => {
    if (!isJobClassified(classified)) return null;
    
    const jobInfo = {
      jobType: '',
      contractType: '',
      experience: '',
      salary: '',
      companyName: '',
      contactEmail: ''
    };
    
    const description = classified.description;
    
    // Extract job information from description using regex
    const typeMatch = description.match(/Type de poste\s*:\s*([^\n]+)/);
    if (typeMatch) jobInfo.jobType = typeMatch[1].trim();
    
    const contractMatch = description.match(/Type de contrat\s*:\s*([^\n]+)/);
    if (contractMatch) jobInfo.contractType = contractMatch[1].trim();
    
    const experienceMatch = description.match(/Expérience requise\s*:\s*([^\n]+)/);
    if (experienceMatch) jobInfo.experience = experienceMatch[1].trim();
    
    const salaryMatch = description.match(/Salaire\s*:\s*([^\n]+)/);
    if (salaryMatch) jobInfo.salary = salaryMatch[1].trim();
    
    const companyMatch = description.match(/Entreprise\s*:\s*([^\n]+)/);
    if (companyMatch) jobInfo.companyName = companyMatch[1].trim();
    
    const contactMatch = description.match(/Contact\s*:\s*([^\n]+)/);
    if (contactMatch) jobInfo.contactEmail = contactMatch[1].trim();
    
    return jobInfo;
  };

  return {
    classifieds,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    approveClassified,
    rejectClassified,
    deleteClassified,
    isJobClassified,
    extractJobInfo
  };
};
